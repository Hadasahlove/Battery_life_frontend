"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PredictionFormProps {
  onSubmit: (re: number, rct: number) => void;
}

export function PredictionForm({ onSubmit }: PredictionFormProps) {
  const [re, setRe] = useState<number>(0.01);
  const [rct, setRct] = useState<number>(0.01);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(re, rct);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Battery Parameters</CardTitle>
          <CardDescription>
            Enter Re (ohmic resistance) and Rct (charge transfer resistance) values to predict battery health.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="re" className="text-sm font-medium">
                  Re Value (ohms)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-3 w-3" />
                        <span className="sr-only">Re Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Re represents the ohmic resistance of the battery. Typical values range from 0.001 to 0.1 ohms.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid gap-4">
                <Slider
                  id="re-slider"
                  min={0.001}
                  max={0.1}
                  step={0.001}
                  value={[re]}
                  onValueChange={(value) => setRe(value[0])}
                />
                <div className="flex items-center space-x-2">
                  <Input
                    id="re"
                    type="number"
                    value={re}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0) {
                        setRe(value);
                      }
                    }}
                    step="0.001"
                    min="0.001"
                    max="0.1"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="rct" className="text-sm font-medium">
                  Rct Value (ohms)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-3 w-3" />
                        <span className="sr-only">Rct Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Rct represents the charge transfer resistance of the battery. Typical values range from 0.001 to 0.1 ohms.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid gap-4">
                <Slider
                  id="rct-slider"
                  min={0.001}
                  max={0.1}
                  step={0.001}
                  value={[rct]}
                  onValueChange={(value) => setRct(value[0])}
                />
                <div className="flex items-center space-x-2">
                  <Input
                    id="rct"
                    type="number"
                    value={rct}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0) {
                        setRct(value);
                      }
                    }}
                    step="0.001"
                    min="0.001"
                    max="0.1"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Calculate Prediction <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}