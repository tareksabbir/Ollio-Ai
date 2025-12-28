import { Code2, ChevronRight } from "lucide-react";
import { Fragment } from "@/generated/prisma/browser";
import { cn } from "@/lib/utils";

interface FragmentCardProps {
  fragment: Fragment;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
    <button
      className={cn(
        "group relative flex items-center text-start gap-3 border rounded-xl w-fit p-4 transition-all duration-200 ease-in-out",
        "shadow-sm hover:shadow-md",
        isActiveFragment
          ? "bg-primary text-primary-foreground border-primary/50 shadow-md scale-[1.02]"
          : "bg-card hover:bg-accent hover:border-accent-foreground/20 hover:scale-[1.01]"
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <div
        className={cn(
          "p-2 rounded-lg transition-colors",
          isActiveFragment
            ? "bg-primary-foreground/10"
            : "bg-muted group-hover:bg-accent-foreground/10"
        )}
      >
        <Code2 className="size-4" />
      </div>

      <div className="flex flex-col flex-1 gap-1">
        <span className="text-sm font-semibold line-clamp-1 tracking-tight">
          {fragment.title}
        </span>
        <span
          className={cn(
            "text-xs transition-colors",
            isActiveFragment
              ? "text-primary-foreground/70"
              : "text-muted-foreground group-hover:text-foreground/70"
          )}
        >
          Preview
        </span>
      </div>

      <div className="flex items-center justify-center">
        <ChevronRight
          className={cn(
            "size-4 transition-transform duration-200",
            "group-hover:translate-x-0.5",
            isActiveFragment && "translate-x-0.5"
          )}
        />
      </div>
    </button>
  );
};

export default FragmentCard;
