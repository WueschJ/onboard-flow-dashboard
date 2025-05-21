
import React, { useState } from 'react';
import KanbanLane from './KanbanLane';
import RequestCard from './RequestCard';
import JoinerCard from './JoinerCard';
import FulfillRequestCard from './FulfillRequestCard';
import AddRequestDialog from './AddRequestDialog';
import AddJoinerDialog from './AddJoinerDialog';
import { useDashboard } from '@/context/DashboardContext';

const KanbanBoard: React.FC = () => {
  const [newRequestDialogOpen, setNewRequestDialogOpen] = useState(false);
  const [newJoinerDialogOpen, setNewJoinerDialogOpen] = useState(false);
  
  const { 
    newRequests, 
    requestsInProcess, 
    newJoiners, 
    fulfillRequests 
  } = useDashboard();
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-dashboard-heading">Task Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* New Requests Lane */}
        <KanbanLane 
          title="New Requests" 
          showAddButton 
          onAddItem={() => setNewRequestDialogOpen(true)}
        >
          {newRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </KanbanLane>
        
        {/* Requests in Process Lane */}
        <KanbanLane title="Requests in Process">
          {requestsInProcess.map((request) => (
            <RequestCard key={request.id} request={request} inProcess />
          ))}
        </KanbanLane>
        
        {/* New Joiners Lane */}
        <KanbanLane 
          title="New Joiners" 
          showAddButton 
          onAddItem={() => setNewJoinerDialogOpen(true)}
        >
          {newJoiners.map((joiner) => (
            <JoinerCard key={joiner.id} joiner={joiner} />
          ))}
        </KanbanLane>
        
        {/* Fulfill Requests Lane */}
        <KanbanLane title="Fulfill Requests">
          {fulfillRequests.map((item) => (
            <FulfillRequestCard key={item.id} item={item} />
          ))}
        </KanbanLane>
      </div>
      
      <AddRequestDialog 
        open={newRequestDialogOpen} 
        onOpenChange={setNewRequestDialogOpen}
      />
      
      <AddJoinerDialog
        open={newJoinerDialogOpen}
        onOpenChange={setNewJoinerDialogOpen}
      />
    </div>
  );
};

export default KanbanBoard;
