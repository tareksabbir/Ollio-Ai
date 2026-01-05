// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// /**
//  * Convert a record of files to a tree structure.
//  * @param files - Record of file paths to content
//  * @returns Tree structure for TreeView component
//  *
//  * @example
//  * Input: { "src/Button.tsx": "...", "README.md": "..." }
//  * Output: [["src", "Button.tsx"], "README.md"]
//  */

// export  type TreeItem = string | [string, ...TreeItem[]];

// export function convertFilesToTreeItems(
//   files: Record<string, string>
// ): TreeItem[] {
//   // Define proper type for tree structure
//   interface TreeNode {
//     [key: string]: TreeNode | null;
//   }

//   // Build a tree structure first
//   const tree: TreeNode = {};

//   // Sort files to ensure consistent ordering
//   const sortedPaths = Object.keys(files).sort();

//   for (const filePath of sortedPaths) {
//     const parts = filePath.split("/");
//     let current = tree;

//     // Navigate/create the tree structure
//     for (let i = 0; i < parts.length - 1; i++) {
//       const part = parts[i];
//       if (!current[part]) {
//         current[part] = {};
//       }
//       current = current[part];
//     }

//     // Add the file (leaf node)
//     const fileName = parts[parts.length - 1];
//     current[fileName] = null; // null indicates it's a file
//   }

//   // Convert tree structure to TreeItem format
//   function convertNode(node: TreeNode, name?: string): TreeItem[] | TreeItem {
//     const entries = Object.entries(node);

//     if (entries.length === 0) {
//       return name || "";
//     }

//     const children: TreeItem[] = [];

//     for (const [key, value] of entries) {
//       if (value === null) {
//         // It's a file
//         children.push(key);
//       } else {
//         // It's a folder
//         const subTree = convertNode(value, key);
//         if (Array.isArray(subTree)) {
//           children.push([key, ...subTree]);
//         } else {
//           children.push([key, subTree]);
//         }
//       }
//     }

//     return children;
//   }

//   const result = convertNode(tree);
//   return Array.isArray(result) ? result : [result];
// }

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * TreeItem Type:
 * - string: A file (e.g., "Button.tsx")
 * - [string, ...TreeItem[]]: A folder (e.g., ["src", "Button.tsx", ["components", "Header.tsx"]])
 */
export type TreeItem = string | [string, ...TreeItem[]];

/**
 * Convert a record of files to a tree structure.
 * @param files - Record of file paths to content
 * @returns Tree structure for TreeView component
 */
export function convertFilesToTreeItems(
  files: Record<string, string>
): TreeItem[] {
  // Define proper type for tree structure
  interface TreeNode {
    [key: string]: TreeNode | null; // null indicates a file, {} indicates an empty folder or node awaiting children
  }

  // Build a tree structure first
  const tree: TreeNode = {};

  // Sort files to ensure consistent ordering
  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const parts = filePath.split("/");
    let current = tree;

    // Navigate/create the tree structure
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {}; // Create node for folder
      }
      current = current[part] as TreeNode;
    }

    // Add the file (leaf node)
    const fileName = parts[parts.length - 1];
    current[fileName] = null; // null indicates it's a file
  }

  // Convert tree structure to TreeItem format
  function convertNode(node: TreeNode): TreeItem[] {
    const children: TreeItem[] = [];

    const sortedKeys = Object.keys(node).sort((a, b) => {
        const aIsFile = node[a] === null;
        const bIsFile = node[b] === null;

        // Folders before files
        if (!aIsFile && bIsFile) return -1;
        if (aIsFile && !bIsFile) return 1;
        // Alphabetical order for same type
        return a.localeCompare(b);
    });

    for (const key of sortedKeys) {
      const value = node[key];

      if (value === null) {
        // It's a file (string)
        children.push(key);
      } else {
        // It's a folder (array: [name, ...children])
        const subItems = convertNode(value);
        if (subItems.length > 0) {
            children.push([key, ...subItems]);
        } else {
            // Handle case where a folder might be empty or contains only the name
            children.push(key); 
        }
      }
    }

    return children;
  }

  const result = convertNode(tree);
  return result;
}