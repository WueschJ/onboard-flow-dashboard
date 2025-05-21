
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Edit, Trash2 } from 'lucide-react';

interface JoinerContextMenuProps {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}

const JoinerContextMenu: React.FC<JoinerContextMenuProps> = ({
  children,
  onEdit,
  onDelete
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Joiner
        </ContextMenuItem>
        <ContextMenuItem onSelect={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Joiner
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default JoinerContextMenu;
