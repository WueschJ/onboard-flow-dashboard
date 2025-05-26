
import React, { useState } from 'react';
import KanbanLane from './KanbanLane';
import RequestCard from './RequestCard';
import JoinerCard from './JoinerCard';
import NominationCard from './NominationCard';
import FulfillRequestCard from './FulfillRequestCard';
import AddRequestDialog from './AddRequestDialog';
import AddJoinerDialog from './AddJoinerDialog';
import AddNominationDialog from './AddNominationDialog';
import { useDashboard } from '@/context/DashboardContext';

const KanbanBoard: React.FC = () => {
  const [newRequestDialogOpen, setNewRequestDialogOpen] = useState(false);
  const [newJoinerDialogOpen, setNewJoinerDialogOpen] = useState(false);
  const [nominationDialogOpen, setNominationDialogOpen] = useState(false);
  
  const { 
    newRequests, 
    requestsInProcess, 
    newJoiners,
    nominations,
    fulfillRequests 
  } = useDashboard();
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-dashboard-heading">Task Management</h2>
      
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4">
          {/* Nominations Lane */}
          <KanbanLane 
            title="Nominations" 
            showAddButton 
            onAddItem={() => setNominationDialogOpen(true)}
          >
            {nominations.map((nomination) => (
              <NominationCard key={nomination.id} nomination={nomination} />
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
          
          {/* Fulfill Requests Lane */}
          <KanbanLane title="Fulfill Requests">
            {fulfillRequests.map((item) => (
              <FulfillRequestCard key={item.id} item={item} />
            ))}
          </KanbanLane>
        </div>
      </div>
      
      <AddRequestDialog 
        open={newRequestDialogOpen} 
        onOpenChange={setNewRequestDialogOpen}
      />
      
      <AddJoinerDialog
        open={newJoinerDialogOpen}
        onOpenChange={setNewJoinerDialogOpen}
      />
      
      <AddNominationDialog
        open={nominationDialogOpen}
        onOpenChange={setNominationDialogOpen}
      />
    </div>
  );
};

export default KanbanBoard;
