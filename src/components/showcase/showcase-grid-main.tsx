"use client";

import { useState, useEffect, useRef } from "react";
import { CategoryTabs } from "./category-tabs";
import { ProjectCard } from "./project-cards";
import { PreviewModal } from "./preview-modal";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ProjectsSkeletonGrid } from "../skeletons/projects-skeleton-for-grid";

// Prisma HtmlCode Model এর সাথে ম্যাচ করে টাইপ ডিফাইন করা হয়েছে
type HtmlProject = {
  id: string;
  title: string;
  category: string;
  image: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
};

type PreviewMode = "desktop" | "tablet" | "mobile";
type ResizeHandle = "left" | "right" | "top" | "bottom" | "corner" | null;

const ShowcaseGrid = () => {
  const trpc = useTRPC();
  const [selectedProject, setSelectedProject] = useState<HtmlProject | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [customWidth, setCustomWidth] = useState(1400);
  const [customHeight, setCustomHeight] = useState(900);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);
  const [showSizeInput, setShowSizeInput] = useState(false);
  const [tempWidth, setTempWidth] = useState("");
  const [tempHeight, setTempHeight] = useState("");

  const resizeRef = useRef({
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

  // --- DATA FETCHING ---
  // তোমার htmlCodeRouter এর getMany প্রসিজার কল করা হচ্ছে
  const { data: projects = [], isLoading: isProjectsLoading } = useQuery(
    trpc.htmlCode.getMany.queryOptions()
  );

  // --- CLIENT SIDE FILTERING ---
  // যেহেতু getMany তে সার্ভার সাইড ফিল্টার নেই, তাই এখানে ফিল্টার করা হচ্ছে
  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  // সিলেক্টেড প্রজেক্টের HTML কোড বের করা (যেহেতু getMany তে সব ডাটা আসে)
  const currentHtmlContent = selectedProject ? selectedProject.code : "";

  // --- RESIZE LOGIC (আগের মতোই রাখা হয়েছে) ---
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
    e: React.MouseEvent<Element, MouseEvent>,
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

  const openModal = (project: HtmlProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    setPreviewMode("desktop");
    setCustomWidth(1400);
    setCustomHeight(900);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setShowSizeInput(false);
    document.body.style.overflow = "auto";

    if (typeof window !== "undefined") {
      window.history.pushState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  };

  return (
    <div className="w-full mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Showcase</h2>
        <p className="text-muted-foreground text-lg">
          Discover the best projects built with Ollio.
        </p>
      </div>

      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {isProjectsLoading ? (
        <ProjectsSkeletonGrid />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPreview={openModal}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                No projects found in this category.
              </p>
            </div>
          )}
        </div>
      )}

      <PreviewModal
        isOpen={isModalOpen}
        project={selectedProject}
        htmlContent={currentHtmlContent}
        isLoading={false} // getMany থেকেই ডাটা লোড হয়ে আসছে
        previewMode={previewMode}
        customWidth={customWidth}
        customHeight={customHeight}
        showSizeInput={showSizeInput}
        tempWidth={tempWidth}
        tempHeight={tempHeight}
        presets={presetSizes}
        onClose={closeModal}
        onPreviewModeChange={setPreviewMode}
        onCustomSizeClick={() => {
          setShowSizeInput(!showSizeInput);
          setTempWidth(customWidth.toString());
          setTempHeight(customHeight.toString());
        }}
        onPresetSelect={(width, height) => {
          setCustomWidth(width);
          setCustomHeight(height);
        }}
        onWidthChange={setTempWidth}
        onHeightChange={setTempHeight}
        onApplySize={applyCustomSize}
        onCancelSize={() => setShowSizeInput(false)}
        onResize={startResize}
      />
    </div>
  );
};

export default ShowcaseGrid;
