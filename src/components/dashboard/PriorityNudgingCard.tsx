
import React from 'react';
import { PriorityNudgingItem } from '@/types/dashboard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, FileText } from 'lucide-react';

interface PriorityNudgingCardProps {
  item: PriorityNudgingItem;
}

const PriorityNudgingCard: React.FC<PriorityNudgingCardProps> = ({ item }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="p-3 bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
        </div>
        
        {item.responsiblePerson && (
          <Badge 
            style={{ backgroundColor: item.responsiblePerson.color }}
            className="text-white text-xs"
          >
            {item.responsiblePerson.name}
          </Badge>
        )}
        
        {item.email && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Mail className="h-3 w-3" />
            <span className="truncate">{item.email}</span>
          </div>
        )}
        
        {item.note && (
          <div className="flex items-start gap-1 text-xs text-gray-600">
            <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{item.note}</span>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          Created: {formatDate(item.creationDate)}
        </div>
      </div>
    </Card>
  );
};

export default PriorityNudgingCard;
