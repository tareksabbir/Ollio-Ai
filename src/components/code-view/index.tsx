/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTheme } from "next-themes";
import { useMemo } from "react";
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
  theme?: CodeTheme;
}

export const CodeView = ({ code, lang, theme: propTheme }: Props) => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = (resolvedTheme || theme) === "dark";

  const getTheme = () => {
    if (propTheme === "tokyoNight") return tokyoNight;
    if (propTheme === "dracula") return dracula;
    if (propTheme === "githubDark") return githubDark;
    if (propTheme === "githubLight") return githubLight;
    if (propTheme === "vscodeDark") return vscodeDark;
    if (propTheme === "vscodeLight") return vscodeLight;
    // ফলব্যাক
    return isDark ? dracula : githubLight;
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
        },
        ".cm-gutters": {
          backgroundColor: "transparent !important",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".cm-scroller": {
          backgroundColor: "transparent !important",
        },
      }),
    ];
  }, [lang]);

  return (
    <div className="h-full w-full">
      <CodeMirror
        value={code}
        height="100%"
        extensions={extensions}
        theme={getTheme()}
        editable={false}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          syntaxHighlighting: true,
          bracketMatching: true,
        }}
        style={{
          fontSize: "14px",
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          background: "transparent",
        }}
      />
    </div>
  );
};