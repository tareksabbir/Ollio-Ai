/* eslint-disable react-hooks/immutability */
"use client";

import { projects } from "@/lib/view-project";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const ShowcaseGrid = () => {
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [htmlContent, setHtmlContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [customWidth, setCustomWidth] = useState(1400);
  const [customHeight, setCustomHeight] = useState(900);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<
    "left" | "right" | "top" | "bottom" | "corner" | null
  >(null);
  const [showSizeInput, setShowSizeInput] = useState(false);
  const [tempWidth, setTempWidth] = useState("");
  const [tempHeight, setTempHeight] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  }>({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  });

  const categories = [
    "All",
    "Landing Pages",
    "Advanced Apps",
    "Business Tools",
    "Personal Tools",
    "E-Commerce",
  ];

  // Common preset sizes
  const presetSizes = [
    { name: "Mobile S", width: 320, height: 568 },
    { name: "Mobile M", width: 375, height: 667 },
    { name: "Mobile L", width: 414, height: 896 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Laptop", width: 1366, height: 768 },
    { name: "Desktop", width: 1920, height: 1080 },
    { name: "2K", width: 2240, height: 1440 },
    { name: "4K", width: 2560, height: 1440 },
  ];

  // Preview mode dimensions
  const previewDimensions = {
    desktop: { width: "100%", height: "100%" },
    tablet: { width: "768px", height: "1024px" },
    mobile: { width: "375px", height: "667px" },
  };

  // Filter projects based on active category
  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  // Load HTML content from external file
  useEffect(() => {
    if (selectedProject && selectedProject.htmlPath) {
      setIsLoading(true);
      fetch(selectedProject.htmlPath)
        .then((res) => res.text())
        .then((html) => {
          setHtmlContent(html);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error loading HTML:", error);
          setHtmlContent("<h1>Error loading content</h1>");
          setIsLoading(false);
        });
    } else if (selectedProject && selectedProject.htmlContent) {
      setHtmlContent(selectedProject.htmlContent);
      setIsLoading(false);
    }
  }, [selectedProject]);

  // Enhanced mouse resize handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeHandle) return;

      const deltaX = e.clientX - resizeRef.current.startX;
      const deltaY = e.clientY - resizeRef.current.startY;

      let newWidth = customWidth;
      let newHeight = customHeight;

      if (resizeHandle === "right" || resizeHandle === "corner") {
        newWidth = Math.max(
          320,
          Math.min(2560, resizeRef.current.startWidth + deltaX)
        );
      } else if (resizeHandle === "left") {
        newWidth = Math.max(
          320,
          Math.min(2560, resizeRef.current.startWidth - deltaX)
        );
      }

      if (resizeHandle === "bottom" || resizeHandle === "corner") {
        newHeight = Math.max(
          400,
          Math.min(1600, resizeRef.current.startHeight + deltaY)
        );
      } else if (resizeHandle === "top") {
        newHeight = Math.max(
          400,
          Math.min(1600, resizeRef.current.startHeight - deltaY)
        );
      }

      setCustomWidth(newWidth);
      setCustomHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      if (resizeHandle === "left" || resizeHandle === "right") {
        document.body.style.cursor = "ew-resize";
      } else if (resizeHandle === "top" || resizeHandle === "bottom") {
        document.body.style.cursor = "ns-resize";
      } else if (resizeHandle === "corner") {
        document.body.style.cursor = "nwse-resize";
      }

      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, resizeHandle, customWidth, customHeight]);

  const startResize = (
    e: React.MouseEvent,
    handle: "left" | "right" | "top" | "bottom" | "corner"
  ) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeHandle(handle);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: customWidth,
      startHeight: customHeight,
    };
  };

  const applyCustomSize = () => {
    const width = parseInt(tempWidth);
    const height = parseInt(tempHeight);

    if (!isNaN(width) && width >= 320 && width <= 2560) {
      setCustomWidth(width);
    }
    if (!isNaN(height) && height >= 400 && height <= 1600) {
      setCustomHeight(height);
    }

    setShowSizeInput(false);
    setTempWidth("");
    setTempHeight("");
  };

  const applyPresetSize = (width: number, height: number) => {
    setCustomWidth(width);
    setCustomHeight(height);
  };

  const openModal = (project: (typeof projects)[0]) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    setHtmlContent("");
    setPreviewMode("desktop");
    setCustomWidth(1400);
    setCustomHeight(900);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setHtmlContent("");
    setShowSizeInput(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="w-full mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Showcase</h2>
        <p className="text-muted-foreground text-lg">
          Discover the best projects built with Ollio.
        </p>
      </div>

      {/* Tabs / Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveCategory(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border border-border
              ${
                tab === activeCategory
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image Area with Hover Overlay */}
              <div className="relative w-full h-56 overflow-hidden bg-muted">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={500}
                  height={200}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover Overlay & Preview Button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <button
                    onClick={() => openModal(project)}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 hover:bg-primary/90"
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
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Preview
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  {project.category}
                </p>
                <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>

      {/* Modal / Dialog */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/95 backdrop-blur-md transition-opacity"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div
            ref={modalRef}
            className="relative bg-card w-full max-w-full h-full rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="ml-4 text-sm font-medium text-muted-foreground">
                  {selectedProject.title} Preview
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Device Preview Buttons */}
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setPreviewMode("desktop")}
                    className={`p-2 rounded transition-colors ${
                      previewMode === "desktop"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Desktop View"
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
                      <rect width="20" height="14" x="2" y="3" rx="2" />
                      <line x1="8" x2="16" y1="21" y2="21" />
                      <line x1="12" x2="12" y1="17" y2="21" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setPreviewMode("tablet")}
                    className={`p-2 rounded transition-colors ${
                      previewMode === "tablet"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Tablet View"
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
                      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                      <line x1="12" x2="12.01" y1="18" y2="18" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setPreviewMode("mobile")}
                    className={`p-2 rounded transition-colors ${
                      previewMode === "mobile"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Mobile View"
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
                      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                      <path d="M12 18h.01" />
                    </svg>
                  </button>
                </div>

                {/* Enhanced Size Controls (visible only in desktop mode) */}
                {previewMode === "desktop" && (
                  <div className="flex items-center gap-3">
                    {/* Size Display */}
                    <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
                      <span className="text-xs text-muted-foreground">
                        Size:
                      </span>
                      <span className="text-sm font-mono font-semibold text-foreground">
                        {customWidth} × {customHeight}
                      </span>
                    </div>

                    {/* Custom Size Input Toggle */}
                    <button
                      onClick={() => {
                        setShowSizeInput(!showSizeInput);
                        setTempWidth(customWidth.toString());
                        setTempHeight(customHeight.toString());
                      }}
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

                    {/* Preset Sizes Dropdown */}
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

                      {/* Dropdown Menu */}
                      <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="p-2">
                          {presetSizes.map((preset) => (
                            <button
                              key={preset.name}
                              onClick={() =>
                                applyPresetSize(preset.width, preset.height)
                              }
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
                )}

                <button
                  onClick={closeModal}
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

            {/* Custom Size Input Panel */}
            {showSizeInput && previewMode === "desktop" && (
              <div className="px-6 py-3 border-b border-border bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">
                      Width:
                    </label>
                    <input
                      type="number"
                      value={tempWidth}
                      onChange={(e) => setTempWidth(e.target.value)}
                      className="w-24 px-2 py-1 text-sm rounded border border-border bg-background"
                      placeholder="320-2560"
                      min="320"
                      max="2560"
                    />
                    <span className="text-sm text-muted-foreground">px</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">
                      Height:
                    </label>
                    <input
                      type="number"
                      value={tempHeight}
                      onChange={(e) => setTempHeight(e.target.value)}
                      className="w-24 px-2 py-1 text-sm rounded border border-border bg-background"
                      placeholder="400-1600"
                      min="400"
                      max="1600"
                    />
                    <span className="text-sm text-muted-foreground">px</span>
                  </div>

                  <button
                    onClick={applyCustomSize}
                    className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                  >
                    Apply
                  </button>

                  <button
                    onClick={() => setShowSizeInput(false)}
                    className="px-4 py-1.5 text-sm bg-muted text-muted-foreground rounded hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Preview Body (HTML Render) */}
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
                        previewMode === "desktop"
                          ? `${customWidth}px`
                          : previewDimensions[previewMode].width,
                      height:
                        previewMode === "desktop"
                          ? `${customHeight}px`
                          : previewDimensions[previewMode].height,
                      maxWidth: "100%",
                      border:
                        previewMode !== "desktop"
                          ? "8px solid hsl(var(--border))"
                          : "1px solid hsl(var(--border))",
                      borderRadius: previewMode !== "desktop" ? "24px" : "8px",
                    }}
                  >
                    <iframe
                      srcDoc={htmlContent}
                      className="w-full h-full border-0"
                      title={`${selectedProject.title} Preview`}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
                    />

                    {/* Enhanced Resize Handles (only visible in desktop mode) */}
                    {previewMode === "desktop" && (
                      <>
                        {/* Right Handle */}
                        <div
                          onMouseDown={(e) => startResize(e, "right")}
                          className="absolute top-0 right-0 w-3 h-full cursor-ew-resize bg-transparent hover:bg-primary/20 transition-colors group"
                          style={{ right: "-6px" }}
                        >
                          <div className="absolute inset-y-0 right-1.5 w-1 bg-primary/0 group-hover:bg-primary transition-colors rounded-full" />
                        </div>

                        {/* Left Handle */}
                        <div
                          onMouseDown={(e) => startResize(e, "left")}
                          className="absolute top-0 left-0 w-3 h-full cursor-ew-resize bg-transparent hover:bg-primary/20 transition-colors group"
                          style={{ left: "-6px" }}
                        >
                          <div className="absolute inset-y-0 left-1.5 w-1 bg-primary/0 group-hover:bg-primary transition-colors rounded-full" />
                        </div>

                        {/* Bottom Handle */}
                        <div
                          onMouseDown={(e) => startResize(e, "bottom")}
                          className="absolute bottom-0 left-0 w-full h-3 cursor-ns-resize bg-transparent hover:bg-primary/20 transition-colors group"
                          style={{ bottom: "-6px" }}
                        >
                          <div className="absolute inset-x-0 bottom-1.5 h-1 bg-primary/0 group-hover:bg-primary transition-colors rounded-full" />
                        </div>

                        {/* Top Handle */}
                        <div
                          onMouseDown={(e) => startResize(e, "top")}
                          className="absolute top-0 left-0 w-full h-3 cursor-ns-resize bg-transparent hover:bg-primary/20 transition-colors group"
                          style={{ top: "-6px" }}
                        >
                          <div className="absolute inset-x-0 top-1.5 h-1 bg-primary/0 group-hover:bg-primary transition-colors rounded-full" />
                        </div>

                        {/* Corner Handle (Bottom Right) */}
                        <div
                          onMouseDown={(e) => startResize(e, "corner")}
                          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize group"
                          style={{ bottom: "-6px", right: "-6px" }}
                        >
                          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-primary/0 group-hover:border-primary transition-colors rounded-br" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowcaseGrid;
