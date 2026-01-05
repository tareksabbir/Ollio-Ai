"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { formatDuration, intervalToDuration } from "date-fns";
import { CrownIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  points: number;
  msBeforeNext: number;
}

const Usage = ({ points, msBeforeNext }: Props) => {
  const { has } = useAuth();

  // Plan access
  const hasProAccess = has?.({ plan: "pro_plan" });
  const hasTeamAccess = has?.({ plan: "team_plan" });
  const hasEnterpriseAccess = has?.({ plan: "enterprise_plan" });

  const hasPaidPlan =
    hasProAccess || hasTeamAccess || hasEnterpriseAccess;

  // Memoized reset time (deterministic & safe)
  const resetTime = useMemo(() => {
    if (!msBeforeNext || msBeforeNext <= 0) {
      return "soon";
    }

    if (msBeforeNext < 60_000) {
      return "less than a minute";
    }

    return formatDuration(
      intervalToDuration({
        start: 0,
        end: msBeforeNext,
      }),
      {
        format: ["months", "days", "hours", "minutes"],
      }
    );
  }, [msBeforeNext]);

  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">
            {points} {hasPaidPlan ? "" : "free"} credits remaining
          </p>
          <p className="text-xs text-muted-foreground">
            Resets in {resetTime}
          </p>
        </div>

     
          <Button asChild size="sm" variant="default" className="ml-auto">
            <Link href="/pricing">
              <CrownIcon className="mr-1 h-4 w-4" />
              Upgrade
            </Link>
          </Button>
        
      </div>
    </div>
  );
};

export default Usage;
