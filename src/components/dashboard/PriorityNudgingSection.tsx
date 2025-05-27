
import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import KanbanLane from './KanbanLane';
import PriorityNudgingCard from './PriorityNudgingCard';
import AddPriorityNudgingDialog from './AddPriorityNudgingDialog';

const PriorityNudgingSection: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { priorityNudgingItems } = useDashboard();
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-dashboard-heading">Priority Nudging</h2>
      
      <KanbanLane 
        title="Priority Nudging" 
        showAddButton 
        onAddItem={() => setDialogOpen(true)}
      >
        {priorityNudgingItems.map((item) => (
          <PriorityNudgingCard key={item.id} item={item} />
        ))}
      </KanbanLane>
      
      <AddPriorityNudgingDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default PriorityNudgingSection;
