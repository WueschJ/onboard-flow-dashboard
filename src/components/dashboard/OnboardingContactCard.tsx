
import React from 'react';
import { OnboardingContact } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDashboard } from '@/context/DashboardContext';

interface OnboardingContactCardProps {
  contact: OnboardingContact;
}

const OnboardingContactCard: React.FC<OnboardingContactCardProps> = ({ contact }) => {
  const { responsiblePersons } = useDashboard();

  const handleResponsibleChange = (value: string) => {
    // Functionality to be implemented
    console.log('Assigning responsible:', value);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-dashboard-border animate-fade-in">
      <h4 className="text-base font-medium text-dashboard-heading mb-2">{contact.name}</h4>
      <div className="text-sm text-dashboard-text mb-1">{contact.company}</div>
      
      <div className="flex items-center gap-2 mb-3">
        <div className="text-sm text-dashboard-text">{contact.email}</div>
        <button 
          className="text-xs text-blue-500"
          onClick={() => navigator.clipboard.writeText(contact.email)}
        >
          Copy
        </button>
      </div>
      
      <div className="flex items-center justify-end mt-3">
        {contact.responsiblePerson ? (
          <Badge 
            style={{ backgroundColor: contact.responsiblePerson.color }}
            className="text-white"
          >
            {contact.responsiblePerson.name}
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

export default OnboardingContactCard;
