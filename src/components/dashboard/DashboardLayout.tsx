
import React from 'react';
import KanbanBoard from './KanbanBoard';
import AdditionalSections from './AdditionalSections';
import NewsSection from './NewsSection';
import PriorityNudgingSection from './PriorityNudgingSection';
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
    <div className="bg-gradient-to-b from-white to-dashboard-gray min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-dashboard-border">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-dashboard-heading bg-gradient-to-r from-dashboard-blue to-dashboard-purple bg-clip-text text-transparent">
                Cliq Operations
              </h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span>{formattedDate}</span>
                <span className="mx-2 text-dashboard-blue">•</span>
                <span className="text-dashboard-purple font-medium">Week {weekNumber}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 self-end">
              <Button 
                variant="outline" 
                asChild 
                size="sm" 
                className="hover:bg-dashboard-lightBlue hover:text-dashboard-blue border-dashboard-border"
              >
                <Link to="/tables">
                  Tables View
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          
          <ProgressTrackers />
          <KanbanBoard />
          <AdditionalSections />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <NewsSection />
            <PriorityNudgingSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
