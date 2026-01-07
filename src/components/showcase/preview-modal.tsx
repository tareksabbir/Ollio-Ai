import React, { useEffect, useRef } from 'react';
import { DevicePreviewButtons } from './device-preview-buttons';
import { SizeControls } from './size-controls';
import { CustomSizeInput } from './custom-size-Input';
import { ResizeHandles } from './resize-handles';
import { Project } from '@/lib/view-project';


type PreviewMode = 'desktop' | 'tablet' | 'mobile';
type ResizeHandle = 'left' | 'right' | 'top' | 'bottom' | 'corner';

interface Preset {
  name: string;
  width: number;
  height: number;
}

interface PreviewModalProps {
  isOpen: boolean;
  project: Project | null;
  htmlContent: string;
  isLoading: boolean;
  previewMode: PreviewMode;
  customWidth: number;
  customHeight: number;
  showSizeInput: boolean;
  tempWidth: string;
  tempHeight: string;
  presets: Preset[];
  onClose: () => void;
  onPreviewModeChange: (mode: PreviewMode) => void;
  onCustomSizeClick: () => void;
  onPresetSelect: (width: number, height: number) => void;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onApplySize: () => void;
  onCancelSize: () => void;
  onResize: (e: React.MouseEvent, handle: ResizeHandle) => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  project,
  htmlContent,
  isLoading,
  previewMode,
  customWidth,
  customHeight,
  showSizeInput,
  tempWidth,
  tempHeight,
  presets,
  onClose,
  onPreviewModeChange,
  onCustomSizeClick,
  onPresetSelect,
  onWidthChange,
  onHeightChange,
  onApplySize,
  onCancelSize,
  onResize,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Prevent navigation inside iframe and open links in new tab
  useEffect(() => {
    if (!iframeRef.current || !htmlContent) return;

    const iframe = iframeRef.current;
    
    const handleIframeLoad = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        const iframeWindow = iframe.contentWindow;
        
        if (!iframeDoc || !iframeWindow) return;

        // Prevent navigation in iframe
        const originalPushState = iframeWindow.history.pushState;
        const originalReplaceState = iframeWindow.history.replaceState;
        
        iframeWindow.history.pushState = function(...args) {
          console.log('Prevented pushState in iframe');
          return originalPushState.apply(this, args);
        };
        
        iframeWindow.history.replaceState = function(...args) {
          console.log('Prevented replaceState in iframe');
          return originalReplaceState.apply(this, args);
        };

        // Find all links in the iframe
        const links = iframeDoc.querySelectorAll('a');
        
        links.forEach((link) => {
          // Prevent default navigation
          link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const href = link.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('javascript:')) {
              // Open in new tab instead of navigating within iframe
              window.open(href, '_blank', 'noopener,noreferrer');
            }
          });

          // Also set target to _blank as fallback
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        });
      } catch (error) {
        // Cross-origin restrictions might prevent access
        console.warn('Cannot access iframe content:', error);
      }
    };

    iframe.addEventListener('load', handleIframeLoad);
    
    return () => {
      iframe.removeEventListener('load', handleIframeLoad);
    };
  }, [htmlContent]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const previewDimensions = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-background/95 backdrop-blur-md transition-opacity"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      />

      <div className="relative bg-card w-full max-w-full h-full rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="ml-4 text-sm font-medium text-muted-foreground">
              {project.title} Preview
            </span>
          </div>

          <div className="flex items-center gap-4">
            <DevicePreviewButtons
              previewMode={previewMode}
              onModeChange={onPreviewModeChange}
            />

            {previewMode === 'desktop' && (
              <SizeControls
                width={customWidth}
                height={customHeight}
                presets={presets}
                onCustomSizeClick={onCustomSizeClick}
                onPresetSelect={onPresetSelect}
              />
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              type="button"
              className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        {showSizeInput && previewMode === 'desktop' && (
          <CustomSizeInput
            tempWidth={tempWidth}
            tempHeight={tempHeight}
            onWidthChange={onWidthChange}
            onHeightChange={onHeightChange}
            onApply={onApplySize}
            onCancel={onCancelSize}
          />
        )}

        {/* Preview Body */}
        <div className="flex-1 w-full overflow-auto bg-muted/20 flex items-start justify-center p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="relative">
              <div
                className="bg-background shadow-2xl transition-all duration-300 overflow-hidden relative"
                style={{
                  width:
                    previewMode === 'desktop'
                      ? `${customWidth}px`
                      : previewDimensions[previewMode].width,
                  height:
                    previewMode === 'desktop'
                      ? `${customHeight}px`
                      : previewDimensions[previewMode].height,
                  maxWidth: '100%',
                  border:
                    previewMode !== 'desktop'
                      ? '8px solid hsl(var(--border))'
                      : '1px solid hsl(var(--border))',
                  borderRadius: previewMode !== 'desktop' ? '24px' : '8px',
                }}
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={htmlContent}
                  className="w-full h-full border-0"
                  title={`${project.title} Preview`}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox"
                />

                {previewMode === 'desktop' && (
                  <ResizeHandles onResize={onResize} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};