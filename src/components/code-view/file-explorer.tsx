// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable";

// import { useCallback, useMemo, useState } from "react";

// import { Button } from "../ui/button";
// import { CopyCheckIcon, CopyIcon, EditIcon, SaveIcon } from "lucide-react";
// import { convertFilesToTreeItems } from "@/lib/utils";
// import TreeView from "./tree-view";
// import FileBreadcrumb from "./file-breadcrumb";
// import { toast } from "sonner";
// import dynamic from "next/dynamic";
// import { CodeView } from ".";
// import Hint from "../custom/hint";

// const EditableCodeView = dynamic<{
//   code: string;
//   lang: string;
//   onChange?: (value: string) => void;
//   readOnly?: boolean;
// }>(() => import("./editable-code-view").then((mod) => mod.EditableCodeView), {
//   ssr: false,
//   loading: () => (
//     <div className="flex h-full items-center justify-center">
//       Loading editor...
//     </div>
//   ),
// });

// type FileCollection = { [path: string]: string };

// function getLanguageFromExtention(filename: string): string {
//   const extention = filename.split(".").pop()?.toLowerCase();
//   return extention || "text";
// }

// interface FileExplorerProps {
//   files: FileCollection;
//   fragmentId?: string; // ← Changed
//   onSave?: (fragmentId: string, files: FileCollection) => Promise<void>; // ← Updated
//   allowEdit?: boolean;
// }

// const FileExplorer = ({
//   files,
//   fragmentId,
//   onSave,
//   allowEdit = true,
// }: FileExplorerProps) => {
//   const [copied, setCopied] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedFiles, setEditedFiles] = useState<FileCollection>(files);
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

//   const [selectedFile, setSelectedFile] = useState<string | null>(() => {
//     const filekeys = Object.keys(files);
//     return filekeys.length > 0 ? filekeys[0] : null;
//   });

//   const treeData = useMemo(() => {
//     return convertFilesToTreeItems(editedFiles);
//   }, [editedFiles]);

//   const handleFileSelect = useCallback(
//     (filePath: string) => {
//       if (editedFiles[filePath]) {
//         setSelectedFile(filePath);
//       }
//     },
//     [editedFiles]
//   );

//   const handleCodeChange = useCallback(
//     (newCode: string) => {
//       if (!selectedFile) return;

//       setEditedFiles((prev) => {
//         const updated = { ...prev, [selectedFile]: newCode };
//         return updated;
//       });
//       setHasUnsavedChanges(true);
//     },
//     [selectedFile]
//   );

//   const handleCopy = useCallback(() => {
//     if (selectedFile) {
//       navigator.clipboard.writeText(editedFiles[selectedFile]);
//       setCopied(true);
//       setTimeout(() => {
//         setCopied(false);
//       }, 2000);
//     }
//   }, [selectedFile, editedFiles]);

//   const handleSave = useCallback(async () => {
//     if (!onSave || !hasUnsavedChanges || !fragmentId) {
//       console.log("Save blocked:", {
//         onSave: !!onSave,
//         hasUnsavedChanges,
//         fragmentId,
//       }); // Debug
//       return;
//     }

//     console.log("Saving files:", { fragmentId, files: editedFiles }); // Debug

//     setIsSaving(true);
//     try {
//       await onSave(fragmentId, editedFiles); // ← Pass fragmentId first
//       setHasUnsavedChanges(false);
//       toast.success("Files saved successfully!");
//     } catch (error) {
//       toast.error("Failed to save files");
//       console.error("Save error:", error);
//     } finally {
//       setIsSaving(false);
//     }
//   }, [fragmentId, editedFiles, onSave, hasUnsavedChanges]);

//   const toggleEditMode = useCallback(() => {
//     if (isEditing && hasUnsavedChanges) {
//       const confirm = window.confirm("You have unsaved changes. Discard them?");
//       if (!confirm) return;
//       setEditedFiles(files);
//       setHasUnsavedChanges(false);
//     }
//     setIsEditing(!isEditing);
//   }, [isEditing, hasUnsavedChanges, files]);

//   return (
//     <ResizablePanelGroup direction="horizontal">
//       <ResizablePanel defaultSize={20} minSize={15} className="bg-sidebar">
//         <TreeView
//           data={treeData}
//           value={selectedFile}
//           onSelect={handleFileSelect}
//         />
//       </ResizablePanel>
//       <ResizableHandle
//         withHandle
//         className="hover:bg-primary transition-colors z-10"
//       />
//       <ResizablePanel defaultSize={80} minSize={50}>
//         {selectedFile && editedFiles[selectedFile] ? (
//           <div className="h-full w-full flex flex-col">
//             <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
//               <FileBreadcrumb filePath={selectedFile} />
//               <div className="flex items-center gap-x-2">
//                 {hasUnsavedChanges && (
//                   <span className="text-xs text-orange-500 font-medium">
//                     • Unsaved changes
//                   </span>
//                 )}

