"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "../ui/button";
import { CopyCheckIcon, CopyIcon, EditIcon, SaveIcon } from "lucide-react";
import { convertFilesToTreeItems } from "@/lib/utils";
import TreeView from "./tree-view";
import FileBreadcrumb from "./file-breadcrumb";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { CodeView } from ".";
import Hint from "../custom/hint";
import { ComponentErrorBoundary } from "@/components/error-boundary/component-error-boundary";
import { CodeTheme, CodeThemeSelector } from "./code-theme-selector";

const EditableCodeView = dynamic(
  () => import("./editable-code-view").then((mod) => mod.EditableCodeView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        Loading editor...
      </div>
    ),
  }
);

type FileCollection = { [path: string]: string };

function getLanguageFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension || "text";
}

interface FileExplorerProps {
  files: FileCollection;
  fragmentId?: string;
  onSave?: (fragmentId: string, files: FileCollection) => Promise<void>;
  allowEdit?: boolean;
}

const FileExplorer = ({
  files,
  fragmentId,
  onSave,
  allowEdit = true,
}: FileExplorerProps) => {
  // useTheme হুক ব্যবহার করে বর্তমান থিম ডিটেক্ট করা হচ্ছে
  const { theme, resolvedTheme } = useTheme();
  const isDark = (resolvedTheme || theme) === "dark";

  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFiles, setEditedFiles] = useState<FileCollection>(files);
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  const [codeTheme, setCodeTheme] = useState<CodeTheme>(() => {
    return isDark ? "vscodeDark" : "vscodeLight";
  });

  const isMounted = useRef(true);
  const saveInProgress = useRef(false);

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(editedFiles) !== JSON.stringify(files);
  }, [editedFiles, files]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isEditing || saveInProgress.current) {
      return;
    }

    setEditedFiles(files);

    if (selectedFile && !files[selectedFile]) {
      const fileKeys = Object.keys(files);
      if (isMounted.current) {
        setSelectedFile(fileKeys.length > 0 ? fileKeys[0] : null);
      }
    }
  }, [files, isEditing, selectedFile]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        if (isMounted.current) {
          setCopied(false);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // যখন সিস্টেম থিম পরিবর্তন হয়, তখন কোড থিমও অটোমেটিক পরিবর্তন করার জন্য (অপশনাল)
  useEffect(() => {
    if (codeTheme === "githubLight" && isDark) {
      setCodeTheme("githubDark");
    } else if (codeTheme === "githubDark" && !isDark) {
      setCodeTheme("githubLight");
    } else if (codeTheme === "vscodeLight" && isDark) {
      setCodeTheme("vscodeDark");
    } else if (codeTheme === "vscodeDark" && !isDark) {
      setCodeTheme("vscodeLight");
    } else if (
      (codeTheme === "tokyoNight" || codeTheme === "dracula") &&
      !isDark
    ) {
      setCodeTheme("vscodeLight");
    }
  }, [isDark, codeTheme]);

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(editedFiles);
  }, [editedFiles]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (editedFiles[filePath]) {
        setSelectedFile(filePath);
      }
    },
    [editedFiles]
  );

  const handleCodeChange = useCallback(
    (newCode: string) => {
      if (!selectedFile) return;
      setEditedFiles((prev) => ({ ...prev, [selectedFile]: newCode }));
    },
    [selectedFile]
  );

  const handleCopy = useCallback(() => {
    if (selectedFile) {
      navigator.clipboard.writeText(editedFiles[selectedFile]);
      setCopied(true);
    }
  }, [selectedFile, editedFiles]);

  const handleSave = useCallback(async () => {
    if (!onSave || !hasUnsavedChanges || !fragmentId) {
      console.log("Save blocked:", {
        hasOnSave: !!onSave,
        hasChanges: hasUnsavedChanges,
        hasFragmentId: !!fragmentId,
      });
      return;
    }

    if (saveInProgress.current) {
      console.log("Save already in progress");
      return;
    }

    saveInProgress.current = true;
    setIsSaving(true);

    try {
      await onSave(fragmentId, editedFiles);

      if (isMounted.current) {
        toast.success("Files saved successfully!");
      }
    } catch (error) {
      if (isMounted.current) {
        toast.error("Failed to save files");
        console.error("Save error:", error);
      }
    } finally {
      if (isMounted.current) {
        setIsSaving(false);
      }
      saveInProgress.current = false;
    }
  }, [fragmentId, editedFiles, onSave, hasUnsavedChanges]);

  const toggleEditMode = useCallback(() => {
    if (isEditing && hasUnsavedChanges) {
      const confirm = window.confirm("You have unsaved changes. Discard them?");
      if (!confirm) return;
      setEditedFiles(files);
    }
    setIsEditing((prev) => !prev);
  }, [isEditing, hasUnsavedChanges, files]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (isEditing && hasUnsavedChanges && !isSaving) {
          handleSave();
        }
      }
    };

    if (isEditing) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isEditing, hasUnsavedChanges, isSaving, handleSave]);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel
        defaultSize={25}
        minSize={20}
        className="bg-sidebar h-full overflow-hidden flex flex-col"
      >
        <ComponentErrorBoundary componentName="TreeView">
          <div className="h-full overflow-y-auto overflow-x-hidden">
            <TreeView
              data={treeData}
              value={selectedFile}
              onSelect={handleFileSelect}
            />
          </div>
        </ComponentErrorBoundary>
      </ResizablePanel>

      <ResizableHandle
        withHandle
        className="hover:bg-primary transition-colors z-10"
      />

      <ResizablePanel
        defaultSize={75}
        minSize={50}
        className="h-full overflow-hidden"
      >
        {selectedFile && editedFiles[selectedFile] ? (
          <div className="h-full w-full flex flex-col overflow-hidden">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2 shrink-0">
              <FileBreadcrumb filePath={selectedFile} />
              <div className="flex items-center gap-x-2">
                {hasUnsavedChanges && (
                  <span className="text-xs text-primary font-medium">
                    • Unsaved changes
                  </span>
                )}
                {/* এখানে isDark ডায়নামিকালি পাস করা হচ্ছে */}
               
                  <CodeThemeSelector
                    currentTheme={codeTheme}
                    onThemeChange={setCodeTheme}
                    isDark={isDark}
                  />
               

                {allowEdit && (
                  <Hint
                    text={isEditing ? "View mode" : "Edit mode"}
                    side="bottom"
                  >
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      size="sm"
                      onClick={toggleEditMode}
                    >
                      <EditIcon className="w-4 h-4" />
                      {isEditing ? "Viewing" : "Edit"}
                    </Button>
                  </Hint>
                )}

                {isEditing && (
                  <Hint text="Save changes (Ctrl+S)" side="bottom">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving || !hasUnsavedChanges || !fragmentId}
                    >
                      <SaveIcon
                        className={
                          isSaving ? "animate-pulse w-4 h-4" : "w-4 h-4"
                        }
                      />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </Hint>
                )}

                <Hint text="Copy to clipboard" side="bottom">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={copied}
                  >
                    {copied ? (
                      <CopyCheckIcon className="w-4 h-4" />
                    ) : (
                      <CopyIcon className="w-4 h-4" />
                    )}
                  </Button>
                </Hint>
              </div>
            </div>

            <div className="flex-1 overflow-hidden min-h-0">
              <ComponentErrorBoundary
                componentName={isEditing ? "EditableCodeView" : "CodeView"}
              >
                {isEditing ? (
                  <EditableCodeView
                    code={editedFiles[selectedFile]}
                    lang={getLanguageFromExtension(selectedFile)}
                    onChange={handleCodeChange}
                    readOnly={false}
                    theme={codeTheme}
                  />
                ) : (
                  <div className="h-full overflow-auto">
                    <CodeView
                      code={editedFiles[selectedFile]}
                      lang={getLanguageFromExtension(selectedFile)}
                      theme={codeTheme}
                    />
                  </div>
                )}
              </ComponentErrorBoundary>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a file to view its content
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default FileExplorer;
