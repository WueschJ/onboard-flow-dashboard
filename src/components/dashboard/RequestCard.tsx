
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
import { PlusCircle, X, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
    removeResponsibleFromRequest,
    updateRequest,
    deleteRequest
  } = useDashboard();
  
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedRequest, setEditedRequest] = useState<RequestItem>(request);

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

  const openEditDialog = () => {
    setEditedRequest({...request});
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    updateRequest(editedRequest);
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteRequest(request.id);
    setIsDeleteDialogOpen(false);
  };

  // Can assign another person if there's less than 2 responsible persons
  const canAssignAnother = request.responsiblePersons.length < 2;

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="bg-white p-4 rounded-md shadow-sm border border-dashboard-border animate-fade-in">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-medium text-dashboard-heading">{request.requestText}</h4>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
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
            <DialogTitle>Edit Request</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="request-text" className="text-right text-sm font-medium">
                Request
              </label>
              <Input
                id="request-text"
                value={editedRequest.requestText}
                onChange={(e) => setEditedRequest({...editedRequest, requestText: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="person-name" className="text-right text-sm font-medium">
                Name
              </label>
              <Input
                id="person-name"
                value={editedRequest.personName}
                onChange={(e) => setEditedRequest({...editedRequest, personName: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                value={editedRequest.email}
                onChange={(e) => setEditedRequest({...editedRequest, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="note" className="text-right text-sm font-medium">
                Note
              </label>
              <Input
                id="note"
                value={editedRequest.note}
                onChange={(e) => setEditedRequest({...editedRequest, note: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right text-sm font-medium">
                Date
              </label>
              <Input
                id="date"
                type="date"
                value={editedRequest.date}
                onChange={(e) => setEditedRequest({...editedRequest, date: e.target.value})}
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
            <DialogTitle>Delete Request</DialogTitle>
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

export default RequestCard;