//                 {allowEdit && (
//                   <Hint
//                     text={isEditing ? "View mode" : "Edit mode"}
//                     side="bottom"
//                   >
//                     <Button
//                       variant={isEditing ? "default" : "outline"}
//                       size="sm"
//                       onClick={toggleEditMode}
//                     >
//                       <EditIcon className="w-4 h-4" />
//                       {isEditing ? "Viewing" : "Edit"}
//                     </Button>
//                   </Hint>
//                 )}

//                 {isEditing && (
//                   <Hint text="Save changes" side="bottom">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={handleSave}
//                       disabled={isSaving || !hasUnsavedChanges || !fragmentId}
//                     >
//                       <SaveIcon
//                         className={
//                           isSaving ? "animate-pulse w-4 h-4" : "w-4 h-4"
//                         }
//                       />
//                       {isSaving ? "Saving..." : "Save"}
//                     </Button>
//                   </Hint>
//                 )}

//                 <Hint text="Copy to clipboard" side="bottom">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={handleCopy}
//                     disabled={copied}
//                   >
//                     {copied ? (
//                       <CopyCheckIcon className="w-4 h-4" />
//                     ) : (
//                       <CopyIcon className="w-4 h-4" />
//                     )}
//                   </Button>
//                 </Hint>
//               </div>
//             </div>
//             <div className="flex-1 overflow-hidden">
//               {isEditing ? (
//                 <EditableCodeView
//                   code={editedFiles[selectedFile]}
//                   lang={getLanguageFromExtention(selectedFile)}
//                   onChange={handleCodeChange}
//                   readOnly={false}
//                 />
//               ) : (
//                 <div className="h-full overflow-auto">
//                   <CodeView
//                     code={editedFiles[selectedFile]}
//                     lang={getLanguageFromExtention(selectedFile)}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="flex h-full items-center justify-center text-muted-foreground">
//             Select a file to view its content
//           </div>
//         )}
//       </ResizablePanel>
//     </ResizablePanelGroup>
//   );
// };

// export default FileExplorer;



import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "../ui/button";
import { CopyCheckIcon, CopyIcon, EditIcon, SaveIcon } from "lucide-react";
import { convertFilesToTreeItems } from "@/lib/utils";
import TreeView from "./tree-view";
import FileBreadcrumb from "./file-breadcrumb";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { CodeView } from ".";
import Hint from "../custom/hint";

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
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFiles, setEditedFiles] = useState<FileCollection>(files);
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  const isMounted = useRef(true);
  const saveInProgress = useRef(false);

  // ✅ FIX 1: Properly track unsaved changes using deep comparison
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(editedFiles) !== JSON.stringify(files);
  }, [editedFiles, files]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ✅ FIX 2: Sync files prop changes only when NOT editing or saving
  useEffect(() => {
    // Don't reset if user is actively editing or save is in progress
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

  // ✅ FIX 3: Improved save handler with proper state management
  const handleSave = useCallback(async () => {
    if (!onSave || !hasUnsavedChanges || !fragmentId) {
      console.log("Save blocked:", {
        hasOnSave: !!onSave,
        hasChanges: hasUnsavedChanges,
        hasFragmentId: !!fragmentId,
      });
      return;
    }

    // Prevent concurrent saves
    if (saveInProgress.current) {
      console.log("Save already in progress");
      return;
    }

    saveInProgress.current = true;
    setIsSaving(true);

    try {
      // ✅ Save to database
      await onSave(fragmentId, editedFiles);
      
      if (isMounted.current) {
        toast.success("Files saved successfully!");
        // ✅ FIX 4: Don't reset state here - let parent's files prop update handle it
        // This prevents race conditions when parent re-renders with updated data
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

  // ✅ FIX 5: Optional - Add keyboard shortcut for save (Ctrl+S / Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isEditing && hasUnsavedChanges && !isSaving) {
          handleSave();
        }
      }
    };

    if (isEditing) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isEditing, hasUnsavedChanges, isSaving, handleSave]);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20} minSize={15} className="bg-sidebar">
        <TreeView
          data={treeData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle
        withHandle
        className="hover:bg-primary transition-colors z-10"
      />
      <ResizablePanel defaultSize={80} minSize={50}>
        {selectedFile && editedFiles[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
              <FileBreadcrumb filePath={selectedFile} />
              <div className="flex items-center gap-x-2">
                {hasUnsavedChanges && (
                  <span className="text-xs text-orange-500 font-medium">
                    • Unsaved changes
                  </span>
                )}

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
            <div className="flex-1 overflow-hidden">
              {isEditing ? (
                <EditableCodeView
                  code={editedFiles[selectedFile]}
                  lang={getLanguageFromExtension(selectedFile)}
                  onChange={handleCodeChange}
                  readOnly={false}
                />
              ) : (
                <div className="h-full overflow-auto">
                  <CodeView
                    code={editedFiles[selectedFile]}
                    lang={getLanguageFromExtension(selectedFile)}
                  />
                </div>
              )}
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