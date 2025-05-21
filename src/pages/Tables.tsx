
import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

const TablesContent: React.FC = () => {
  const { fulfilledRequests, recentJoiners } = useDashboard();

  // Format the date from ISO string
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-dashboard-gray min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-dashboard-heading bg-gradient-to-r from-dashboard-blue to-dashboard-purple bg-clip-text text-transparent">
            Tables View
          </h1>
          <Button variant="outline" asChild className="hover:bg-dashboard-lightBlue hover:text-dashboard-blue border-dashboard-border">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Link>
          </Button>
        </div>

        <div className="space-y-8">
          {/* Requests Granted Table */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-dashboard-border">
            <h2 className="text-xl font-semibold mb-4 text-dashboard-heading">Requests Granted</h2>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead>Person</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Responsible Persons</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fulfilledRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No fulfilled requests yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    fulfilledRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.requestText}</TableCell>
                        <TableCell>{request.personName}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={request.note}>
                          {request.note}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {request.responsiblePersons.map((person) => (
                              <Badge 
                                key={person.id} 
                                style={{ backgroundColor: person.color }}
                                className="text-white"
                              >
                                {person.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Recent Joiners Table */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-dashboard-border">
            <h2 className="text-xl font-semibold mb-4 text-dashboard-heading">Recent Joiners</h2>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Responsible Person</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentJoiners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No recent joiners yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentJoiners.map((joiner) => (
                      <TableRow key={joiner.id}>
                        <TableCell className="font-medium">{joiner.name}</TableCell>
                        <TableCell>{joiner.company}</TableCell>
                        <TableCell>{joiner.email}</TableCell>
                        <TableCell>{formatDate(joiner.creationDate)}</TableCell>
                        <TableCell>
                          {joiner.responsiblePerson ? (
                            <Badge 
                              style={{ backgroundColor: joiner.responsiblePerson.color }}
                              className="text-white"
                            >
                              {joiner.responsiblePerson.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">None assigned</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// The Tables component is just a wrapper that provides the DashboardContext
const Tables: React.FC = () => (
  <TablesContent />
);

export default Tables;
