import React from 'react';

interface CustomSizeInputProps {
  tempWidth: string;
  tempHeight: string;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onApply: () => void;
  onCancel: () => void;
}

export const CustomSizeInput: React.FC<CustomSizeInputProps> = ({
  tempWidth,
  tempHeight,
  onWidthChange,
  onHeightChange,
  onApply,
  onCancel,
}) => {
  return (
    <div className="px-6 py-3 border-b border-border bg-muted/20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Width:</label>
          <input
            type="number"
            value={tempWidth}
            onChange={(e) => onWidthChange(e.target.value)}
            className="w-24 px-2 py-1 text-sm rounded border border-border bg-background"
            placeholder="320-2560"
            min="320"
            max="2560"
          />
          <span className="text-sm text-muted-foreground">px</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Height:</label>
          <input
            type="number"
            value={tempHeight}
            onChange={(e) => onHeightChange(e.target.value)}
            className="w-24 px-2 py-1 text-sm rounded border border-border bg-background"
            placeholder="400-1600"
            min="400"
            max="1600"
          />
          <span className="text-sm text-muted-foreground">px</span>
        </div>

        <button
          onClick={onApply}
          className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
        >
          Apply
        </button>

        <button
          onClick={onCancel}
          className="px-4 py-1.5 text-sm bg-muted text-muted-foreground rounded hover:bg-accent transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};