"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { serviceCenters } from "@/lib/data"
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export function ServiceScheduler() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [centerId, setCenterId] = useState<string | undefined>();
  const [timeSlot, setTimeSlot] = useState<string | undefined>();
  const { toast } = useToast();

  const selectedCenter = serviceCenters.find(c => c.id === centerId);

  const handleBooking = () => {
    if (!date || !centerId || !timeSlot) {
      toast({
        title: "Incomplete Information",
        description: "Please select a date, service center, and time slot.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Appointment Booked!",
      description: `Your service is confirmed for ${date.toLocaleDateString()} at ${timeSlot}.`,
    });
    // Reset state after booking
    setDate(new Date());
    setCenterId(undefined);
    setTimeSlot(undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Service</CardTitle>
        <CardDescription>Book your next maintenance appointment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
        />
        <Select value={centerId} onValueChange={setCenterId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a service center" />
          </SelectTrigger>
          <SelectContent>
            {serviceCenters.map(center => (
              <SelectItem key={center.id} value={center.id}>{center.name} - {center.city}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedCenter && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Available Slots</h4>
            <div className="grid grid-cols-3 gap-2">
              {selectedCenter.availableSlots.map(slot => (
                <Button 
                    key={slot} 
                    variant="outline"
                    className={cn(timeSlot === slot && 'border-primary ring-2 ring-primary')}
                    onClick={() => setTimeSlot(slot)}
                >
                    {slot}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Button className="w-full" onClick={handleBooking} disabled={!date || !centerId || !timeSlot}>
            <Check className="mr-2 h-4 w-4" />
            Confirm Booking
        </Button>

      </CardContent>
    </Card>
  )
}
