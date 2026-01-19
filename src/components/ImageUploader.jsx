import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, ImageIcon, Maximize, Crop } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export function ImageUploader({ onUpload, hasImages }) {
    const onDrop = useCallback(acceptedFiles => {
        onUpload(acceptedFiles);
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        }
    });

    if (hasImages) return null;

    return (
        <div className="flex-1 flex flex-col items-center justify-start p-8 overflow-y-auto">

            {/* Header Section */}
            <div className="text-center mb-8 pt-8">
                <h1 className="text-4xl font-bold mb-3 tracking-tight">Crop Image</h1>
                <p className="text-lg text-muted-foreground">Quickly crop image files online for free!</p>
            </div>

            {/* Upload Area */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                {...getRootProps()}
                className={cn(
                    "w-full max-w-3xl aspect-[2.5/1] min-h-[300px] border-2 border-dashed border-indigo-300/50 bg-[#6366f1]/5 rounded-xl flex flex-col items-center justify-center gap-6 cursor-pointer transition-all hover:bg-[#6366f1]/10 hover:border-indigo-400 relative overflow-hidden group",
                    isDragActive && "border-indigo-500 bg-[#6366f1]/20 scale-105 shadow-xl"
                )}
            >
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity"
                    style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />

                <input {...getInputProps()} />

                {/* Icon */}
                <div className="w-24 h-24 text-indigo-500/80 mb-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                </div>

                {/* Button */}
                <button className="px-8 py-3 bg-[#333538] text-white rounded-lg font-medium flex items-center gap-3 shadow-lg hover:bg-black transition-colors z-10">
                    <Upload className="w-5 h-5" />
                    <span className="text-lg">Select Image</span>
                    <span className="w-px h-5 bg-white/20 mx-1"></span>
                    <span className="text-xs opacity-70">▼</span>
                </button>

                {/* Helper Text */}
                <div className="text-center z-10">
                    <p className="text-indigo-950 dark:text-indigo-200 font-medium text-lg">or, drag and drop an image here</p>
                    <p className="text-sm text-indigo-400/80 mt-2">Max file size: 10 MB. Sign up for more.</p>
                </div>
            </motion.div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl w-full mt-24">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 text-foreground">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Quick and Easy to Use</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Crop images easily by drawing a crop rectangle on them. No need to upload. We crop photos right on your browser.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 text-foreground">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Crop Image to Any Size</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Crop your image to an exact pixel size to share them without leaving out parts or distorting them.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 text-foreground">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <path d="M21 15l-5-5L5 21" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Crop to Any Aspect Ratio</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Choose from many different crop aspect ratios to get the best composition for your photo.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
