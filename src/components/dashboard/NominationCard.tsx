
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
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { format, addDays, parseISO, isAfter } from 'date-fns';
import { Smartphone, Mail } from 'lucide-react';

interface NominationCardProps {
  nomination: NominationItem;
}

const NominationCard: React.FC<NominationCardProps> = ({ nomination }) => {
  const { 
    responsiblePersons, 
    assignResponsibleToNomination,
    toggleNominationInAppNotification,
    toggleNominationEmailNotification
  } = useDashboard();

  const handleResponsibleChange = (value: string) => {
    assignResponsibleToNomination(nomination.id, value);
  };
  
  const parsedCreationDate = parseISO(nomination.creationDate);
  const emailThresholdDate = addDays(parsedCreationDate, 3);
  const canSendEmail = isAfter(new Date(), emailThresholdDate);

  return (
    <Card className="p-3 border border-dashboard-border hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="space-y-2">
          <div>
            <h4 className="font-medium text-dashboard-heading">{nomination.name}</h4>
            <p className="text-sm text-gray-600">{nomination.company}</p>
            <p className="text-xs text-gray-500">{nomination.email}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Checkbox 
                  id={`inapp-${nomination.id}`}
                  checked={nomination.isInAppNotificationSent}
                  onCheckedChange={() => toggleNominationInAppNotification(nomination.id)}
                />
                <label htmlFor={`inapp-${nomination.id}`} className="flex items-center text-gray-500">
                  <Smartphone className="h-3.5 w-3.5" />
                </label>
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Checkbox 
                        id={`email-${nomination.id}`}
                        checked={nomination.isEmailNotificationSent}
                        onCheckedChange={() => toggleNominationEmailNotification(nomination.id)}
                        disabled={!canSendEmail}
                        className={!canSendEmail ? "opacity-50 cursor-not-allowed" : ""}
                      />
                      <label htmlFor={`email-${nomination.id}`} className={`flex items-center ${!canSendEmail ? "text-gray-400" : "text-gray-500"}`}>
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
