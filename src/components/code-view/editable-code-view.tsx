/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTheme } from "next-themes";
import { useMemo, useRef, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { EditorView } from "@codemirror/view";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { CodeTheme } from "./code-theme-selector";

interface Props {
  code: string;
  lang: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  theme?: CodeTheme;
}

export const EditableCodeView = ({
  code,
  lang,
  onChange,
  readOnly = false,
  theme: propTheme,
}: Props) => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = (resolvedTheme || theme) === "dark";
  const editorRef = useRef<any>(null);

  // থিম অবজেক্ট ম্যাপ করা হচ্ছে
  const getTheme = () => {
    if (propTheme === "vscodeDark") return vscodeDark;
    if (propTheme === "vscodeLight") return vscodeLight;
    if (propTheme === "tokyoNight") return tokyoNight;
    if (propTheme === "dracula") return dracula;
    if (propTheme === "githubDark") return githubDark;
    if (propTheme === "githubLight") return githubLight;

    // ডিফল্ট ফলব্যাক
    return isDark ? vscodeDark : githubLight;
  };

  const getLanguageExtension = (input: string) => {
    const key = input.toLowerCase();
    const extensions: Record<string, any> = {
      js: javascript({ jsx: true }),
      jsx: javascript({ jsx: true }),
      javascript: javascript({ jsx: true }),
      ts: javascript({ jsx: true, typescript: true }),
      tsx: javascript({ jsx: true, typescript: true }),
      typescript: javascript({ jsx: true, typescript: true }),
      html: html(),
      css: css(),
      json: json(),
      md: markdown(),
      markdown: markdown(),
      py: python(),
      python: python(),
    };
    return extensions[key] || javascript();
  };

  const extensions = useMemo(() => {
    return [
      getLanguageExtension(lang),
      EditorView.lineWrapping,
      EditorView.theme({
        "&": {
          backgroundColor: "transparent !important",
          height: "100%",
        },
        ".cm-content": {
          minHeight: "100%",
        },
        ".cm-gutters": {
          backgroundColor: "transparent !important",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".cm-scroller": {
          backgroundColor: "transparent !important",
          overflow: "auto",
        },
      }),
    ];
  }, [lang]);

  // Editor focus করার জন্য helper function
  useEffect(() => {
    if (editorRef.current && !readOnly) {
      const view = editorRef.current.view;
      if (view && code === "") {
        // যদি code empty হয়, তাহলে editor কে focus করি
        view.focus();
      }
    }
  }, [code, readOnly]);

  return (
    <div className="h-full w-full overflow-auto">
      <CodeMirror
        ref={editorRef}
        value={code}
        height="100%"
        extensions={extensions}
        theme={getTheme()}
        onChange={(value) => {
          if (onChange) {
            // Empty string এর জন্যও onChange call করি
            onChange(value);
          }
        }}
        editable={!readOnly}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
        style={{
          fontSize: "14px",
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          background: "transparent",
          height: "100%",
        }}
      />
    </div>
  );
};