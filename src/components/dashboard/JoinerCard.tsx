
import React, { useState } from 'react';
import { JoinerItem } from '@/types/dashboard';
import { MoreVertical } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import JoinerActions from './joiner/JoinerActions';
import JoinerInfo from './joiner/JoinerInfo';
import JoinerEditDialog from './joiner/JoinerEditDialog';
import JoinerDeleteDialog from './joiner/JoinerDeleteDialog';
import JoinerContextMenu from './joiner/JoinerContextMenu';

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
      <JoinerContextMenu
        onEdit={openEditDialog}
        onDelete={() => setIsDeleteDialogOpen(true)}
      >
        <div className="bg-white p-4 rounded-md shadow-sm border border-dashboard-border animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex-grow">
              <JoinerInfo
                name={joiner.name}
                company={joiner.company}
                email={joiner.email}
                creationDate={joiner.creationDate}
                onCopyEmail={copyToClipboard}
              />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
          
          <JoinerActions
            id={joiner.id}
            isInAppNotificationSent={joiner.isInAppNotificationSent}
            isEmailNotificationSent={joiner.isEmailNotificationSent}
            creationDate={joiner.creationDate}
            responsiblePerson={joiner.responsiblePerson}
            responsiblePersons={responsiblePersons}
            toggleJoinerInAppNotification={toggleJoinerInAppNotification}
            toggleJoinerEmailNotification={toggleJoinerEmailNotification}
            assignResponsibleToJoiner={assignResponsibleToJoiner}
          />
        </div>
      </JoinerContextMenu>

      <JoinerEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editedJoiner={editedJoiner}
        setEditedJoiner={setEditedJoiner}
        onSave={handleSaveEdit}
      />

      <JoinerDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteConfirm}
      />
    </>
  );
};

export default JoinerCard;
