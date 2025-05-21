
import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Backend: React.FC = () => {
  const { fulfilledRequests, recentJoiners } = useDashboard();

  return (
    <div className="bg-dashboard-gray min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-dashboard-heading">Cliq Operations Backend</h1>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Fulfilled Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {fulfilledRequests.length === 0 ? (
                <p className="text-gray-500 italic">No fulfilled requests yet</p>
              ) : (
                <div className="space-y-4">
                  {fulfilledRequests.map((request) => (
                    <div key={request.id} className="bg-white p-4 rounded-md shadow-sm border border-dashboard-border">
                      <h4 className="text-base font-medium text-dashboard-heading mb-2">{request.requestText}</h4>
                      <div className="text-sm text-dashboard-text mb-1">{request.personName}</div>
                      <div className="text-sm text-dashboard-text mb-2">{request.email}</div>
                      
                      <div className="text-xs text-gray-500 mb-2 italic">{request.note}</div>
                      <div className="text-xs text-gray-500">{request.date}</div>
                      
                      <div className="flex gap-1 mt-2">
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Joiners</CardTitle>
            </CardHeader>
            <CardContent>
              {recentJoiners.length === 0 ? (
                <p className="text-gray-500 italic">No recent joiners yet</p>
              ) : (
                <div className="space-y-4">
                  {recentJoiners.map((joiner) => (
                    <div key={joiner.id} className="bg-white p-4 rounded-md shadow-sm border border-dashboard-border">
                      <h4 className="text-base font-medium text-dashboard-heading mb-2">{joiner.name}</h4>
                      <div className="text-sm text-dashboard-text mb-1">{joiner.company}</div>
                      <div className="text-sm text-dashboard-text mb-2">{joiner.email}</div>
                      
                      {joiner.responsiblePerson && (
                        <Badge 
                          style={{ backgroundColor: joiner.responsiblePerson.color }}
                          className="text-white"
                        >
                          {joiner.responsiblePerson.name}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Backend;
