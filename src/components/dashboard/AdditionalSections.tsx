
import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import KanbanLane from './KanbanLane';
import RequestCard from './RequestCard';
import OnboardingContactCard from './OnboardingContactCard';
import AddRequestDialog from './AddRequestDialog';
import AddContactDialog from './AddContactDialog';

const AdditionalSections: React.FC = () => {
  const [motiusAskDialogOpen, setMotiusAskDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  
  const { motiusAsks, onboardingList } = useDashboard();
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-dashboard-heading">Additional Tasks</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Motius Asks Section */}
        <KanbanLane 
          title="Motius Asks" 
          showAddButton 
          onAddItem={() => setMotiusAskDialogOpen(true)}
        >
          {motiusAsks.map((ask) => (
            <RequestCard key={ask.id} request={ask} />
          ))}
        </KanbanLane>
        
        {/* Onboarding List Section */}
        <KanbanLane 
          title="Onboarding List" 
          showAddButton 
          onAddItem={() => setContactDialogOpen(true)}
        >
          {onboardingList.map((contact) => (
            <OnboardingContactCard key={contact.id} contact={contact} />
          ))}
        </KanbanLane>
      </div>
      
      <AddRequestDialog 
        open={motiusAskDialogOpen}
        onOpenChange={setMotiusAskDialogOpen}
        isMotiusAsk
      />
      
      <AddContactDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
      />
    </div>
  );
};

export default AdditionalSections;
