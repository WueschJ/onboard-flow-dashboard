
import React from 'react';
import { Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface JoinerInfoProps {
  name: string;
  company: string;
  email: string;
  creationDate: string;
  onCopyEmail: () => void;
}

const JoinerInfo: React.FC<JoinerInfoProps> = ({
  name,
  company,
  email,
  creationDate,
  onCopyEmail
}) => {
  const formattedDate = format(parseISO(creationDate), 'MMM d, yyyy');

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-base font-medium text-dashboard-heading">{name}</h4>
      </div>
      <div className="text-sm text-dashboard-text mb-1">{company}</div>
      
      <div className="flex items-center gap-2 mb-3">
        <div className="text-sm text-dashboard-text">{email}</div>
        <button 
          className="text-xs text-blue-500"
          onClick={onCopyEmail}
        >
          Copy
        </button>
      </div>
      
      <div className="flex items-center text-xs text-gray-500 mb-3">
        <Calendar className="h-3.5 w-3.5 mr-1" />
        <span>Added: {formattedDate}</span>
      </div>
    </>
  );
};

export default JoinerInfo;
