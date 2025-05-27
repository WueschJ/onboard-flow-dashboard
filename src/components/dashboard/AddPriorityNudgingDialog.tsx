
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboard } from '@/context/DashboardContext';
import { useToast } from '@/hooks/use-toast';

interface AddPriorityNudgingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddPriorityNudgingDialog: React.FC<AddPriorityNudgingDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  
  const { addPriorityNudgingItem, responsiblePersons, addCustomResponsiblePerson } = useDashboard();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    addPriorityNudgingItem({
      name: name.trim(),
      email: email.trim() || undefined,
    }, selectedPersonId || undefined);

    toast({
      title: "Success",
      description: "Priority nudging item added successfully",
      duration: 3000,
    });

    // Reset form
    setName('');
    setEmail('');
    setSelectedPersonId('');
    onOpenChange(false);
  };

  const handleAddCustomPerson = () => {
    const personName = prompt('Enter person name:');
    if (personName?.trim()) {
      const newPerson = addCustomResponsiblePerson(personName.trim());
      setSelectedPersonId(newPerson.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Priority Nudging Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible-person">Responsible Person</Label>
            <div className="flex gap-2">
              <Select value={selectedPersonId} onValueChange={setSelectedPersonId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {responsiblePersons.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" onClick={handleAddCustomPerson}>
                Add New
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPriorityNudgingDialog;
