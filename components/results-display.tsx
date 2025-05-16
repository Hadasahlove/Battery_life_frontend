import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { BatteryHealthChart } from './battery-health-chart';
import { HealthIndicator } from './health-indicator';
import { PredictionResult, BatteryLifeResult } from './battery-prediction-dashboard';

interface ResultsDisplayProps {
  predictionResult: PredictionResult | null;
  batteryLifeResult: BatteryLifeResult | null;
  resetPrediction: () => void;
}

export function ResultsDisplay({ predictionResult, batteryLifeResult, resetPrediction }: ResultsDisplayProps) {
  const getBatteryHealthStatus = (rul: number) => {
    if (rul > 800) return { status: 'Excellent', color: 'bg-green-500' };
    if (rul > 600) return { status: 'Good', color: 'bg-blue-500' };
    if (rul > 400) return { status: 'Fair', color: 'bg-yellow-500' };
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
          <CardDescription>Enter battery parameters to see prediction results.</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
          <Info className="w-12 h-12 opacity-20 mb-2" />
          Complete the prediction form to see results.
        </CardContent>
      </Card>
    );
  }

  const healthStatus = getBatteryHealthStatus(predictionResult.predicted_RUL);
  const lifespanStatus = batteryLifeResult
    ? getLifespanStatus(batteryLifeResult.estimated_lifespan_years)
    : { status: 'Unknown', icon: Info, color: 'text-gray-500' };
  const LifespanIcon = lifespanStatus.icon;

  return (
    <Tabs defaultValue="overview">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          {batteryLifeResult && <TabsTrigger value="lifespan">Lifespan</TabsTrigger>}
        </TabsList>
        <button onClick={resetPrediction} className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <RefreshCw className="w-4 h-4" />
          New Prediction
        </button>
      </div>

      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Battery Health Overview</CardTitle>
            <CardDescription>
              Summary of your battery's predicted health and performance.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-muted-foreground font-medium mb-1">Health Status</h4>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${healthStatus.color}`}></span>
                  <span className="text-lg font-bold">{healthStatus.status}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm text-muted-foreground font-medium mb-1">Predicted RUL</h4>
                <p className="text-lg font-bold">{predictionResult.predicted_RUL.toFixed(2)} cycles</p>
              </div>
              {batteryLifeResult && (
                <div>
                  <h4 className="text-sm text-muted-foreground font-medium mb-1">Estimated Lifespan</h4>
                  <div className="flex items-center space-x-2">
                    <LifespanIcon className={`h-5 w-5 ${lifespanStatus.color}`} />
                    <span className="text-lg font-bold">
                      {batteryLifeResult.estimated_lifespan_years.toFixed(1)} years
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div>
              <HealthIndicator value={predictionResult.predicted_RUL} maxValue={1000} />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 text-sm text-muted-foreground">
            <p>Degradation Feature: {predictionResult.degradation_feature.toFixed(5)}</p>
            <p>Measurements: Re = {predictionResult.Re.toFixed(3)}Ω, Rct = {predictionResult.Rct.toFixed(3)}Ω</p>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="details">
        <Card>
          <CardHeader>
            <CardTitle>Prediction Details</CardTitle>
            <CardDescription>All values used for prediction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Re:</strong> {predictionResult.Re.toFixed(3)} Ω</p>
            <p><strong>Rct:</strong> {predictionResult.Rct.toFixed(3)} Ω</p>
            <p><strong>Degradation Feature:</strong> {predictionResult.degradation_feature.toFixed(5)}</p>
            <p><strong>Predicted RUL:</strong> {predictionResult.predicted_RUL.toFixed(2)} cycles</p>
            {batteryLifeResult && (
              <>
                <p><strong>Mileage Per Cycle:</strong> {batteryLifeResult.mileage_per_cycle} miles</p>
                <p><strong>Average Daily Mileage:</strong> {batteryLifeResult.average_daily_mileage} miles</p>
                <p><strong>Total Mileage:</strong> {batteryLifeResult.total_mileage.toFixed(2)} miles</p>
                <p><strong>Estimated Lifespan:</strong> {batteryLifeResult.estimated_lifespan_years.toFixed(2)} years</p>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {batteryLifeResult && (
        <TabsContent value="lifespan">
          <Card>
            <CardHeader>
              <CardTitle>Battery Health Chart</CardTitle>
              <CardDescription>Visual degradation over time</CardDescription>
            </CardHeader>
            <CardContent>
              <BatteryHealthChart rul={batteryLifeResult.predicted_RUL} />
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Based on {batteryLifeResult.mileage_per_cycle} miles per cycle and {batteryLifeResult.average_daily_mileage} miles/day.
            </CardFooter>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
}
