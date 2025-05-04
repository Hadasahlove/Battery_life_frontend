"use client";

import { useState } from 'react';
import { PredictionForm } from './prediction-form';
import { BatteryLifeForm } from './battery-life-form';
import { ResultsDisplay } from './results-display';
import { DashboardHeader } from './dashboard-header';
import { AnimatePresence, motion } from 'framer-motion';
import { Battery } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types for our prediction data
export interface PredictionResult {
  status: string;
  message: string;
  Re: number;
  Rct: number;
  degradation_feature: number;
  predicted_RUL: number;
}

export interface BatteryLifeResult {
  status: string;
  message: string;
  predicted_RUL: number;
  mileage_per_cycle: number;
  average_daily_mileage: number;
  total_mileage: number;
  estimated_lifespan_years: number;
}

export function BatteryPredictionDashboard() {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [batteryLifeResult, setBatteryLifeResult] = useState<BatteryLifeResult | null>(null);
  const [activeStep, setActiveStep] = useState<'predict' | 'lifespan'>('predict');
  const { toast } = useToast();

  const handlePredictionSubmit = async (re: number, rct: number) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Re: re, Rct: rct }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setPredictionResult(data);
        setActiveStep('lifespan');
        toast({
          title: "Prediction Successful",
          description: "Battery RUL has been calculated successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Prediction Failed",
          description: data.message || "Failed to predict battery RUL.",
        });
      }
    } catch (error) {
      console.error('Error predicting battery life:', error);
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: "Network error or server unavailable.",
      });
      
      // For demo purposes - simulate a successful response
      const simulatedResult = {
        status: 'success',
        message: 'RUL computed using degradation formula (simulated).',
        Re: re,
        Rct: rct,
        degradation_feature: Math.round(re * rct * 100000) / 100000,
        predicted_RUL: Math.round(1000 / (re * rct + 1) * 100) / 100
      };
      setPredictionResult(simulatedResult);
      setActiveStep('lifespan');
    }
  };

  const handleBatteryLifeSubmit = async (mileagePerCycle: number, averageDailyMileage: number) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:5000/api/battery-life-years', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mileage_per_cycle: mileagePerCycle,
          average_daily_mileage: averageDailyMileage
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setBatteryLifeResult(data);
        toast({
          title: "Estimation Successful",
          description: "Battery lifespan has been estimated successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Estimation Failed",
          description: data.message || "Failed to estimate battery lifespan.",
        });
      }
    } catch (error) {
      console.error('Error estimating battery lifespan:', error);
      toast({
        variant: "destructive",
        title: "Estimation Failed",
        description: "Network error or server unavailable.",
      });
      
      // For demo purposes - simulate a successful response
      if (predictionResult) {
        const simulatedResult = {
          status: 'success',
          message: 'Battery lifespan estimated (simulated).',
          predicted_RUL: predictionResult.predicted_RUL,
          mileage_per_cycle: mileagePerCycle,
          average_daily_mileage: averageDailyMileage,
          total_mileage: Math.round(predictionResult.predicted_RUL * mileagePerCycle * 100) / 100,
          estimated_lifespan_years: Math.round(
            (predictionResult.predicted_RUL * mileagePerCycle) / 
            (averageDailyMileage * 365) * 100
          ) / 100
        };
        setBatteryLifeResult(simulatedResult);
      }
    }
  };

  const resetPrediction = () => {
    setPredictionResult(null);
    setBatteryLifeResult(null);
    setActiveStep('predict');
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <DashboardHeader />
      
      <div className="grid gap-8 mt-8 md:grid-cols-2 lg:grid-cols-3">
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="sticky top-8">
            <div className="flex items-center p-4 mb-4 overflow-hidden border rounded-lg bg-muted/40">
              <Battery className="w-6 h-6 mr-2 text-primary" />
              <h2 className="text-xl font-semibold">
                {activeStep === 'predict' ? 'Battery Prediction' : 'Battery Lifespan'}
              </h2>
            </div>
            
            <AnimatePresence mode="wait">
              {activeStep === 'predict' ? (
                <motion.div
                  key="prediction-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PredictionForm onSubmit={handlePredictionSubmit} />
                </motion.div>
              ) : (
                <motion.div
                  key="battery-life-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BatteryLifeForm 
                    onSubmit={handleBatteryLifeSubmit} 
                    onBack={() => setActiveStep('predict')}
                    predictedRUL={predictionResult?.predicted_RUL || 0}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ResultsDisplay 
            predictionResult={predictionResult} 
            batteryLifeResult={batteryLifeResult}
            resetPrediction={resetPrediction}
          />
        </motion.div>
      </div>
    </div>
  );
}