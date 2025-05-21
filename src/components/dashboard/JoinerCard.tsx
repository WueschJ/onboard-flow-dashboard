
import React, { useState } from 'react';
import { JoinerItem } from '@/types/dashboard';
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
import { format, addDays, parseISO, isAfter } from 'date-fns';
import { Calendar, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JoinerCardProps {
  joiner: JoinerItem;
}

const JoinerCard: React.FC<JoinerCardProps> = ({ joiner }) => {
  const {
    assignResponsibleToJoiner,
    toggleJoinerInAppNotification,
    toggleJoinerEmailNotification,
    responsiblePersons,
    updateJoiner,
    deleteJoiner
  } = useDashboard();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedJoiner, setEditedJoiner] = useState<JoinerItem>(joiner);

  const handleResponsibleChange = (value: string) => {
    assignResponsibleToJoiner(joiner.id, value);
  };
  
  const creationDate = parseISO(joiner.creationDate);
  const emailThresholdDate = addDays(creationDate, 3);
  const canSendEmail = isAfter(new Date(), emailThresholdDate);
  const formattedCreationDate = format(creationDate, 'MMM d, yyyy');

  const openEditDialog = () => {
    setEditedJoiner({...joiner});
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    updateJoiner(editedJoiner);
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteJoiner(joiner.id);
    setIsDeleteDialogOpen(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(joiner.email);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="bg-white p-4 rounded-md shadow-sm border border-dashboard-border animate-fade-in">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-medium text-dashboard-heading">{joiner.name}</h4>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            <div className="text-sm text-dashboard-text mb-1">{joiner.company}</div>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="text-sm text-dashboard-text">{joiner.email}</div>
              <button 
                className="text-xs text-blue-500"
                onClick={copyToClipboard}
              >
                Copy
              </button>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>Added: {formattedCreationDate}</span>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Checkbox 
                    id={`inapp-${joiner.id}`}
                    checked={joiner.isInAppNotificationSent}
                    onCheckedChange={() => toggleJoinerInAppNotification(joiner.id)}
                  />
                  <label htmlFor={`inapp-${joiner.id}`} className="text-xs text-gray-500">
                    In-app
                  </label>
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <Checkbox 
                          id={`email-${joiner.id}`}
                          checked={joiner.isEmailNotificationSent}
                          onCheckedChange={() => toggleJoinerEmailNotification(joiner.id)}
                          disabled={!canSendEmail}
                          className={!canSendEmail ? "opacity-50 cursor-not-allowed" : ""}
                        />
                        <label htmlFor={`email-${joiner.id}`} className={`text-xs ${!canSendEmail ? "text-gray-400" : "text-gray-500"}`}>
                          Email
                        </label>
                      </div>
                    </TooltipTrigger>
                    {!canSendEmail && (
                      <TooltipContent>
                        <p>Email can be sent after {format(emailThresholdDate, 'MMM d, yyyy')}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {joiner.responsiblePerson ? (
                <Badge 
                  style={{ backgroundColor: joiner.responsiblePerson.color }}
                  className="text-white"
                >
                  {joiner.responsiblePerson.name}
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
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={openEditDialog}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Joiner
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Joiner
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
            <DialogTitle>Delete Joiner</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this joiner? This action cannot be undone.</p>
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

export default JoinerCard;
