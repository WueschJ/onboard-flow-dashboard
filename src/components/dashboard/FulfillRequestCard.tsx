
import React from 'react';
import { FulfillRequestItem } from '@/types/dashboard';
import { Checkbox } from '@/components/ui/checkbox';
import { useDashboard } from '@/context/DashboardContext';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FulfillRequestCardProps {
  item: FulfillRequestItem;
}

const FulfillRequestCard: React.FC<FulfillRequestCardProps> = ({ item }) => {
  const { completeFulfillRequest } = useDashboard();
  const { toast } = useToast();

  const handleCompleteChange = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      completeFulfillRequest(item.id);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(item.email).then(
      () => {
        toast({
          title: "Email copied",
          description: `${item.email} copied to clipboard`,
          duration: 3000,
        });
      },
      () => {
        toast({
          title: "Failed to copy",
          description: "Please try again",
          variant: "destructive",
          duration: 3000,
        });
      }
    );
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-dashboard-border animate-fade-in">
      <h4 className="text-base font-medium text-dashboard-heading mb-2">{item.name}</h4>
      <div className="text-sm text-dashboard-text mb-1">{item.requestText}</div>
      
      <div className="flex items-center mb-3 gap-1">
        <div className="text-sm text-dashboard-text overflow-hidden text-ellipsis">{item.email}</div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={copyToClipboard}
          title="Copy email"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
      
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
