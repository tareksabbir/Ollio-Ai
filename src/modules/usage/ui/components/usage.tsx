"use client";
import { Button } from "@/components/ui/button";
import { formatDuration, intervalToDuration } from "date-fns";
import { CrownIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  points: number;
  msBeforeNext: number;
}

const Usage = ({ points, msBeforeNext }: Props) => {
  const resetTime = formatDuration(
    intervalToDuration({
      start: 0,
      end: msBeforeNext,
    }),
    {
      format: ["months", "days", "hours"],
    }
  );

  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">{points} free credits remaining</p>
          <p className="text-xs text-muted-foreground">
            Resets in {resetTime}
          </p>
        </div>
        <Button asChild size="sm" className="ml-auto">
          <Link href="/pricing">
            <CrownIcon className="w-4 h-4 mr-1" /> Upgrade
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Usage;