import React, { useState, useRef, useEffect, useCallback } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { X, Check, ChevronLeft, ChevronRight, RefreshCw, Settings, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function ImageEditor({
    image,
    onClose,
    onSave,
    onNext,
    onPrev,
    hasNext,
    hasPrev,
    aspectRatioValue,
    aspectRatioLabel,
    orientation
}) {
    const cropperRef = useRef(null);
    const [cropWidth, setCropWidth] = useState(0);
    const [cropHeight, setCropHeight] = useState(0);
    const [positionX, setPositionX] = useState(0);
    const [positionY, setPositionY] = useState(0);
    const [isUpdatingFromCropper, setIsUpdatingFromCropper] = useState(false);
    const [isCropperReady, setIsCropperReady] = useState(false);
    const [showMobileSettings, setShowMobileSettings] = useState(false);

    // Sync crop data from Cropper to our state
    const syncFromCropper = useCallback(() => {
        if (!cropperRef.current || isUpdatingFromCropper || !isCropperReady) return;

        const cropper = cropperRef.current.cropper;
        const data = cropper.getData(true);

        setCropWidth(Math.round(data.width));
        setCropHeight(Math.round(data.height));
        setPositionX(Math.round(data.x));
        setPositionY(Math.round(data.y));
    }, [isUpdatingFromCropper, isCropperReady]);

    // Save current crop state
    const saveCurrentState = useCallback(() => {
        if (cropperRef.current && isCropperReady) {
            const cropper = cropperRef.current.cropper;
            const cropData = cropper.getData();
            const canvas = cropper.getCroppedCanvas({ width: 300, height: 300 });
            const previewUrl = canvas ? canvas.toDataURL() : null;

            onSave(image.id, {
                cropData,
                previewUrl
            });
        }
    }, [image.id, onSave, isCropperReady]);

    // Handle width input change - NO RESTRICTIONS
    const handleWidthChange = (value) => {
        const newWidth = parseInt(value) || 0;
        setCropWidth(newWidth);

        if (cropperRef.current && newWidth > 0 && isCropperReady) {
            const cropper = cropperRef.current.cropper;
            const currentData = cropper.getData();

            let newHeight = cropHeight;

            if (aspectRatioValue) {
                newHeight = Math.round(newWidth / aspectRatioValue);
                setCropHeight(newHeight);
            }

            setIsUpdatingFromCropper(true);
            cropper.setData({
                ...currentData,
                width: newWidth,
                height: newHeight
            });
            setTimeout(() => setIsUpdatingFromCropper(false), 100);
        }
    };

    // Handle height input change - NO RESTRICTIONS
    const handleHeightChange = (value) => {
        const newHeight = parseInt(value) || 0;
        setCropHeight(newHeight);

        if (cropperRef.current && newHeight > 0 && isCropperReady) {
            const cropper = cropperRef.current.cropper;
            const currentData = cropper.getData();

            let newWidth = cropWidth;

            if (aspectRatioValue) {
                newWidth = Math.round(newHeight * aspectRatioValue);
                setCropWidth(newWidth);
            }

            setIsUpdatingFromCropper(true);
            cropper.setData({
                ...currentData,
                width: newWidth,
                height: newHeight
            });
            setTimeout(() => setIsUpdatingFromCropper(false), 100);
        }
    };

    // Handle position X change
    const handlePositionXChange = (value) => {
        const newX = parseInt(value) || 0;
        setPositionX(newX);

        if (cropperRef.current && isCropperReady) {
            const cropper = cropperRef.current.cropper;
            const currentData = cropper.getData();

            setIsUpdatingFromCropper(true);
            cropper.setData({
                ...currentData,
                x: newX
            });
            setTimeout(() => setIsUpdatingFromCropper(false), 100);
        }
    };

    // Handle position Y change
    const handlePositionYChange = (value) => {
        const newY = parseInt(value) || 0;
        setPositionY(newY);

        if (cropperRef.current && isCropperReady) {
            const cropper = cropperRef.current.cropper;
            const currentData = cropper.getData();

            setIsUpdatingFromCropper(true);
            cropper.setData({
                ...currentData,
                y: newY
            });
            setTimeout(() => setIsUpdatingFromCropper(false), 100);
        }
    };

    // When cropper is ready, restore saved crop data if available
    const handleReady = useCallback(() => {
        setIsCropperReady(true);

        if (cropperRef.current) {
            const cropper = cropperRef.current.cropper;

            if (image.cropData) {
                cropper.setData(image.cropData);
            }

            setTimeout(() => {
                const data = cropper.getData(true);
                setCropWidth(Math.round(data.width));
                setCropHeight(Math.round(data.height));
                setPositionX(Math.round(data.x));
                setPositionY(Math.round(data.y));
            }, 100);
        }
    }, [image.cropData]);

    useEffect(() => {
        setIsCropperReady(false);
    }, [image.id]);

    const handleCrop = useCallback(() => {
        syncFromCropper();
    }, [syncFromCropper]);

    const handleClose = () => {
        saveCurrentState();
        onClose();
    };

    const handleNext = () => {
        saveCurrentState();
        onNext();
    };

    const handlePrev = () => {
        saveCurrentState();
        onPrev();
    };

    const handleReset = () => {
        if (cropperRef.current && isCropperReady) {
            cropperRef.current.cropper.reset();
            setTimeout(syncFromCropper, 100);
        }
    };

    // Settings Panel Content (shared between desktop sidebar and mobile drawer)
    const SettingsContent = () => (
        <>
            {/* Width / Height */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Width</label>
                    <input
                        type="number"
                        min="1"
                        value={cropWidth}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Height</label>
                    <input
                        type="number"
                        min="1"
                        value={cropHeight}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            </div>

            {/* Aspect Ratio Display */}
            <div className="mb-5 p-3 bg-secondary/50 rounded-lg border border-border">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Aspect Ratio</span>
                    <span className="font-medium">{aspectRatioLabel || 'Freeform'}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-muted-foreground">Orientation</span>
                    <span className="font-medium capitalize">{orientation || 'Portrait'}</span>
                </div>
            </div>

            {/* Crop Position */}
            <div className="mb-5">
                <h4 className="text-sm font-medium mb-3">Crop Position</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Position (X)</label>
                        <input
                            type="number"
                            value={positionX}
                            onChange={(e) => handlePositionXChange(e.target.value)}
                            className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Position (Y)</label>
                        <input
                            type="number"
                            value={positionY}
                            onChange={(e) => handlePositionYChange(e.target.value)}
                            className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </div>
            </div>

            {/* Reset Button */}
            <button
                onClick={handleReset}
                className="w-full py-2.5 bg-secondary border border-border rounded-lg text-sm font-medium hover:bg-secondary/80 flex items-center justify-center gap-2 transition-colors"
            >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
            </button>
        </>
    );

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col md:flex-row">

            {/* Desktop LEFT Sidebar - Hidden on Mobile */}
            <div className="hidden md:flex order-1 w-72 bg-card border-r border-border p-5 flex-col gap-5 h-full overflow-y-auto text-foreground z-20">
                <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Crop Rectangle</h3>
                        <button onClick={handleClose} className="p-2 hover:bg-secondary rounded-full"><X className="w-5 h-5" /></button>
                    </div>

                    <SettingsContent />

                    <div className="mt-auto pt-6 border-t border-border">
                        <button
                            onClick={hasNext ? handleNext : handleClose}
                            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            {hasNext ? 'Save & Next' : 'Save & Close'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Image Area */}
            <div className="order-2 flex-1 relative h-full w-full bg-slate-900 flex items-center justify-center">
                <Cropper
                    key={image.id}
                    src={image.originalUrl}
                    style={{ height: '100%', width: '100%' }}
                    aspectRatio={aspectRatioValue || NaN}
                    guides={true}
                    viewMode={1}
                    dragMode="move"
                    responsive={true}
                    checkOrientation={false}
                    ref={cropperRef}
                    background={false}
                    autoCropArea={0.8}
                    rotatable={false}
                    scalable={true}
                    zoomable={true}
                    minCropBoxWidth={10}
                    minCropBoxHeight={10}
                    ready={handleReady}
                    crop={handleCrop}
                />

                {/* Desktop Navigation Arrows */}
                <div className="hidden md:flex absolute inset-0 items-center justify-between px-4 pointer-events-none">
                    <button
                        onClick={handlePrev}
                        disabled={!hasPrev}
                        className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center pointer-events-auto hover:bg-black/70 disabled:opacity-0 transition-opacity z-10"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={hasNext ? handleNext : handleClose}
                        className={cn(
                            "w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center pointer-events-auto hover:bg-black/70 transition-opacity z-10",
                            !hasNext && "hidden"
                        )}
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>

                {/* Mobile Top Bar */}
                <div className="md:hidden absolute top-0 left-0 right-0 flex items-center justify-between p-3 bg-gradient-to-b from-black/80 to-transparent z-10">
                    <button onClick={handleClose} className="p-2 text-white"><X className="w-6 h-6" /></button>
                    <span className="font-semibold text-white">Edit Image</span>
                    <button onClick={hasNext ? handleNext : handleClose} className="p-2 text-primary"><Check className="w-6 h-6" /></button>
                </div>

                {/* Mobile Bottom Bar */}
                <div className="md:hidden absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10 flex items-center justify-between">
                    <button
                        disabled={!hasPrev}
                        onClick={handlePrev}
                        className="p-3 bg-white/10 backdrop-blur rounded-full disabled:opacity-30"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>

                    <button
                        onClick={() => setShowMobileSettings(true)}
                        className="px-6 py-3 bg-white/10 backdrop-blur rounded-full flex items-center gap-2 text-white font-medium"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>

                    <button
                        disabled={!hasNext}
                        onClick={handleNext}
                        className="p-3 bg-white/10 backdrop-blur rounded-full disabled:opacity-30"
                    >
                        <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Mobile Settings Drawer - Slides up */}
            <AnimatePresence>
                {showMobileSettings && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileSettings(false)}
                            className="md:hidden fixed inset-0 bg-black/50 z-30"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="md:hidden fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl z-40 max-h-[80vh] overflow-y-auto"
                        >
                            {/* Handle */}
                            <div className="flex justify-center py-3">
                                <div className="w-12 h-1 bg-border rounded-full" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-5 pb-4 border-b border-border">
                                <h3 className="font-semibold text-lg">Crop Settings</h3>
                                <button
                                    onClick={() => setShowMobileSettings(false)}
                                    className="p-2 hover:bg-secondary rounded-full"
                                >
                                    <ChevronDown className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <SettingsContent />

                                <div className="mt-6">
                                    <button
                                        onClick={() => {
                                            setShowMobileSettings(false);
                                            if (hasNext) handleNext();
                                            else handleClose();
                                        }}
                                        className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        {hasNext ? 'Save & Next' : 'Save & Close'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
