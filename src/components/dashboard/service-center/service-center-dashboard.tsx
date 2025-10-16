"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentsTable } from "./appointments-table"
import { CustomerFeedbackView } from "./customer-feedback-view"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ServiceCenterDashboard() {
  return (
    <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle>Service Center Dashboard</CardTitle>
        <CardDescription>
          Manage appointments and review customer feedback.
        </CardDescription>
      </CardHeader>
    </Card>
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
    </div>
  )
}
