"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { indianMakes, indianModels } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AddVehicleForm({ onVehicleAdded }: { onVehicleAdded: () => void }) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addVehicle } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model || !year) {
        toast({ title: "Missing fields", description: "Please fill out all fields.", variant: "destructive" });
        return;
    }
    setIsLoading(true);

    addVehicle({ make, model, year: parseInt(year) });
    
    toast({
        title: "Vehicle Added",
        description: `${make} ${model} is now being monitored.`
    });

    setIsLoading(false);
    onVehicleAdded();
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="make">Make</Label>
           <Select onValueChange={setMake} value={make}>
            <SelectTrigger id="make">
              <SelectValue placeholder="Select Make" />
            </SelectTrigger>
            <SelectContent>
              {indianMakes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            placeholder="e.g., XUV700"
            required
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="year">Year</Label>
          <Input 
            id="year" 
            type="number" 
            required 
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={isLoading}
            placeholder='e.g., 2023'
          />
        </div>
        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Vehicle
        </Button>
      </div>
    </form>
  );
}
