
import React from 'react';
import { RequestItem, ResponsiblePerson } from '@/types/dashboard';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDashboard } from '@/context/DashboardContext';

interface RequestCardProps {
  request: RequestItem;
  inProcess?: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, inProcess = false }) => {
  const { 
    assignResponsibleToRequest, 
    markRequestFulfilled,
    responsiblePersons 
  } = useDashboard();

  const handleResponsibleChange = (value: string) => {
    assignResponsibleToRequest(request.id, value);
  };

  const handleFulfillmentChange = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      markRequestFulfilled(request.id);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-dashboard-border animate-fade-in">
      <h4 className="text-base font-medium text-dashboard-heading mb-2">{request.requestText}</h4>
      <div className="text-sm text-dashboard-text mb-1">{request.personName}</div>
      <div className="text-sm text-dashboard-text mb-2">{request.email}</div>
      
      <div className="text-xs text-gray-500 mb-2 italic">{request.note}</div>
      
      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-gray-500">{request.date}</div>
        
        <div className="flex items-center gap-2">
          {inProcess && (
            <Checkbox 
              checked={request.isFulfilled}
              onCheckedChange={handleFulfillmentChange}
            />
          )}
          
          {request.responsiblePersons.length > 0 ? (
            <div className="flex gap-1">
              {request.responsiblePersons.map((person) => (
                <Badge 
                  key={person.id} 
                  style={{ backgroundColor: person.color }}
                  className="text-white"
                >
                  {person.name}
                </Badge>
              ))}
            </div>
          ) : (
            <Select onValueChange={handleResponsibleChange}>
              <SelectTrigger className="w-[120px] h-7 text-xs">
                <SelectValue placeholder="Assign" />
              </SelectTrigger>
              <SelectContent>
                {responsiblePersons.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
