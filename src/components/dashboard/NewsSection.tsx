
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDashboard } from '@/context/DashboardContext';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const NewsSection: React.FC = () => {
  const [personName, setPersonName] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const { addNewsItem } = useDashboard();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!personName.trim()) {
      toast({
        title: "Error",
        description: "Person name is required",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (!newsContent.trim()) {
      toast({
        title: "Error",
        description: "News content is required",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Add news item
    addNewsItem({
      personName: personName.trim(),
      content: newsContent.trim(),
      date: new Date().toISOString(),
    });
    
    // Show success toast
    toast({
      title: "Success",
      description: "News item has been added",
      duration: 3000,
    });
    
    // Clear form
    setPersonName('');
    setNewsContent('');
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-dashboard-heading">News</h2>
      
      <Card className="bg-white shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Add News</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          <div>
            <label htmlFor="personName" className="block text-sm font-medium text-gray-700 mb-1">
              Person Name
            </label>
            <Input
              id="personName"
              placeholder="Enter person name"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="newsContent" className="block text-sm font-medium text-gray-700 mb-1">
              News Content
            </label>
            <Textarea
              id="newsContent"
              placeholder="Enter news details"
              value={newsContent}
              onChange={(e) => setNewsContent(e.target.value)}
              className="w-full min-h-[120px]"
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">
              <Save className="mr-2" />
              Save News
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewsSection;
