import { TreeItem } from "@/lib/utils";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "../ui/sidebar";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

interface TreeProps {
  item: TreeItem;
  selectedValue?: string | null;
  onSelect?: (value: string) => void;
  parentPath: string;
}

const Tree = ({ item, selectedValue, onSelect, parentPath }: TreeProps) => {
  const isFolder = Array.isArray(item);
  const name = isFolder ? item[0] : (item as string);
  const items = isFolder ? item.slice(1) : [];

  const currentPath = parentPath ? `${parentPath}/${name}` : name;
  const isSelected = selectedValue === currentPath;

  if (!isFolder) {
    return (
      <SidebarMenuButton
        isActive={isSelected}
        className="data-[active=true]:bg-transparent"
        onClick={() => onSelect?.(currentPath)}
      >
        <FileIcon className="w-4 h-4"/>
        <span className="truncate">{name}</span>
      </SidebarMenuButton>
    );
  }
  
  // এটি ফোল্ডার ([string, ...TreeItem[]])
  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRightIcon className="transition-transform w-4 h-4" />
            <FolderIcon className="w-4 h-4" />
            <span className="truncate">{name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem, index) => (
              <Tree
                key={index}
                item={subItem}
                selectedValue={selectedValue}
                onSelect={onSelect}
                parentPath={currentPath}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

export default Tree;
