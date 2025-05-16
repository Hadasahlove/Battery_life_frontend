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
  // Add debug state
  const [isDebugMode, setIsDebugMode] = useState<boolean>(false);
  const [apiUrl, setApiUrl] = useState<string>(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Using API URL: ${apiUrl}`);
    console.log(`Submitting values - Re: ${re}, Rct: ${rct}`);
    onSubmit(re, rct);
  };

  const toggleDebug = () => {
    setIsDebugMode(!isDebugMode);
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
          {/* Debug Panel */}
          {isDebugMode && (
            <div className="p-3 mb-4 text-sm bg-amber-50 rounded-md dark:bg-amber-950/50 text-amber-600 dark:text-amber-300 space-y-2">
              <p className="font-semibold">Debug Mode</p>
              <div>
                <Label htmlFor="apiUrl">API URL:</Label>
                <Input 
                  id="apiUrl" 
                  value={apiUrl} 
                  onChange={(e) => setApiUrl(e.target.value)} 
                  className="mt-1"
                />
                <p className="text-xs mt-1">
                  ENV: {process.env.NEXT_PUBLIC_API_URL || 'not set'}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Re input */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="re">Re Value (ohms)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-3 w-3" />
                        <span className="sr-only">Re Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Ohmic resistance of the battery. Typical values range from 0.01 to 0.5 ohms.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Slider
                id="re-slider"
                min={0.001}
                max={0.5}
                step={0.001}
                value={[re]}
                onValueChange={(value) => setRe(value[0])}
              />
              <Input
                id="re"
                type="number"
                step="0.001"
                min={0.001}
                max={0.5}
                value={re}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0) {
                    setRe(value);
                  }
                }}
                className="w-full"
              />
            </div>

            {/* Rct input */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="rct">Rct Value (ohms)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-3 w-3" />
                        <span className="sr-only">Rct Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Charge transfer resistance of the battery. Typical values range from 0.01 to 1.5 ohms.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Slider
                id="rct-slider"
                min={0.001}
                max={1.5}
                step={0.001}
                value={[rct]}
                onValueChange={(value) => setRct(value[0])}
              />
              <Input
                id="rct"
                type="number"
                step="0.001"
                min={0.001}
                max={1.5}
                value={rct}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0) {
                    setRct(value);
                  }
                }}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full">
            Calculate Prediction <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={toggleDebug}
          >
            {isDebugMode ? 'Hide Debug Tools' : 'Show Debug Tools'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}