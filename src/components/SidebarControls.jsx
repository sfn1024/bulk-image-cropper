import React from 'react';
import { Settings, FileUp, Download, LayoutTemplate, Monitor, Trash2, Images } from 'lucide-react';
import { cn } from '../lib/utils';

export function SidebarControls({
    onUpload,
    aspectRatio,
    setAspectRatio,
    orientation,
    setOrientation,
    onExport,
    isExporting,
    onRemoveAll,
    imageCount
}) {
    return (
        <div className="w-full md:w-80 border-r border-border bg-card p-6 flex flex-col gap-8 h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <LayoutTemplate className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">BulkCrop</h1>
            </div>

            <div className="space-y-6 flex-1">

                {/* Stats Section */}
                <div className="bg-secondary/50 rounded-lg p-3 flex items-center justify-between border border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Images className="w-4 h-4" />
                        <span>Total Images</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{imageCount || 0}</span>
                </div>

                {/* Aspect Ratio Section */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        Aspect Ratio
                    </label>
                    <select
                        className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                    >
                        <option value="free">Freeform</option>
                        <option value="1/1">1:1 (Square)</option>
                        <option value="4/5">4:5 (Social Portrait)</option>
                        <option value="16/9">16:9 (Landscape)</option>
                        <option value="9/16">9:16 (Story)</option>
                        <option value="1.91/1">1.91:1 (FB Post)</option>
                        <option value="3/2">3:2 (Standard)</option>
                        <option value="2/3">2:3 (Standard Vertical)</option>
                    </select>
                </div>

                {/* Orientation Toggle - Visual */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-muted-foreground">Orientation</label>
                    <div className="grid grid-cols-2 gap-2 bg-secondary p-1 rounded-lg">
                        <button
                            onClick={() => setOrientation('portrait')}
                            className={cn(
                                "py-2 text-xs font-medium rounded-md transition-all",
                                orientation === 'portrait' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Portrait
                        </button>
                        <button
                            onClick={() => setOrientation('landscape')}
                            className={cn(
                                "py-2 text-xs font-medium rounded-md transition-all",
                                orientation === 'landscape' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Landscape
                        </button>
                    </div>
                </div>

                {/* Clear All Button */}
                <div className="pt-2">
                    <button
                        onClick={() => {
                            if (imageCount > 0 && window.confirm('Are you sure you want to remove all images?')) {
                                if (onRemoveAll) onRemoveAll();
                            }
                        }}
                        disabled={!imageCount || imageCount === 0}
                        className="w-full py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border border-red-500/20 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-xs font-semibold">Remove All Images</span>
                    </button>
                </div>

                {/* Upload Button */}
                <div className="pt-4 border-t border-border">
                    <button
                        onClick={onUpload}
                        className="w-full py-4 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                    >
                        <FileUp className="w-6 h-6" />
                        <span className="text-xs font-medium">Add more images</span>
                    </button>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-border">
                <button
                    onClick={onExport}
                    disabled={isExporting || imageCount === 0}
                    className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isExporting ? (
                        <>Processing...</>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            Download All
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
