
import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Newspaper, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { NewsItem } from '@/types/dashboard';
import { ScrollArea } from '@/components/ui/scroll-area';

const NewsBackend: React.FC = () => {
  const { newsItems } = useDashboard();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const handleViewNews = (news: NewsItem) => {
    setSelectedNews(news);
  };

  return (
    <div className="bg-dashboard-gray min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Newspaper className="h-6 w-6 mr-3 text-dashboard-blue" />
            <h1 className="text-3xl font-bold text-dashboard-heading">News Backend</h1>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Newspaper className="h-5 w-5 mr-2 text-dashboard-blue" />
              News Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {newsItems.length === 0 ? (
              <p className="text-gray-500 italic p-4">No news items added yet.</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Person Name</TableHead>
                      <TableHead>News Content</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newsItems.map((item) => {
                      const formattedDate = format(parseISO(item.date), 'MMM d, yyyy - h:mm a');
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.personName}
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="line-clamp-2">{item.content}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {formattedDate}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewNews(item)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* News Detail Dialog */}
      <Dialog open={selectedNews !== null} onOpenChange={(open) => !open && setSelectedNews(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>News Detail</DialogTitle>
            {selectedNews && (
              <DialogDescription className="text-sm text-muted-foreground">
                Added on {format(parseISO(selectedNews.date), 'MMMM d, yyyy - h:mm a')}
              </DialogDescription>
            )}
          </DialogHeader>
          
          {selectedNews && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Person Name</h3>
                <p className="font-medium">{selectedNews.personName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Content</h3>
                <ScrollArea className="h-[200px] rounded-md border p-4 bg-slate-50">
                  <p className="whitespace-pre-wrap">{selectedNews.content}</p>
                </ScrollArea>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsBackend;
