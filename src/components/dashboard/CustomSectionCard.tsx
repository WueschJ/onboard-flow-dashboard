
import React, { useState } from 'react';
import { CustomSectionItem } from '@/types/dashboard';
import { useDashboard } from '@/context/DashboardContext';
import { Copy, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CustomSectionCardProps {
  item: CustomSectionItem;
}

const CustomSectionCard: React.FC<CustomSectionCardProps> = ({ item }) => {
  const { updateCustomSectionItem, deleteCustomSectionItem, responsiblePersons } = useDashboard();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedItem, setEditedItem] = useState<CustomSectionItem>(item);

  const copyToClipboard = () => {
    if (item.email) {
      navigator.clipboard.writeText(item.email).then(
        () => {
          toast({
            title: "Email copied",
            description: `${item.email} copied to clipboard`,
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
    }
  };

  const openEditDialog = () => {
    setEditedItem({...item});
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    updateCustomSectionItem(editedItem);
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteCustomSectionItem(item.id);
    setIsDeleteDialogOpen(false);
  };

  const handleResponsiblePersonChange = (value: string) => {
    const person = responsiblePersons.find(p => p.id === value);
    setEditedItem({...editedItem, responsiblePerson: person});
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="bg-white p-4 rounded-md shadow-sm border border-dashboard-border animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-base font-medium text-dashboard-heading">{item.name}</h4>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-2 mb-3">
              {item.responsiblePerson && (
                <Badge 
                  style={{ backgroundColor: item.responsiblePerson.color }}
                  className="text-white"
                >
                  {item.responsiblePerson.name}
                </Badge>
              )}
              
              {item.email && (
                <Badge 
                  variant="outline" 
                  className="bg-dashboard-lightBlue text-dashboard-blue border-dashboard-blue/20 cursor-pointer hover:bg-dashboard-blue/10 transition-colors"
                  onClick={copyToClipboard}
                >
                  <span className="truncate max-w-[180px]">{item.email}</span>
                  <Copy className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
            
            {item.note && (
              <div className="text-xs text-gray-500 italic mt-2">{item.note}</div>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={openEditDialog}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Item
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Item
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Custom Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editedItem.name}
                onChange={(e) => setEditedItem({...editedItem, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="responsible">Responsible Person</Label>
              <Select value={editedItem.responsiblePerson?.id || ''} onValueChange={handleResponsiblePersonChange}>
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
                value={editedItem.email || ''}
                onChange={(e) => setEditedItem({...editedItem, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                value={editedItem.note}
                onChange={(e) => setEditedItem({...editedItem, note: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Custom Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomSectionCard;
