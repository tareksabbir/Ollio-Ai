import React from 'react';

interface ResizeHandlesProps {
  onResize: (e: React.MouseEvent, handle: 'left' | 'right' | 'top' | 'bottom' | 'corner') => void;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({ onResize }) => {
  return (
    <>
      {/* Right Handle */}
      <div
        onMouseDown={(e) => onResize(e, 'right')}
        className="absolute top-0 right-0 w-3 h-full cursor-ew-resize bg-transparent hover:bg-primary/20 transition-colors group"
        style={{ right: '-6px' }}
      >
        <div className="absolute inset-y-0 right-1.5 w-1 bg-primary/0 group-hover:bg-primary transition-colors rounded-full" />
      </div>

      {/* Left Handle */}
      <div
        onMouseDown={(e) => onResize(e, 'left')}
        className="absolute top-0 left-0 w-3 h-full cursor-ew-resize bg-transparent hover:bg-primary/20 transition-colors group"
        style={{ left: '-6px' }}
      >
        <div className="absolute inset-y-0 left-1.5 w-1 bg-primary/0 group-hover:bg-primary transition-colors rounded-full" />
      </div>

      {/* Bottom Handle */}
      <div
        onMouseDown={(e) => onResize(e, 'bottom')}
        className="absolute bottom-0 left-0 w-full h-3 cursor-ns-resize bg-transparent hover:bg-primary/20 transition-colors group"
        style={{ bottom: '-6px' }}
      >
        <div className="absolute inset-x-0 bottom-1.5 h-1 bg-primary/0 group-hover:bg-primary transition-colors rounded-full" />
      </div>

      {/* Top Handle */}
      <div
        onMouseDown={(e) => onResize(e, 'top')}
        className="absolute top-0 left-0 w-full h-3 cursor-ns-resize bg-transparent hover:bg-primary/20 transition-colors group"
        style={{ top: '-6px' }}
      >
        <div className="absolute inset-x-0 top-1.5 h-1 bg-primary/0 group-hover:bg-primary transition-colors rounded-full" />
      </div>

      {/* Corner Handle */}
      <div
        onMouseDown={(e) => onResize(e, 'corner')}
        className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize group"
        style={{ bottom: '-6px', right: '-6px' }}
      >
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-primary/0 group-hover:border-primary transition-colors rounded-br" />
      </div>
    </>
  );
};