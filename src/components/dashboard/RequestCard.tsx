
import React, { useState } from 'react';
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
import { PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RequestCardProps {
  request: RequestItem;
  inProcess?: boolean;
  isMotiusAsk?: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({ 
  request, 
  inProcess = false,
  isMotiusAsk = false
}) => {
  const { 
    assignResponsibleToRequest, 
    markRequestFulfilled,
    responsiblePersons,
    addCustomResponsiblePerson,
    removeResponsibleFromRequest
  } = useDashboard();
  
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState("");

  const handleResponsibleChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomInput(true);
      return;
    }
    
    assignResponsibleToRequest(request.id, value, isMotiusAsk);
  };

  const handleAddCustomPerson = () => {
    if (customName.trim()) {
      const newPerson = addCustomResponsiblePerson(customName);
      assignResponsibleToRequest(request.id, newPerson.id, isMotiusAsk);
      setCustomName("");
      setShowCustomInput(false);
    }
  };

  const handleFulfillmentChange = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      markRequestFulfilled(request.id);
    }
  };

  const handleRemovePerson = (personId: string) => {
    removeResponsibleFromRequest(request.id, personId, isMotiusAsk);
  };

  // Can assign another person if there's less than 2 responsible persons
  const canAssignAnother = request.responsiblePersons.length < 2;

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
          
          <div className="flex flex-wrap gap-1 items-center">
            {request.responsiblePersons.map((person) => (
              <div key={person.id} className="flex items-center">
                <Badge 
                  style={{ backgroundColor: person.color }}
                  className="text-white flex items-center gap-1"
                >
                  {person.name}
                  <button 
                    onClick={() => handleRemovePerson(person.id)}
                    className="ml-1 hover:bg-white/20 rounded-full p-[2px]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </div>
            ))}
            
            {canAssignAnother && !showCustomInput && (
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
                  <SelectItem value="custom">Custom Person...</SelectItem>
                </SelectContent>
              </Select>
            )}

            {showCustomInput && (
              <div className="flex items-center gap-1">
                <Input 
                  className="h-7 w-24 text-xs"
                  placeholder="Name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7"
                  onClick={handleAddCustomPerson}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7"
                  onClick={() => setShowCustomInput(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
