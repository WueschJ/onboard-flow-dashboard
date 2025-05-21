
import React from 'react';
import { JoinerItem } from '@/types/dashboard';
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

interface JoinerCardProps {
  joiner: JoinerItem;
}

const JoinerCard: React.FC<JoinerCardProps> = ({ joiner }) => {
  const {
    assignResponsibleToJoiner,
    toggleJoinerInAppNotification,
    toggleJoinerEmailNotification,
    responsiblePersons
  } = useDashboard();

  const handleResponsibleChange = (value: string) => {
    assignResponsibleToJoiner(joiner.id, value);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-dashboard-border animate-fade-in">
      <h4 className="text-base font-medium text-dashboard-heading mb-2">{joiner.name}</h4>
      <div className="text-sm text-dashboard-text mb-1">{joiner.company}</div>
      
      <div className="flex items-center gap-2 mb-3">
        <div className="text-sm text-dashboard-text">{joiner.email}</div>
        <button 
          className="text-xs text-blue-500"
          onClick={() => navigator.clipboard.writeText(joiner.email)}
        >
          Copy
        </button>
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Checkbox 
              id={`inapp-${joiner.id}`}
              checked={joiner.isInAppNotificationSent}
              onCheckedChange={() => toggleJoinerInAppNotification(joiner.id)}
            />
            <label htmlFor={`inapp-${joiner.id}`} className="text-xs text-gray-500">
              In-app
            </label>
          </div>
          
          <div className="flex items-center gap-1">
            <Checkbox 
              id={`email-${joiner.id}`}
              checked={joiner.isEmailNotificationSent}
              onCheckedChange={() => toggleJoinerEmailNotification(joiner.id)}
            />
            <label htmlFor={`email-${joiner.id}`} className="text-xs text-gray-500">
              Email
            </label>
          </div>
        </div>
        
        {joiner.responsiblePerson ? (
          <Badge 
            style={{ backgroundColor: joiner.responsiblePerson.color }}
            className="text-white"
          >
            {joiner.responsiblePerson.name}
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
  );
};

export default JoinerCard;
