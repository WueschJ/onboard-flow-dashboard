
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
    addWeeklyNudge,
    incrementWeeklyAkquise,
    incrementWeeklyEngagement,
    incrementWeeklyMagicMoments
  } = useDashboard();

  // Calculate progress percentages
  const goalTotalRequests = 15;
  const goalWeeklyNudges = 10;
  const goalWeeklyAkquise = 3;
  const goalWeeklyEngagement = 3;
  const goalWeeklyMagicMoments = 3;

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
  const weeklyAkquiseProgress = Math.min((weeklyStats.newRequests / goalWeeklyAkquise) * 100, 100);
  const weeklyEngagementProgress = Math.min((weeklyStats.newJoiners / goalWeeklyEngagement) * 100, 100);
  const weeklyMagicMomentsProgress = Math.min((weeklyStats.requestsGranted / goalWeeklyMagicMoments) * 100, 100);

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
          <p className="text-xs text-gray-500 mt-2">Goal: {goalTotalRequests} by end of Sprint 1</p>
        </div>
        
        {/* Weekly Nudging Tracker - Using less prominent colors */}
        <div className="bg-gradient-to-r from-[#F1F0FB] to-white p-4 rounded-md shadow-sm border border-dashboard-border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-dashboard-heading">Weekly Nudging</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-bold">{currentWeekNudges}/{goalWeeklyNudges}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0 hover:bg-gray-100"
                onClick={handleNudgeClick}
              >
                <Plus className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
          <Progress value={weeklyNudgesProgress} className="h-3 mb-1" variant="default" />
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
                    variant="default" 
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
              <span className="text-gray-600">Akquise</span>
              <div className="flex items-center gap-2">
                <span className="text-dashboard-blue font-bold">{weeklyStats.newRequests}/{goalWeeklyAkquise}</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 hover:bg-blue-50"
                  onClick={incrementWeeklyAkquise}
                >
                  <Plus className="h-3 w-3 text-dashboard-blue" />
                </Button>
              </div>
            </div>
            <Progress value={weeklyAkquiseProgress} className="h-2 mb-1" variant="blue" />
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Engagement</span>
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">{weeklyStats.newJoiners}/{goalWeeklyEngagement}</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 hover:bg-green-50"
                  onClick={incrementWeeklyEngagement}
                >
                  <Plus className="h-3 w-3 text-green-600" />
                </Button>
              </div>
            </div>
            <Progress value={weeklyEngagementProgress} className="h-2 mb-1" variant="green" />
          </div>
          
          <div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Magic Moments</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-600 font-bold">{weeklyStats.requestsGranted}/{goalWeeklyMagicMoments}</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 hover:bg-amber-50"
                  onClick={incrementWeeklyMagicMoments}
                >
                  <Plus className="h-3 w-3 text-amber-600" />
                </Button>
              </div>
            </div>
            <Progress value={weeklyMagicMomentsProgress} className="h-2 mb-1" variant="amber" />
          </div>
          
          <p className="text-xs text-gray-500 mt-2">Resets every Monday</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackers;
