import React from 'react';

interface Preset {
  name: string;
  width: number;
  height: number;
}

interface SizeControlsProps {
  width: number;
  height: number;
  presets: Preset[];
  onCustomSizeClick: () => void;
  onPresetSelect: (width: number, height: number) => void;
}

export const SizeControls: React.FC<SizeControlsProps> = ({
  width,
  height,
  presets,
  onCustomSizeClick,
  onPresetSelect,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
        <span className="text-xs text-muted-foreground">Size:</span>
        <span className="text-sm font-mono font-semibold text-foreground">
          {width} × {height}
        </span>
      </div>

      <button
        onClick={onCustomSizeClick}
        className="p-2 rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
        title="Custom Size"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
        </svg>
      </button>

      <div className="relative group">
        <button
          className="p-2 rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
          title="Preset Sizes"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
            <path d="M21 9H3" />
          </svg>
        </button>

        <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onPresetSelect(preset.width, preset.height)}
                className="w-full text-left px-3 py-2 rounded hover:bg-accent transition-colors text-sm"
              >
                <div className="font-medium">{preset.name}</div>
                <div className="text-xs text-muted-foreground">
                  {preset.width} × {preset.height}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};