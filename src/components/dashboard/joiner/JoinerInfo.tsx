
import React from 'react';
import { Calendar, Copy } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const formattedDate = format(parseISO(creationDate), 'MMM d, yyyy');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email).then(
      () => {
        toast({
          title: "Email copied",
          description: `${email} copied to clipboard`,
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
    onCopyEmail();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-base font-medium text-dashboard-heading">{name}</h4>
      </div>
      <div className="text-sm text-dashboard-text mb-1">{company}</div>
      
      <div className="flex items-center gap-2 mb-3">
        <Badge 
          variant="outline" 
          className="bg-dashboard-lightBlue text-dashboard-blue border-dashboard-blue/20 cursor-pointer hover:bg-dashboard-blue/10 transition-colors"
          onClick={copyToClipboard}
        >
          <span className="truncate max-w-[180px]">{email}</span>
          <Copy className="h-3 w-3 ml-1" />
        </Badge>
      </div>
      
      <div className="flex items-center text-xs text-gray-500 mb-3">
        <Calendar className="h-3.5 w-3.5 mr-1" />
        <span>Added: {formattedDate}</span>
      </div>
    </>
  );
};

export default JoinerInfo;
