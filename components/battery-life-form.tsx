"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface BatteryLifeFormProps {
  onSubmit: (mileagePerCycle: number, averageDailyMileage: number) => void;
  onBack: () => void;
  predictedRUL: number;
}

export function BatteryLifeForm({ onSubmit, onBack, predictedRUL }: BatteryLifeFormProps) {
  const [mileagePerCycle, setMileagePerCycle] = useState<number>(200); // realistic EV default
  const [averageDailyMileage, setAverageDailyMileage] = useState<number>(60); // realistic urban usage

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(mileagePerCycle, averageDailyMileage);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Battery Lifespan Estimation</CardTitle>
          <CardDescription>
            Enter EV usage details to estimate remaining battery life in years.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-3 mb-4 text-sm bg-blue-50 rounded-md dark:bg-blue-950/50 text-blue-600 dark:text-blue-300">
            Predicted RUL: <span className="font-semibold">{predictedRUL.toFixed(2)} cycles</span>
          </div>

          <div className="space-y-4">
            {/* Mileage per cycle */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="mileagePerCycle" className="text-sm font-medium">
                  Mileage Per Cycle (km)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-3 w-3" />
                        <span className="sr-only">Mileage Per Cycle Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Typical range for a full EV battery cycle (e.g. 150–400 km).</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Slider
                id="mileagePerCycle-slider"
                min={50}
                max={400}
                step={10}
                value={[mileagePerCycle]}
                onValueChange={(value) => setMileagePerCycle(value[0])}
              />
              <Input
                id="mileagePerCycle"
                type="number"
                value={mileagePerCycle}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 50 && value <= 400) {
                    setMileagePerCycle(value);
                  }
                }}
                min={50}
                max={400}
                className="w-full"
              />
            </div>

            {/* Average daily mileage */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="averageDailyMileage" className="text-sm font-medium">
                  Average Daily Mileage (km)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-3 w-3" />
                        <span className="sr-only">Average Daily Mileage Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Average distance driven each day (e.g. 30–100 km in urban settings).</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Slider
                id="averageDailyMileage-slider"
                min={10}
                max={200}
                step={5}
                value={[averageDailyMileage]}
                onValueChange={(value) => setAverageDailyMileage(value[0])}
              />
              <Input
                id="averageDailyMileage"
                type="number"
                value={averageDailyMileage}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 10 && value <= 200) {
                    setAverageDailyMileage(value);
                  }
                }}
                min={10}
                max={200}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button type="submit">
            Calculate Lifespan <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
