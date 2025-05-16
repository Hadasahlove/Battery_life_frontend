import { Battery, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './mode-toggle';

export function DashboardHeader() {
  return (
    <header className="py-6 md:py-8 border-b">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Battery className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight leading-none">
            BatteryPredict
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <ModeToggle />
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground max-w-xl">
        Predict electric vehicle battery health and estimate remaining useful life using internal resistance metrics.
      </p>
    </header>
  );
}
