
import React, { useState } from 'react';
import { FulfillRequestItem } from '@/types/dashboard';
import { Checkbox } from '@/components/ui/checkbox';
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

interface FulfillRequestCardProps {
  item: FulfillRequestItem;
}

const FulfillRequestCard: React.FC<FulfillRequestCardProps> = ({ item }) => {
  const { completeFulfillRequest, updateFulfillRequest, deleteFulfillRequest } = useDashboard();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedItem, setEditedItem] = useState<FulfillRequestItem>(item);

  const handleCompleteChange = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      completeFulfillRequest(item.id);
    }
  };

  const copyToClipboard = () => {
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
  };

  const openEditDialog = () => {
    setEditedItem({...item});
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    updateFulfillRequest(editedItem);
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteFulfillRequest(item.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="bg-white p-4 rounded-md shadow-sm border border-dashboard-border animate-fade-in">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-medium text-dashboard-heading mb-2">{item.name}</h4>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            <div className="text-sm text-dashboard-text mb-2">{item.requestText}</div>
            
            <div className="flex items-center gap-2 mb-3">
              <Badge 
                variant="outline" 
                className="bg-dashboard-lightBlue text-dashboard-blue border-dashboard-blue/20 cursor-pointer hover:bg-dashboard-blue/10 transition-colors"
                onClick={copyToClipboard}
              >
                <span className="truncate max-w-[180px]">{item.email}</span>
                <Copy className="h-3 w-3 ml-1" />
              </Badge>
            </div>
            
            <div className="flex items-center justify-end">
              <Checkbox 
                checked={item.isCompleted}
                onCheckedChange={handleCompleteChange}
              />
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={openEditDialog}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Request
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Request
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Fulfill Request</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={editedItem.name}
                onChange={(e) => setEditedItem({...editedItem, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="request-text" className="text-right text-sm font-medium">
                Request
              </label>
              <Input
                id="request-text"
                value={editedItem.requestText}
                onChange={(e) => setEditedItem({...editedItem, requestText: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                value={editedItem.email}
                onChange={(e) => setEditedItem({...editedItem, email: e.target.value})}
                className="col-span-3"
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
            <DialogTitle>Delete Fulfill Request</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this request? This action cannot be undone.</p>
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

export default FulfillRequestCard;
