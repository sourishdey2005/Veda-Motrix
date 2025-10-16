
"use client";

import { AnomalyTimeline } from "@/components/dashboard/manager/advanced/anomaly-timeline";
import { ComponentFailurePath } from "@/components/dashboard/manager/advanced/component-failure-path";
import { FailurePatternMap } from "@/components/dashboard/manager/advanced/failure-pattern-map";

export default function AdvancedAnalyticsPage() {
  return (
    <div className="space-y-6">
      <FailurePatternMap />
      <ComponentFailurePath />
      <AnomalyTimeline />
    </div>
  );
}
