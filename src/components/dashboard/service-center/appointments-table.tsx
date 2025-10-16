"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { appointments, vehicles, serviceCenters } from "@/lib/data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

export function AppointmentsTable() {

  const getVehicleInfo = (vehicleId: string) => vehicles.find(v => v.id === vehicleId);
  const getServiceCenterInfo = (scId: string) => serviceCenters.find(sc => sc.id === scId);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>
          A list of all booked services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Service Center</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => {
              const vehicle = getVehicleInfo(appointment.vehicleId);
              const serviceCenter = getServiceCenterInfo(appointment.serviceCenterId);
              return (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{vehicle ? `${vehicle.make} ${vehicle.model}` : 'N/A'}</TableCell>
                  <TableCell>{appointment.date} at {appointment.time}</TableCell>
                  <TableCell>{serviceCenter?.name || 'N/A'}</TableCell>
                  <TableCell className="max-w-xs truncate">{appointment.notes}</TableCell>
                  <TableCell>
                    <Badge 
                        variant={
                            appointment.status === 'Completed' ? 'default' :
                            appointment.status === 'Cancelled' ? 'destructive' : 'secondary'
                        }
                        className={
                            appointment.status === 'Completed' ? 'bg-green-600' : 
                            appointment.status === 'In Progress' ? 'bg-blue-500' : ''
                        }
                    >{appointment.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Mark as In Progress</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Cancel Appointment</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
