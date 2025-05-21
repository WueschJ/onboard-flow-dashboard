
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDashboard } from '@/context/DashboardContext';
import { Calendar, PlusCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProgressTrackers: React.FC = () => {
  const { totalRequestsGranted, weeklyStats, weeklyNudges, addWeeklyNudge } = useDashboard();

  // Calculate percentages for progress bars
  const overallProgress = Math.min(Math.round((totalRequestsGranted / 30) * 100), 100);
  
  const currentWeekNudge = weeklyNudges.find(nudge => 
    nudge.week === new Date().getDay() && nudge.year === new Date().getFullYear()
  ) || { count: 0 };
  
  const nudgingProgress = Math.min(Math.round((currentWeekNudge.count / 10) * 100), 100);
  
  const weeklyRequestsProgress = Math.min(Math.round((weeklyStats.requestsGranted / 3) * 100), 100);
  const weeklyJoinersProgress = Math.min(Math.round((weeklyStats.newJoiners / 3) * 100), 100);
  const weeklyNewRequestsProgress = Math.min(Math.round((weeklyStats.newRequests / 3) * 100), 100);
  
  // Previous weeks' nudges (excluding current week)
  const previousWeeks = weeklyNudges
    .filter(nudge => 
      nudge.week !== new Date().getDay() || nudge.year !== new Date().getFullYear()
    )
    .slice(-3); // Get only the last 3 previous weeks

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
      {/* Overall Progress Tracker */}
      <Card className="col-span-1 lg:col-span-2 border border-dashboard-border hover:shadow-card-hover transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-dashboard-heading">Overall Progress Tracker</CardTitle>
            <CardDescription>Goal: 30 requests granted by August 1, 2025</CardDescription>
          </div>
          <Calendar className="h-5 w-5 text-dashboard-blue" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-dashboard-blue font-semibold">{totalRequestsGranted}/30 requests</span>
            </div>
            <Progress value={overallProgress} variant="blue" className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Nudging Tracker */}
      <Card className="border border-dashboard-border hover:shadow-card-hover transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-dashboard-heading">Weekly Nudging Tracker</CardTitle>
            <CardDescription>Goal: 10 nudges per week</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="outline" 
              onClick={addWeeklyNudge} 
              className="border-dashboard-purple text-dashboard-purple hover:text-dashboard-purple hover:bg-dashboard-softPurple"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
            <TrendingUp className="h-5 w-5 text-dashboard-purple" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Current Week</span>
                <span className="text-dashboard-purple font-semibold">{currentWeekNudge.count}/10 nudges</span>
              </div>
              <Progress value={nudgingProgress} variant="purple" className="h-2" />
            </div>
            
            {/* Previous Weeks */}
            {previousWeeks.map((week, index) => (
              <div key={`${week.year}-${week.week}`} className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Week {week.week}</span>
                  <span>{week.count}/10 nudges</span>
                </div>
                <Progress 
                  value={Math.min(Math.round((week.count / 10) * 100), 100)} 
                  variant="purple"
                  className="h-1 opacity-50" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Metrics Tracker */}
      <Card className="border border-dashboard-border hover:shadow-card-hover transition-shadow">
        <CardHeader>
          <CardTitle className="text-dashboard-heading">Weekly Metrics</CardTitle>
          <CardDescription>Goal: 3 of each per week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">New Requests</span>
                <span className="text-dashboard-amber font-semibold">{weeklyStats.newRequests}/3</span>
              </div>
              <Progress value={weeklyNewRequestsProgress} variant="amber" className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">New Joiners</span>
                <span className="text-dashboard-green font-semibold">{weeklyStats.newJoiners}/3</span>
              </div>
              <Progress value={weeklyJoinersProgress} variant="green" className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Requests Granted</span>
                <span className="text-dashboard-blue font-semibold">{weeklyStats.requestsGranted}/3</span>
              </div>
              <Progress value={weeklyRequestsProgress} variant="blue" className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTrackers;
