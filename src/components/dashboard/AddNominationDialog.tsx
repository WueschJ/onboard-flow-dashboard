
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDashboard } from '@/context/DashboardContext';

interface AddNominationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddNominationDialog: React.FC<AddNominationDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [responsiblePersonId, setResponsiblePersonId] = useState<string>('');
  
  const { addNomination, responsiblePersons } = useDashboard();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name && company) {
      addNomination({
        name,
        company,
        email: '' // Keep email as empty string to match the type
      }, responsiblePersonId || undefined);
      
      // Reset form
      setName('');
      setCompany('');
      setResponsiblePersonId('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Nomination</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter company"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="responsible">Responsible Person (Optional)</Label>
            <Select value={responsiblePersonId} onValueChange={setResponsiblePersonId}>
              <SelectTrigger>
                <SelectValue placeholder="Select responsible person" />
              </SelectTrigger>
              <SelectContent>
                {responsiblePersons.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Nomination</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNominationDialog;
