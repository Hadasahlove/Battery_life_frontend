import { Battery, Settings, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './mode-toggle';

export function DashboardHeader() {
  return (
    <header className="py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Battery className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">BatteryPredict</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-muted-foreground">
          Predict battery health and estimate remaining useful life using advanced analysis.
        </p>
      </div>
    </header>
  );
}