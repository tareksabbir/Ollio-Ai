"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { formatDuration, intervalToDuration } from "date-fns";
import { CrownIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  points: number;
  msBeforeNext: number;
}

const restTime = ({ msBeforeNext }: { msBeforeNext: number }) => {
  const duration = formatDuration(
    intervalToDuration({
      start: new Date(),
      end: new Date(Date.now() + msBeforeNext),
    }),
    {
      format: ["months", "days", "hours"],
    }
  );
  return duration;
};

const Usage = ({ points, msBeforeNext }: Props) => {
  const { has } = useAuth();

  // Check plan access (FIXED: correct plan names)
  const hasProAccess = has?.({ plan: "pro_plan" });
  const hasTeamAccess = has?.({ plan: "team_plan" });
  const hasEnterpriseAccess = has?.({ plan: "enterprise_plan" });

  const resetTime = restTime({ msBeforeNext });

  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">
            {points}{" "}
            {hasProAccess || hasEnterpriseAccess || hasTeamAccess ? "" : "free"}{" "}
            credits remaining
          </p>
          <p className="text-xs text-muted-foreground">Resets in {resetTime}</p>
        </div>

        <Button asChild size="sm" variant="default" className="ml-auto">
          <Link href="/pricing">
            <CrownIcon /> Upgrade
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Usage;
