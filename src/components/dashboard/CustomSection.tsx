
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import CustomSectionCard from './CustomSectionCard';
import AddCustomSectionDialog from './AddCustomSectionDialog';

const CustomSection: React.FC = () => {
  const { customSectionItems } = useDashboard();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Custom Section</CardTitle>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setAddDialogOpen(true)}
              className="p-1 h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {customSectionItems.length === 0 ? (
            <p className="text-gray-500 italic">No items yet</p>
          ) : (
            <div className="space-y-4">
              {customSectionItems.map((item) => (
                <CustomSectionCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddCustomSectionDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
      />
    </>
  );
};

export default CustomSection;
