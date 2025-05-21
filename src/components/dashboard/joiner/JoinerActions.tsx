
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ResponsiblePerson } from '@/types/dashboard';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { format, addDays, parseISO, isAfter } from 'date-fns';
import { Smartphone, Mail } from 'lucide-react';

interface JoinerActionsProps {
  id: string;
  isInAppNotificationSent: boolean;
  isEmailNotificationSent: boolean;
  creationDate: string;
  responsiblePerson?: ResponsiblePerson;
  responsiblePersons: ResponsiblePerson[];
  toggleJoinerInAppNotification: (joinerId: string) => void;
  toggleJoinerEmailNotification: (joinerId: string) => void;
  assignResponsibleToJoiner: (joinerId: string, responsiblePersonId: string) => void;
}

const JoinerActions: React.FC<JoinerActionsProps> = ({
  id,
  isInAppNotificationSent,
  isEmailNotificationSent,
  creationDate,
  responsiblePerson,
  responsiblePersons,
  toggleJoinerInAppNotification,
  toggleJoinerEmailNotification,
  assignResponsibleToJoiner
}) => {
  const handleResponsibleChange = (value: string) => {
    assignResponsibleToJoiner(id, value);
  };
  
  const parsedCreationDate = parseISO(creationDate);
  const emailThresholdDate = addDays(parsedCreationDate, 3);
  const canSendEmail = isAfter(new Date(), emailThresholdDate);

  return (
    <div className="flex items-center justify-between mt-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Checkbox 
            id={`inapp-${id}`}
            checked={isInAppNotificationSent}
            onCheckedChange={() => toggleJoinerInAppNotification(id)}
          />
          <label htmlFor={`inapp-${id}`} className="flex items-center text-gray-500">
            <Smartphone className="h-3.5 w-3.5" />
          </label>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <Checkbox 
                  id={`email-${id}`}
                  checked={isEmailNotificationSent}
                  onCheckedChange={() => toggleJoinerEmailNotification(id)}
                  disabled={!canSendEmail}
                  className={!canSendEmail ? "opacity-50 cursor-not-allowed" : ""}
                />
                <label htmlFor={`email-${id}`} className={`flex items-center ${!canSendEmail ? "text-gray-400" : "text-gray-500"}`}>
                  <Mail className="h-3.5 w-3.5" />
                </label>
              </div>
            </TooltipTrigger>
            {!canSendEmail && (
              <TooltipContent>
                <p>Email can be sent after {format(emailThresholdDate, 'MMM d, yyyy')}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {responsiblePerson ? (
        <Badge 
          style={{ backgroundColor: responsiblePerson.color }}
          className="text-white"
        >
          {responsiblePerson.name}
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
  );
};

export default JoinerActions;
