
import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Newspaper } from 'lucide-react';
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

const NewsBackend: React.FC = () => {
  const { newsItems } = useDashboard();

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
    </div>
  );
};

export default NewsBackend;
