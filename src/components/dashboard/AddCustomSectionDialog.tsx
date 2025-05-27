
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDashboard } from '@/context/DashboardContext';

interface AddCustomSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCustomSectionDialog: React.FC<AddCustomSectionDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [responsiblePersonId, setResponsiblePersonId] = useState<string>('');
  
  const { addCustomSectionItem, responsiblePersons } = useDashboard();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name && note) {
      addCustomSectionItem({
        name,
        email: email || undefined,
        note
      }, responsiblePersonId || undefined);
      
      // Reset form
      setName('');
      setEmail('');
      setNote('');
      setResponsiblePersonId('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Custom Item</DialogTitle>
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
            <Label htmlFor="responsible">Responsible Person</Label>
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
          <div className="grid gap-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter note"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomSectionDialog;
