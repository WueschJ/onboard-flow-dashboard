
import React from 'react';
import { DashboardProvider } from '@/context/DashboardContext';
import KanbanBoard from './KanbanBoard';
import AdditionalSections from './AdditionalSections';

const DashboardLayout: React.FC = () => {
  return (
    <DashboardProvider>
      <div className="bg-dashboard-gray min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-dashboard-heading mb-6">Task Dashboard</h1>
            <KanbanBoard />
            <AdditionalSections />
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;
