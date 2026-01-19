import React, { useState, useMemo } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, LayoutTemplate } from 'lucide-react';
import { SidebarControls } from './components/SidebarControls';
import { ImageGrid } from './components/ImageGrid';
import { ImageUploader } from './components/ImageUploader';
import { ImageEditor } from './components/ImageEditor';

function App() {
  const [images, setImages] = useState([]);
  const [aspectRatio, setAspectRatio] = useState('free');
  const [orientation, setOrientation] = useState('portrait');
  const [editingImageId, setEditingImageId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Parse Aspect Ratio
  const currentAspectRatioValue = useMemo(() => {
    if (aspectRatio === 'free') return null;
    const [w, h] = aspectRatio.split('/').map(Number);
    if (orientation === 'landscape') {
      const ratio = w / h;
      if (ratio < 1) return 1 / ratio;
      return ratio;
    } else {
      const ratio = w / h;
      if (ratio > 1) return 1 / ratio;
      return ratio;
    }
  }, [aspectRatio, orientation]);

  const handleUpload = (files) => {
    const newImages = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      originalUrl: URL.createObjectURL(file),
      previewUrl: null,
      cropData: null,
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const activeImageIndex = images.findIndex(img => img.id === editingImageId);

  const handleEditorSave = (id, data) => {
    setImages(prev => prev.map(img => {
      if (img.id === id) {
        return { ...img, ...data };
      }
      return img;
    }));
  };

  const cropImageOnCanvas = (imageUrl, cropData) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageUrl;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const { x, y, width, height } = cropData;

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(
          image,
          x, y, width, height,
          0, 0, width, height
        );

        canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
      };
      image.onerror = reject;
    });
  };

  const handleExport = async () => {
    if (images.length === 0) return;
    setIsExporting(true);

    try {
      const zip = new JSZip();

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const fileName = img.file.name;

        let blob = null;

        if (img.cropData) {
          blob = await cropImageOnCanvas(img.originalUrl, img.cropData);
        } else {
          blob = img.file;
        }

        if (blob) {
          zip.file(`cropped_${fileName}`, blob);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "cropped_images.zip");

    } catch (error) {
      console.error("Export failed", error);
      alert("Failed to export images.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-background text-foreground overflow-hidden font-sans selection:bg-primary/20">

      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden md:block">
        <SidebarControls
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          orientation={orientation}
          setOrientation={setOrientation}
          onUpload={() => document.getElementById('hidden-upload-input')?.click()}
          onExport={handleExport}
          isExporting={isExporting}
          onRemoveAll={() => setImages([])}
          imageCount={images.length}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {showMobileSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSidebar(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl z-50 max-h-[85vh] overflow-y-auto"
            >
              {/* Handle */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-1 bg-border rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3 border-b border-border">
                <h3 className="font-semibold text-lg">Settings</h3>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="p-2 hover:bg-secondary rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Sidebar Content */}
              <div className="p-5">
                <SidebarControls
                  aspectRatio={aspectRatio}
                  setAspectRatio={setAspectRatio}
                  orientation={orientation}
                  setOrientation={setOrientation}
                  onUpload={() => {
                    setShowMobileSidebar(false);
                    document.getElementById('hidden-upload-input')?.click();
                  }}
                  onExport={() => {
                    setShowMobileSidebar(false);
                    handleExport();
                  }}
                  isExporting={isExporting}
                  onRemoveAll={() => setImages([])}
                  imageCount={images.length}
                  isMobile={true}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <input
        id="hidden-upload-input"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />

      <main className="flex-1 flex flex-col relative h-[100dvh]">
        {/* Mobile Header - Only visible on mobile */}
        <div className="md:hidden flex items-center gap-2 p-4 border-b border-border bg-card">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutTemplate className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">BulkCrop</h1>
        </div>

        {images.length === 0 ? (
          <ImageUploader onUpload={handleUpload} hasImages={false} />
        ) : (
          <>
            <ImageGrid
              images={images}
              onRemove={(id) => setImages(prev => prev.filter(img => img.id !== id))}
              onEdit={(id) => setEditingImageId(id)}
            />

            {/* Mobile Bottom Bar with Settings Button */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-30">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowMobileSidebar(true)}
                  className="flex-1 py-3 bg-secondary text-secondary-foreground font-medium rounded-lg flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting || images.length === 0}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-lg disabled:opacity-50"
                >
                  {isExporting ? 'Processing...' : 'Download All'}
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {editingImageId && (
        <ImageEditor
          image={images.find(img => img.id === editingImageId)}
          onClose={() => setEditingImageId(null)}
          onSave={handleEditorSave}
          onNext={() => {
            const nextIndex = activeImageIndex + 1;
            if (nextIndex < images.length) setEditingImageId(images[nextIndex].id);
            else setEditingImageId(null);
          }}
          onPrev={() => {
            const prevIndex = activeImageIndex - 1;
            if (prevIndex >= 0) setEditingImageId(images[prevIndex].id);
          }}
          hasNext={activeImageIndex < images.length - 1}
          hasPrev={activeImageIndex > 0}
          aspectRatioValue={currentAspectRatioValue}
          aspectRatioLabel={aspectRatio === 'free' ? 'Freeform' : aspectRatio.replace('/', ':')}
          orientation={orientation}
        />
      )}

    </div>
  );
}

export default App;
