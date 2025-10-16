
"use client";

import { AnomalyTimeline } from "@/components/dashboard/manager/advanced/anomaly-timeline";
import { ComponentFailurePath } from "@/components/dashboard/manager/advanced/component-failure-path";

export default function AdvancedAnalyticsPage() {
  return (
    <div className="space-y-6">
      <ComponentFailurePath />
      <AnomalyTimeline />
    </div>
  );
}
