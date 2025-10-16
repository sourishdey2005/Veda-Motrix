"use client"

import { MasterAgentView } from "./master-agent-view"
import { UebaView } from "./ueba-view"
import { ManufacturingInsightsView } from "./manufacturing-insights-view"
import { ServiceAnalyticsView } from "./service-analytics-view"

export function ManagerDashboard() {
  return (
    <div className="space-y-4">
      <MasterAgentView />
      <UebaView />
      <ManufacturingInsightsView />
      <ServiceAnalyticsView />
    </div>
  )
}
