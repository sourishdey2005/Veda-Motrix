"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentsTable } from "./appointments-table"
import { CustomerFeedbackView } from "./customer-feedback-view"

export function ServiceCenterDashboard() {
  return (
    <Tabs defaultValue="appointments" className="space-y-4">
      <TabsList>
        <TabsTrigger value="appointments">Booked Appointments</TabsTrigger>
        <TabsTrigger value="feedback">Customer Feedback</TabsTrigger>
      </TabsList>
      <TabsContent value="appointments">
        <AppointmentsTable />
      </TabsContent>
      <TabsContent value="feedback">
        <CustomerFeedbackView />
      </TabsContent>
    </Tabs>
  )
}
