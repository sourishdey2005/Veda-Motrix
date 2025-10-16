"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MasterAgentView } from "./master-agent-view"
import { UebaView } from "./ueba-view"
import { ManufacturingInsightsView } from "./manufacturing-insights-view"
import { ServiceAnalyticsView } from "./service-analytics-view"

export function ManagerDashboard() {
  return (
    <Tabs defaultValue="master-agent" className="space-y-4">
      <TabsList>
        <TabsTrigger value="master-agent">Master Agent</TabsTrigger>
        <TabsTrigger value="ueba">UEBA Security</TabsTrigger>
        <TabsTrigger value="manufacturing">Manufacturing Insights</TabsTrigger>
        <TabsTrigger value="analytics">Service Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="master-agent">
        <MasterAgentView />
      </TabsContent>
      <TabsContent value="ueba">
        <UebaView />
      </TabsContent>
       <TabsContent value="manufacturing">
        <ManufacturingInsightsView />
      </TabsContent>
       <TabsContent value="analytics">
        <ServiceAnalyticsView />
      </TabsContent>
    </Tabs>
  )
}
