
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanLaneProps {
  title: string;
  children: React.ReactNode;
  onAddItem?: () => void;
  showAddButton?: boolean;
}

const KanbanLane: React.FC<KanbanLaneProps> = ({ 
  title, 
  children, 
  onAddItem,
  showAddButton = false
}) => {
  return (
    <div className="flex flex-col min-w-[300px] w-full bg-dashboard-lightGray rounded-lg border border-dashboard-border">
      <div className="flex items-center justify-between p-4 border-b border-dashboard-border">
        <h3 className="text-lg font-semibold text-dashboard-heading">{title}</h3>
        {showAddButton && onAddItem && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onAddItem} 
            className="p-1 h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 h-[400px]">
        <div className="p-4 space-y-2">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};

export default KanbanLane;
