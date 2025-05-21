
import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreHorizontal, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RequestItem, JoinerItem } from '@/types/dashboard';

const Tables: React.FC = () => {
  const { 
    fulfilledRequests, 
    recentJoiners, 
    updateFulfilledRequest, 
    deleteFulfilledRequest, 
    updateRecentJoiner,
    deleteRecentJoiner,
    returnRequestToProcess,
    returnJoinerToBoard
  } = useDashboard();

  const [editingRequest, setEditingRequest] = useState<RequestItem | null>(null);
  const [editingJoiner, setEditingJoiner] = useState<JoinerItem | null>(null);
  const [isDeleteRequestDialogOpen, setIsDeleteRequestDialogOpen] = useState(false);
  const [isDeleteJoinerDialogOpen, setIsDeleteJoinerDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string>('');

  // Format the date from ISO string
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handleEditRequest = (request: RequestItem) => {
    setEditingRequest({...request});
  };

  const handleSaveRequestEdit = () => {
    if (editingRequest) {
      updateFulfilledRequest(editingRequest);
      setEditingRequest(null);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setIsDeleteRequestDialogOpen(true);
  };

  const confirmDeleteRequest = () => {
    deleteFulfilledRequest(itemToDelete);
    setIsDeleteRequestDialogOpen(false);
  };

  const handleEditJoiner = (joiner: JoinerItem) => {
    setEditingJoiner({...joiner});
  };

  const handleSaveJoinerEdit = () => {
    if (editingJoiner) {
      updateRecentJoiner(editingJoiner);
      setEditingJoiner(null);
    }
  };

  const handleDeleteJoiner = (id: string) => {
    setItemToDelete(id);
    setIsDeleteJoinerDialogOpen(true);
  };

  const confirmDeleteJoiner = () => {
    deleteRecentJoiner(itemToDelete);
    setIsDeleteJoinerDialogOpen(false);
  };

  return (
    <div className="bg-dashboard-gray min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-dashboard-heading bg-gradient-to-r from-dashboard-blue to-dashboard-purple bg-clip-text text-transparent">
            Tables View
          </h1>
          <Button variant="outline" asChild className="hover:bg-dashboard-lightBlue hover:text-dashboard-blue border-dashboard-border">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Link>
          </Button>
        </div>

        <div className="space-y-8">
          {/* Requests Granted Table */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-dashboard-border">
            <h2 className="text-xl font-semibold mb-4 text-dashboard-heading">Requests Granted</h2>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead>Person</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Responsible Persons</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fulfilledRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No fulfilled requests yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    fulfilledRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.requestText}</TableCell>
                        <TableCell>{request.personName}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={request.note}>
                          {request.note}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {request.responsiblePersons.map((person) => (
                              <Badge 
                                key={person.id} 
                                style={{ backgroundColor: person.color }}
                                className="text-white"
                              >
                                {person.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditRequest(request)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteRequest(request.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => returnRequestToProcess(request.id)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Return to Board
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Recent Joiners Table */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-dashboard-border">
            <h2 className="text-xl font-semibold mb-4 text-dashboard-heading">Recent Joiners</h2>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Responsible Person</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentJoiners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No recent joiners yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentJoiners.map((joiner) => (
                      <TableRow key={joiner.id}>
                        <TableCell className="font-medium">{joiner.name}</TableCell>
                        <TableCell>{joiner.company}</TableCell>
                        <TableCell>{joiner.email}</TableCell>
                        <TableCell>{formatDate(joiner.creationDate)}</TableCell>
                        <TableCell>
                          {joiner.responsiblePerson ? (
                            <Badge 
                              style={{ backgroundColor: joiner.responsiblePerson.color }}
                              className="text-white"
                            >
                              {joiner.responsiblePerson.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">None assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditJoiner(joiner)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteJoiner(joiner.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => returnJoinerToBoard(joiner.id)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Return to Board
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Request Dialog */}
      <Dialog open={!!editingRequest} onOpenChange={(open) => !open && setEditingRequest(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Fulfilled Request</DialogTitle>
          </DialogHeader>
          {editingRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="request-text" className="text-right text-sm font-medium">
                  Request
                </label>
                <Input
                  id="request-text"
                  value={editingRequest.requestText}
                  onChange={(e) => setEditingRequest({...editingRequest, requestText: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="person-name" className="text-right text-sm font-medium">
                  Name
                </label>
                <Input
                  id="person-name"
                  value={editingRequest.personName}
                  onChange={(e) => setEditingRequest({...editingRequest, personName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  value={editingRequest.email}
                  onChange={(e) => setEditingRequest({...editingRequest, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="note" className="text-right text-sm font-medium">
                  Note
                </label>
                <Textarea
                  id="note"
                  value={editingRequest.note}
                  onChange={(e) => setEditingRequest({...editingRequest, note: e.target.value})}
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
                  value={editingRequest.date}
                  onChange={(e) => setEditingRequest({...editingRequest, date: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRequest(null)}>Cancel</Button>
            <Button onClick={handleSaveRequestEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Joiner Dialog */}
      <Dialog open={!!editingJoiner} onOpenChange={(open) => !open && setEditingJoiner(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Recent Joiner</DialogTitle>
          </DialogHeader>
          {editingJoiner && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="joiner-name" className="text-right text-sm font-medium">
                  Name
                </label>
                <Input
                  id="joiner-name"
                  value={editingJoiner.name}
                  onChange={(e) => setEditingJoiner({...editingJoiner, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="company" className="text-right text-sm font-medium">
                  Company
                </label>
                <Input
                  id="company"
                  value={editingJoiner.company}
                  onChange={(e) => setEditingJoiner({...editingJoiner, company: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="joiner-email" className="text-right text-sm font-medium">
                  Email
                </label>
                <Input
                  id="joiner-email"
                  value={editingJoiner.email}
                  onChange={(e) => setEditingJoiner({...editingJoiner, email: e.target.value})}
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
                  value={editingJoiner.creationDate.split('T')[0]}
                  onChange={(e) => setEditingJoiner({...editingJoiner, creationDate: `${e.target.value}T00:00:00.000Z`})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingJoiner(null)}>Cancel</Button>
            <Button onClick={handleSaveJoinerEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Request Confirmation Dialog */}
      <Dialog open={isDeleteRequestDialogOpen} onOpenChange={setIsDeleteRequestDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Fulfilled Request</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this request? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteRequestDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteRequest}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Joiner Confirmation Dialog */}
      <Dialog open={isDeleteJoinerDialogOpen} onOpenChange={setIsDeleteJoinerDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Recent Joiner</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this joiner? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteJoinerDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteJoiner}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tables;
