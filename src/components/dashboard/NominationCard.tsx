
import React from 'react';
import { NominationItem } from '@/types/dashboard';
import { useDashboard } from '@/context/DashboardContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NominationCardProps {
  nomination: NominationItem;
}

const NominationCard: React.FC<NominationCardProps> = ({ nomination }) => {
  const { 
    responsiblePersons, 
    assignResponsibleToNomination,
    completeNomination
  } = useDashboard();

  const handleResponsibleChange = (value: string) => {
    assignResponsibleToNomination(nomination.id, value);
  };
  
  const handleCompleteChange = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      completeNomination(nomination.id);
    }
  };

  return (
    <Card className="p-3 border border-dashboard-border hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="space-y-2">
          <div>
            <h4 className="font-medium text-dashboard-heading">{nomination.name}</h4>
            <p className="text-sm text-gray-600">{nomination.company}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Checkbox 
                id={`complete-${nomination.id}`}
                checked={nomination.isCompleted}
                onCheckedChange={handleCompleteChange}
                className="h-3.5 w-3.5"
              />
              <label htmlFor={`complete-${nomination.id}`} className="text-xs text-gray-500">
                Done
              </label>
            </div>
            
            {nomination.responsiblePerson ? (
              <Badge 
                style={{ backgroundColor: nomination.responsiblePerson.color }}
                className="text-white"
              >
                {nomination.responsiblePerson.name}
              </Badge>
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
      </CardContent>
    </Card>
  );
};

export default NominationCard;
