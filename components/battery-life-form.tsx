"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BatteryLifeFormProps {
  onSubmit: (mileagePerCycle: number, averageDailyMileage: number) => void;
  onBack: () => void;
  predictedRUL: number;
}

export function BatteryLifeForm({ onSubmit, onBack, predictedRUL }: BatteryLifeFormProps) {
  const [mileagePerCycle, setMileagePerCycle] = useState<number>(50);
  const [averageDailyMileage, setAverageDailyMileage] = useState<number>(30);

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
            Enter usage parameters to estimate remaining battery life in years.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-3 mb-4 text-sm bg-blue-50 rounded-md dark:bg-blue-950/50 text-blue-600 dark:text-blue-300">
            Predicted RUL: <span className="font-semibold">{predictedRUL.toFixed(2)} cycles</span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="mileagePerCycle" className="text-sm font-medium">
                  Mileage Per Cycle (miles)
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
                      <p>The average distance traveled per full battery cycle.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid gap-4">
                <Slider
                  id="mileagePerCycle-slider"
                  min={10}
                  max={200}
                  step={1}
                  value={[mileagePerCycle]}
                  onValueChange={(value) => setMileagePerCycle(value[0])}
                />
                <div className="flex items-center space-x-2">
                  <Input
                    id="mileagePerCycle"
                    type="number"
                    value={mileagePerCycle}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        setMileagePerCycle(value);
                      }
                    }}
                    min="1"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="averageDailyMileage" className="text-sm font-medium">
                  Average Daily Mileage (miles)
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
                      <p>The average distance traveled per day.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid gap-4">
                <Slider
                  id="averageDailyMileage-slider"
                  min={5}
                  max={100}
                  step={1}
                  value={[averageDailyMileage]}
                  onValueChange={(value) => setAverageDailyMileage(value[0])}
                />
                <div className="flex items-center space-x-2">
                  <Input
                    id="averageDailyMileage"
                    type="number"
                    value={averageDailyMileage}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        setAverageDailyMileage(value);
                      }
                    }}
                    min="1"
                    className="w-full"
                  />
                </div>
              </div>
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