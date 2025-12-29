/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCallback, useMemo, useState } from "react";
import Hint from "./hint";
import { Button } from "./ui/button";
import { CopyIcon } from "lucide-react";
import { CodeView } from "./code-view";
import { convertFilesToTreeItems } from "@/lib/utils";
import TreeView from "./tree-view";

type FileCollection = { [path: string]: string };

function getLanguageFromExtention(filename: string): string {
  const extention = filename.split(".").pop()?.toLowerCase();
  return extention || "text";
}

interface FileExplorerProps {
  files: FileCollection;
}

const FileExplorer = ({ files }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const filekeys = Object.keys(files);
    return filekeys.length > 0 ? filekeys[0] : null;
  });

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) {
        setSelectedFile(filePath);
      }
    },
    [files]
  );

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
        className="hover:bg-primary transition-colors"
      />
      <ResizablePanel defaultSize={80} minSize={50}>
        {selectedFile && files[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between item-center gap-x-2">
              {/* todo file breadcum */}
              <Hint text="Copy to clipboard" side="bottom">
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto"
                  onClick={() => {}}
                  disabled={false}
                >
                  <CopyIcon />
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-auto">
              <CodeView
                code={files[selectedFile]}
                lang={getLanguageFromExtention(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            selected a file to view its content
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default FileExplorer;
