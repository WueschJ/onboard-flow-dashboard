
import React from 'react';
import { JoinerItem } from '@/types/dashboard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JoinerEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editedJoiner: JoinerItem;
  setEditedJoiner: React.Dispatch<React.SetStateAction<JoinerItem>>;
  onSave: () => void;
}

const JoinerEditDialog: React.FC<JoinerEditDialogProps> = ({
  isOpen,
  onOpenChange,
  editedJoiner,
  setEditedJoiner,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Joiner</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="joiner-name" className="text-right text-sm font-medium">
              Name
            </label>
            <Input
              id="joiner-name"
              value={editedJoiner.name}
              onChange={(e) => setEditedJoiner({...editedJoiner, name: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="company" className="text-right text-sm font-medium">
              Company
            </label>
            <Input
              id="company"
              value={editedJoiner.company}
              onChange={(e) => setEditedJoiner({...editedJoiner, company: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="joiner-email" className="text-right text-sm font-medium">
              Email
            </label>
            <Input
              id="joiner-email"
              value={editedJoiner.email}
              onChange={(e) => setEditedJoiner({...editedJoiner, email: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="creation-date" className="text-right text-sm font-medium">
              Join Date
            </label>
            <Input
              id="creation-date"
              type="date"
              value={editedJoiner.creationDate.split('T')[0]}
              onChange={(e) => setEditedJoiner({...editedJoiner, creationDate: `${e.target.value}T00:00:00.000Z`})}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinerEditDialog;
