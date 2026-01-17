import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { cn } from '../lib/utils';

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
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div
                {...getRootProps()}
                className={cn(
                    "w-full max-w-2xl aspect-[2/1] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer bg-secondary/20 hover:bg-secondary/40 hover:border-primary",
                    isDragActive && "border-primary bg-primary/5 scale-105"
                )}
            >
                <input {...getInputProps()} />
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-2">
                    <UploadCloud className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center space-y-1">
                    <h3 className="text-xl font-semibold">Drop your images here</h3>
                    <p className="text-muted-foreground">or click to browse from your computer</p>
                </div>
                <div className="mt-4 px-4 py-2 bg-secondary rounded-full text-xs font-mono text-muted-foreground">
                    Supports JPG, PNG, WEBP • Max 100 images
                </div>
            </div>
        </div>
    );
}
