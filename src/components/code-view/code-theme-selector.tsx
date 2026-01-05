import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaletteIcon, CheckIcon } from "lucide-react";

export type CodeTheme =
  | "tokyoNight"
  | "dracula"
  | "githubDark"
  | "vscodeDark"
  | "githubLight"
  | "vscodeLight";

interface CodeThemeSelectorProps {
  currentTheme: CodeTheme;
  onThemeChange: (theme: CodeTheme) => void;
  isDark: boolean;
}

const darkThemes: { value: CodeTheme; label: string }[] = [
  { value: "tokyoNight", label: "Tokyo Night" },
  { value: "dracula", label: "Dracula" },
  { value: "githubDark", label: "GitHub Dark" },
  { value: "vscodeDark", label: "VS Code Dark" },
];

const lightThemes: { value: CodeTheme; label: string }[] = [
  { value: "githubLight", label: "GitHub Light" },
  { value: "vscodeLight", label: "VS Code Light" },
];

export const CodeThemeSelector = ({
  currentTheme,
  onThemeChange,
  isDark,
}: CodeThemeSelectorProps) => {
  const themes = isDark ? darkThemes : lightThemes;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <PaletteIcon className="w-4 h-4" />
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => onThemeChange(theme.value)}
            className="cursor-pointer"
          >
            <span className="flex-1">{theme.label}</span>
            {currentTheme === theme.value && (
              <CheckIcon className="w-4 h-4 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
