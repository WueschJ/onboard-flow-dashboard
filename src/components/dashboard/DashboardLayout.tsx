
import React from 'react';
import { DashboardProvider } from '@/context/DashboardContext';
import KanbanBoard from './KanbanBoard';
import AdditionalSections from './AdditionalSections';
import ProgressTrackers from './ProgressTrackers';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const daysSinceStart = Math.floor((today.getTime() - startOfYear.getTime()) / 86400000);
  const weekNumber = Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7);

  return (
    <DashboardProvider>
      <div className="bg-dashboard-gray min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-dashboard-heading">Cliq Operations</h1>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span>{formattedDate}</span>
                  <span className="mx-2">•</span>
                  <span>Week {weekNumber}</span>
                </div>
              </div>
              
              <Button variant="outline" asChild size="sm" className="self-end">
                <Link to="/backend">
                  Backend View
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            
            <ProgressTrackers />
            <KanbanBoard />
            <AdditionalSections />
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;
