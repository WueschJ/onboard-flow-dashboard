
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
    <div className="bg-white p-4 rounded-md shadow-sm border border-dashboard-border animate-fade-in">
      <h4 className="text-base font-medium text-dashboard-heading mb-2">{contact.name}</h4>
      <div className="text-sm text-dashboard-text mb-1">{contact.company}</div>
      
      <div className="flex items-center mb-3 gap-1">
        <div className="text-sm text-dashboard-text overflow-hidden text-ellipsis">{contact.email}</div>
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
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1">
          <Checkbox 
            id={`complete-${contact.id}`}
            checked={contact.isCompleted}
            onCheckedChange={handleCompleteChange}
          />
          <label htmlFor={`complete-${contact.id}`} className="text-xs text-gray-500">
            Complete
          </label>
        </div>
        
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
