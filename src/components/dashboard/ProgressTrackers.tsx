
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useDashboard } from '@/context/DashboardContext';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

const ProgressTrackers = () => {
  const { 
    totalRequestsGranted, 
    weeklyStats, 
    weeklyNudges,
    addWeeklyNudge 
  } = useDashboard();

  // Calculate progress percentages
  const goalTotalRequests = 30;
  const goalWeeklyNudges = 10;
  const goalWeeklyRequests = 3;
  const goalWeeklyJoiners = 3;
  const goalWeeklyRequestsGranted = 3;

  const totalRequestsProgress = Math.min((totalRequestsGranted / goalTotalRequests) * 100, 100);
  
  // Get current week number and year
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentWeekNumber = Math.ceil((now.getTime() - new Date(currentYear, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  
  // Find the current week's nudges count
  const currentWeekNudges = weeklyNudges.find(nudge => 
    nudge.week === currentWeekNumber && nudge.year === currentYear
  )?.count || 0;
  
  const weeklyNudgesProgress = Math.min((currentWeekNudges / goalWeeklyNudges) * 100, 100);
  
  // Calculate weekly stats progress
  const weeklyRequestsProgress = Math.min((weeklyStats.newRequests / goalWeeklyRequests) * 100, 100);
  const weeklyJoinersProgress = Math.min((weeklyStats.newJoiners / goalWeeklyJoiners) * 100, 100);
  const weeklyRequestsGrantedProgress = Math.min((weeklyStats.requestsGranted / goalWeeklyRequestsGranted) * 100, 100);

  // Get previous weeks' nudges for historical display
  const previousWeeksNudges = weeklyNudges
    .filter(nudge => nudge.year < currentYear || (nudge.year === currentYear && nudge.week < currentWeekNumber))
    .sort((a, b) => b.year - a.year || b.week - a.week)
    .slice(0, 4); // Show up to 4 previous weeks

  const handleNudgeClick = () => {
    addWeeklyNudge();
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-dashboard-heading">Progress Trackers</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Progress Tracker */}
        <div className="bg-gradient-to-r from-dashboard-lightBlue to-white p-4 rounded-md shadow-sm border border-dashboard-border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-dashboard-heading">Total Requests Granted</h3>
            <span className="text-sm text-dashboard-blue font-bold">{totalRequestsGranted}/{goalTotalRequests}</span>
          </div>
          <Progress value={totalRequestsProgress} className="h-3 mb-1" variant="blue" />
          <p className="text-xs text-gray-500 mt-2">Goal: {goalTotalRequests} by August 1, 2025</p>
        </div>
        
        {/* Weekly Nudging Tracker */}
        <div className="bg-gradient-to-r from-dashboard-softPurple to-white p-4 rounded-md shadow-sm border border-dashboard-border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-dashboard-heading">Weekly Nudging</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-dashboard-purple font-bold">{currentWeekNudges}/{goalWeeklyNudges}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0 hover:bg-dashboard-purple/10"
                onClick={handleNudgeClick}
              >
                <Plus className="h-4 w-4 text-dashboard-purple" />
              </Button>
            </div>
          </div>
          <Progress value={weeklyNudgesProgress} className="h-3 mb-1" variant="purple" />
          <p className="text-xs text-gray-500 mt-2">
            Current Week: {currentWeekNumber}, resets every Monday
          </p>
          
          {previousWeeksNudges.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-1">
              {previousWeeksNudges.map((nudge) => (
                <div key={`${nudge.year}-${nudge.week}`} className="text-center">
                  <Progress 
                    value={(nudge.count / goalWeeklyNudges) * 100} 
                    className="h-1.5 mb-1 opacity-50" 
                    variant="purple" 
                  />
                  <span className="text-[0.65rem] text-gray-400">{`W${nudge.week}`}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Weekly Stats Tracker */}
        <div className="bg-gradient-to-r from-dashboard-lightBlue to-white p-4 rounded-md shadow-sm border border-dashboard-border">
          <h3 className="text-lg font-medium text-dashboard-heading mb-2">Weekly Stats</h3>
          
          <div className="mb-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">New Requests</span>
              <span className="text-dashboard-blue font-bold">{weeklyStats.newRequests}/{goalWeeklyRequests}</span>
            </div>
            <Progress value={weeklyRequestsProgress} className="h-2 mb-1" variant="blue" />
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">New Joiners</span>
              <span className="text-green-600 font-bold">{weeklyStats.newJoiners}/{goalWeeklyJoiners}</span>
            </div>
            <Progress value={weeklyJoinersProgress} className="h-2 mb-1" variant="green" />
          </div>
          
          <div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Requests Granted</span>
              <span className="text-amber-600 font-bold">{weeklyStats.requestsGranted}/{goalWeeklyRequestsGranted}</span>
            </div>
            <Progress value={weeklyRequestsGrantedProgress} className="h-2 mb-1" variant="amber" />
          </div>
          
          <p className="text-xs text-gray-500 mt-2">Resets every Monday</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackers;
