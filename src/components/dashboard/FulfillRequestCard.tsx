
import React from 'react';
import { FulfillRequestItem } from '@/types/dashboard';
import { Checkbox } from '@/components/ui/checkbox';
import { useDashboard } from '@/context/DashboardContext';

interface FulfillRequestCardProps {
  item: FulfillRequestItem;
}

const FulfillRequestCard: React.FC<FulfillRequestCardProps> = ({ item }) => {
  const { completeFulfillRequest } = useDashboard();

  const handleCompleteChange = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      completeFulfillRequest(item.id);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-dashboard-border animate-fade-in">
      <h4 className="text-base font-medium text-dashboard-heading mb-2">{item.name}</h4>
      <div className="text-sm text-dashboard-text mb-1">{item.requestText}</div>
      <div className="text-sm text-dashboard-text mb-3">{item.email}</div>
      
      <div className="flex items-center justify-end">
        <Checkbox 
          checked={item.isCompleted}
          onCheckedChange={handleCompleteChange}
        />
      </div>
    </div>
  );
};

export default FulfillRequestCard;
