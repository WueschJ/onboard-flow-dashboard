
import React from 'react';
import { OnboardingContact } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDashboard } from '@/context/DashboardContext';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingContactCardProps {
  contact: OnboardingContact;
}

const OnboardingContactCard: React.FC<OnboardingContactCardProps> = ({ contact }) => {
  const { responsiblePersons, completeOnboardingContact } = useDashboard();
  const { toast } = useToast();

  const handleResponsibleChange = (value: string) => {
    // This is currently a placeholder, we'll implement this in the future
    console.log('Assigning responsible:', value);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(contact.email).then(
      () => {
        toast({
          title: "Email copied",
          description: `${contact.email} copied to clipboard`,
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
  
  const handleCompleteChange = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      completeOnboardingContact(contact.id);
    }
  };

  return (
    <div className="bg-white p-1.5 rounded-md shadow-sm border border-dashboard-border animate-fade-in text-xs">
      <h4 className="text-xs font-medium text-dashboard-heading mb-0.5 truncate" title={contact.name}>{contact.name}</h4>
      <div className="text-[0.65rem] text-dashboard-text mb-0.5 truncate" title={contact.company}>{contact.company}</div>
      
      <div className="flex items-center mb-0.5 gap-0.5">
        <div className="text-[0.65rem] text-dashboard-text overflow-hidden text-ellipsis truncate max-w-[70px]" title={contact.email}>{contact.email}</div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-4 w-4 p-0" 
          onClick={copyToClipboard}
          title="Copy email"
        >
          <Copy className="h-2 w-2" />
        </Button>
      </div>
      
      <div className="flex items-center justify-between mt-0.5">
        <div className="flex items-center gap-0.5">
          <Checkbox 
            id={`complete-${contact.id}`}
            checked={contact.isCompleted}
            onCheckedChange={handleCompleteChange}
            className="h-2.5 w-2.5"
          />
          <label htmlFor={`complete-${contact.id}`} className="text-[0.65rem] text-gray-500">
            Done
          </label>
        </div>
        
        {contact.responsiblePerson ? (
          <Badge 
            style={{ backgroundColor: contact.responsiblePerson.color }}
            className="text-white text-[0.6rem] py-0 px-1 h-3.5"
          >
            {contact.responsiblePerson.name}
          </Badge>
        ) : (
          <Select onValueChange={handleResponsibleChange}>
            <SelectTrigger className="w-[70px] h-4 text-[0.65rem]">
              <SelectValue placeholder="Assign" />
            </SelectTrigger>
            <SelectContent>
              {responsiblePersons.map((person) => (
                <SelectItem key={person.id} value={person.id} className="text-[0.65rem]">
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
