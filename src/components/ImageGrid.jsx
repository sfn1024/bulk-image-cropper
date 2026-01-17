import React from 'react';
import { X, Edit2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function ImageGrid({ images, onRemove, onEdit }) {
    if (images.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center">
                    <Edit2 className="w-8 h-8 opacity-50" />
                </div>
                <p>No images uploaded yet</p>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <AnimatePresence>
                    {images.map((img) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                            className="group relative aspect-square bg-secondary rounded-xl overflow-hidden border border-border shadow-sm hover:ring-2 hover:ring-primary transition-all cursor-pointer"
                            onClick={() => onEdit(img.id)}
                        >
                            <img
                                src={img.previewUrl || img.originalUrl}
                                alt="Upload"
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <span className="text-white text-xs font-medium px-2 py-1 bg-black/50 rounded-full flex items-center gap-1">
                                    <Edit2 className="w-3 h-3" /> Edit
                                </span>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); onRemove(img.id); }}
                                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
