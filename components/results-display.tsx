"use client";

import { PredictionResult, BatteryLifeResult } from './battery-prediction-dashboard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { HealthIndicator } from './health-indicator';
import { LifespanChart } from './lifespan-chart';
import { motion } from 'framer-motion';

interface ResultsDisplayProps {
  predictionResult: PredictionResult | null;
  batteryLifeResult: BatteryLifeResult | null;
  resetPrediction: () => void;
}

export function ResultsDisplay({ 
  predictionResult, 
  batteryLifeResult,
  resetPrediction
}: ResultsDisplayProps) {
  const getBatteryHealthStatus = (rul: number) => {
    if (rul > 700) return { status: 'Excellent', color: 'bg-green-500' };
    if (rul > 400) return { status: 'Good', color: 'bg-blue-500' };
    if (rul > 200) return { status: 'Fair', color: 'bg-yellow-500' };
    return { status: 'Poor', color: 'bg-red-500' };
  };

  const getLifespanStatus = (years: number) => {
    if (years > 8) return { status: 'Excellent', icon: CheckCircle, color: 'text-green-500' };
    if (years > 5) return { status: 'Good', icon: CheckCircle, color: 'text-blue-500' };
    if (years > 3) return { status: 'Fair', icon: Info, color: 'text-yellow-500' };
    return { status: 'Poor', icon: AlertTriangle, color: 'text-red-500' };
  };

  if (!predictionResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Battery Health Results</CardTitle>
          <CardDescription>
            Enter battery parameters to see prediction results.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Info className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>Complete the prediction form to see your battery health analysis.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const healthStatus = getBatteryHealthStatus(predictionResult.predicted_RUL);
  
  let lifespanStatus = { status: 'Unknown', icon: Info, color: 'text-gray-500' };
  if (batteryLifeResult) {
    lifespanStatus = getLifespanStatus(batteryLifeResult.estimated_lifespan_years);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="overview">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            {batteryLifeResult && (
              <TabsTrigger value="lifespan">Lifespan</TabsTrigger>
            )}
          </TabsList>
          
          <Button variant="outline" size="sm" onClick={resetPrediction}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Prediction
          </Button>
        </div>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Battery Health Overview</CardTitle>
              <CardDescription>
                Summary of your battery's predicted health and performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground">Health Status</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${healthStatus.color}`}></span>
                      <span className="text-2xl font-bold">{healthStatus.status}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground">Predicted RUL</h3>
                    <p className="text-2xl font-bold">{predictionResult.predicted_RUL.toFixed(2)} cycles</p>
                  </div>
                  
                  {batteryLifeResult && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-muted-foreground">Estimated Lifespan</h3>
                      <div className="flex items-center space-x-2">
                        <lifespanStatus.icon className={`h-5 w-5 ${lifespanStatus.color}`} />
                        <span className="text-2xl font-bold">
                          {batteryLifeResult.estimated_lifespan_years.toFixed(1)} years
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <HealthIndicator value={predictionResult.predicted_RUL} maxValue={1000} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <div className="text-sm text-muted-foreground">
                <p>Based on degradation feature: {predictionResult.degradation_feature.toFixed(5)}</p>
                <p className="mt-1">Measurements: Re = {predictionResult.Re.toFixed(3)}Ω, Rct = {predictionResult.Rct.toFixed(3)}Ω</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
              <CardDescription>
                Comprehensive breakdown of battery parameters and predicted values.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg border bg-muted/40">
                    <h3 className="font-medium mb-2">Input Parameters</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Re (ohmic resistance)</dt>
                        <dd className="font-medium">{predictionResult.Re.toFixed(4)} Ω</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Rct (charge transfer resistance)</dt>
                        <dd className="font-medium">{predictionResult.Rct.toFixed(4)} Ω</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-muted/40">
                    <h3 className="font-medium mb-2">Calculated Results</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Degradation Feature</dt>
                        <dd className="font-medium">{predictionResult.degradation_feature.toFixed(5)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Predicted RUL</dt>
                        <dd className="font-medium">{predictionResult.predicted_RUL.toFixed(2)} cycles</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                {batteryLifeResult && (
                  <div className="p-4 rounded-lg border bg-muted/40">
                    <h3 className="font-medium mb-2">Lifespan Estimation</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Mileage Per Cycle</dt>
                        <dd className="font-medium">{batteryLifeResult.mileage_per_cycle} miles</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Average Daily Mileage</dt>
                        <dd className="font-medium">{batteryLifeResult.average_daily_mileage} miles</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Total Estimated Mileage</dt>
                        <dd className="font-medium">{batteryLifeResult.total_mileage.toFixed(2)} miles</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Estimated Lifespan</dt>
                        <dd className="font-medium">{batteryLifeResult.estimated_lifespan_years.toFixed(2)} years</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {batteryLifeResult && (
          <TabsContent value="lifespan">
            <Card>
              <CardHeader>
                <CardTitle>Battery Lifespan Projection</CardTitle>
                <CardDescription>
                  Visual representation of your battery's remaining useful life.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LifespanChart 
                  rul={predictionResult.predicted_RUL} 
                  yearsLeft={batteryLifeResult.estimated_lifespan_years}
                  mileagePerCycle={batteryLifeResult.mileage_per_cycle}
                  dailyMileage={batteryLifeResult.average_daily_mileage}
                />
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Based on {batteryLifeResult.mileage_per_cycle} miles per cycle and {batteryLifeResult.average_daily_mileage} miles daily usage.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </motion.div>
  );
}