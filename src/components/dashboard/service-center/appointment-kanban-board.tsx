
"use client"

import { useState, useMemo } from 'react';
import type { Appointment, AppointmentStatus, Technician } from '@/lib/types';
import { appointments, vehicles, technicians } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from '@/components/ui/scroll-area';

const columns: AppointmentStatus[] = ['Pending', 'In Service', 'Awaiting Parts', 'Completed'];

const columnStyles = {
  'Pending': 'bg-blue-500/10 border-blue-500/50',
  'In Service': 'bg-yellow-500/10 border-yellow-500/50',
  'Awaiting Parts': 'bg-orange-500/10 border-orange-500/50',
  'Completed': 'bg-green-500/10 border-green-500/50',
};

function AppointmentCard({ appointment, onDragStart, onClick }: { appointment: Appointment; onDragStart: (e: React.DragEvent, id: string) => void; onClick: () => void }) {
  const vehicle = vehicles.find(v => v.id === appointment.vehicleId);
  const technician = technicians.find(t => t.id === appointment.technicianId);

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, appointment.id)}
      className="mb-3 cursor-grab active:cursor-grabbing"
      onClick={onClick}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium">{vehicle?.make} {vehicle?.model}</CardTitle>
        <CardDescription className="text-xs">{vehicle?.vin}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <p className="text-xs text-muted-foreground truncate">{appointment.notes}</p>
        <div className="flex justify-between items-center">
            {technician ? (
                 <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://i.pravatar.cc/40?u=${technician.id}`} />
                        <AvatarFallback>{technician.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{technician.name}</span>
                </div>
            ) : <div />}
          <Badge variant="secondary">{appointment.estimatedTime}hr</Badge>
        </div>
        <Progress value={appointment.stageProgress} className="h-1 mt-2" />
      </CardContent>
    </Card>
  );
}

function KanbanColumn({ status, appointments, onDragOver, onDrop, onCardClick, onDragStart }: { 
    status: AppointmentStatus; 
    appointments: Appointment[]; 
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, status: AppointmentStatus) => void;
    onCardClick: (appointment: Appointment) => void;
    onDragStart: (e: React.DragEvent, id: string) => void;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
      className={`rounded-lg p-2 h-full flex-shrink-0 w-72 ${columnStyles[status]}`}
    >
      <h3 className="font-semibold text-sm p-2">{status} ({appointments.length})</h3>
      <ScrollArea className="h-[calc(100%-2.5rem)]">
        <div className="p-2">
            {appointments.map(app => (
            <AppointmentCard key={app.id} appointment={app} onDragStart={onDragStart} onClick={() => onCardClick(app)} />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}


export function AppointmentKanbanBoard() {
  const [boardData, setBoardData] = useState<Appointment[]>(appointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("appointmentId", id);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, newStatus: AppointmentStatus) => {
    const appointmentId = e.dataTransfer.getData("appointmentId");
    setBoardData(prevData =>
      prevData.map(app =>
        app.id === appointmentId ? { ...app, status: newStatus } : app
      )
    );
  };

  const handleCardClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  }

  const handleCloseModal = () => {
    setSelectedAppointment(null);
  }

  const handleAssignTechnician = (techId: string) => {
    if (selectedAppointment) {
        const updatedApp = {...selectedAppointment, technicianId: techId};
        setSelectedAppointment(updatedApp);
        setBoardData(prev => prev.map(app => app.id === updatedApp.id ? updatedApp : app));
    }
  }
  
  const vehicleForModal = useMemo(() => {
    if (!selectedAppointment) return null;
    return vehicles.find(v => v.id === selectedAppointment.vehicleId);
  }, [selectedAppointment]);
  
  const technicianForModal = useMemo(() => {
    if (!selectedAppointment?.technicianId) return null;
    return technicians.find(t => t.id === selectedAppointment.technicianId);
  }, [selectedAppointment]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment & Scheduling Board</CardTitle>
        <CardDescription>Drag and drop appointments to update their status.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4 pb-4 h-[60vh]">
            {columns.map(status => (
                <KanbanColumn
                key={status}
                status={status}
                appointments={boardData.filter(app => app.status === status)}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onCardClick={handleCardClick}
                onDragStart={onDragStart}
                />
            ))}
            </div>
        </ScrollArea>
      </CardContent>
      {selectedAppointment && (
        <Dialog open={!!selectedAppointment} onOpenChange={handleCloseModal}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Service for {vehicleForModal?.make} {vehicleForModal?.model}</DialogTitle>
                    <DialogDescription>{vehicleForModal?.vin}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                    <div>
                        <p className="font-medium">Issue Notes</p>
                        <p className="text-muted-foreground">{selectedAppointment.notes}</p>
                    </div>
                     <div>
                        <p className="font-medium">Technician</p>
                        <Select onValueChange={handleAssignTechnician} defaultValue={technicianForModal?.id}>
                            <SelectTrigger>
                                <SelectValue placeholder="Assign a technician" />
                            </SelectTrigger>
                            <SelectContent>
                                {technicians.map(tech => (
                                    <SelectItem key={tech.id} value={tech.id}>{tech.name} ({tech.specialty})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <p className="font-medium">Service History</p>
                        <ul className="list-disc list-inside text-muted-foreground text-xs">
                           {vehicleForModal?.maintenanceHistory.map(h => (
                             <li key={h.id}>{new Date(h.date).toLocaleDateString('en-IN')}: {h.service}</li>
                           ))}
                        </ul>
                    </div>
                </div>
                 <Button onClick={handleCloseModal}>Close</Button>
            </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
