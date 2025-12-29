"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import type { editor } from "monaco-editor";

interface Props {
  code: string;
  lang: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export const EditableCodeView = ({ code, lang, onChange, readOnly = false }: Props) => {
  const { theme, resolvedTheme } = useTheme(); // Add resolvedTheme
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Language mapping with better detection
  const getLanguage = (ext: string): string => {
    const map: Record<string, string> = {
      js: "javascript",
      jsx: "javascript", 
      ts: "typescript",
      tsx: "typescript",
      html: "html",
      css: "css",
      json: "json",
      md: "markdown",
      py: "python",
      yml: "yaml",
      yaml: "yaml",
      sh: "shell",
      bash: "bash",
    };
    return map[ext.toLowerCase()] || "plaintext";
  };

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor; // Store editor reference

    // Disable error checking that might cause issues
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
    
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true, 
      noSyntaxValidation: false,
    });

    // Compiler options for better JS/TS support
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,
      typeRoots: ["node_modules/@types"],
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,
      typeRoots: ["node_modules/@types"],
    });
  };

  // Update theme when it changes
  useEffect(() => {
    if (editorRef.current) {
      const newTheme = (resolvedTheme || theme) === "dark" ? "vs-dark" : "vs";
      editorRef.current.updateOptions({
        theme: newTheme,
      });
    }
  }, [theme, resolvedTheme]);

  // Determine Monaco theme based on next-themes
  const monacoTheme = (resolvedTheme || theme) === "dark" ? "vs-dark" : "vs";

  return (
    <Editor
      height="100%"
      defaultLanguage={getLanguage(lang)}
      language={getLanguage(lang)}
      defaultValue={code}
      value={code}
      theme={monacoTheme}
      onMount={handleMount}
      onChange={(value) => {
        if (onChange && value !== undefined) {
          onChange(value);
        }
      }}
      options={{
        readOnly: readOnly,
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: "on",
        padding: { top: 12, bottom: 12 },
        folding: true,
        
        // IntelliSense settings
        quickSuggestions: {
          other: true,
          comments: false,
          strings: true,
        },
        parameterHints: { enabled: true },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnCommitCharacter: true,
        tabCompletion: "on",
        wordBasedSuggestions: "matchingDocuments",
        
        // Formatting
        formatOnPaste: true,
        formatOnType: false,
        
        // UI
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        renderLineHighlight: "all",
        guides: {
          bracketPairs: true,
          indentation: true,
        },
      }}
    />
  );
};