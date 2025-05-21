
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  RequestItem, 
  JoinerItem, 
  FulfillRequestItem, 
  OnboardingContact,
  ResponsiblePerson,
  WeeklyNudge
} from '../types/dashboard';

type DashboardContextType = {
  newRequests: RequestItem[];
  requestsInProcess: RequestItem[];
  newJoiners: JoinerItem[];
  fulfillRequests: FulfillRequestItem[];
  motiusAsks: RequestItem[];
  onboardingList: OnboardingContact[];
  fulfilledRequests: RequestItem[];
  recentJoiners: JoinerItem[];
  responsiblePersons: ResponsiblePerson[];
  weeklyNudges: WeeklyNudge[];
  weeklyStats: {
    newRequests: number;
    newJoiners: number;
    requestsGranted: number;
  };
  totalRequestsGranted: number;
  addNewRequest: (request: Omit<RequestItem, 'id' | 'isFulfilled' | 'responsiblePersons'>) => void;
  addNewJoiner: (joiner: Omit<JoinerItem, 'id' | 'isInAppNotificationSent' | 'isEmailNotificationSent'>) => void;
  addMotiusAsk: (ask: Omit<RequestItem, 'id' | 'isFulfilled' | 'responsiblePersons'>) => void;
  addOnboardingContact: (contact: Omit<OnboardingContact, 'id'>) => void;
  assignResponsibleToRequest: (requestId: string, personId: string) => void;
  removeResponsibleFromRequest: (requestId: string, personId: string) => void;
  assignResponsibleToJoiner: (joinerId: string, personId: string) => void;
  markRequestFulfilled: (requestId: string) => void;
  toggleJoinerInAppNotification: (joinerId: string) => void;
  toggleJoinerEmailNotification: (joinerId: string) => void;
  completeFulfillRequest: (requestId: string) => void;
  addCustomResponsiblePerson: (name: string) => ResponsiblePerson;
  addWeeklyNudge: () => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Get the current week number
const getWeekNumber = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 604800000; 
  return Math.ceil(diff / oneWeek);
};

// Get current date as human-readable string
const getCurrentDateString = () => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Sample data for responsible persons - including the required names
const initialResponsiblePersons: ResponsiblePerson[] = [
  { id: '1', name: 'Marie', color: '#3E7BFA' },
  { id: '2', name: 'Noah', color: '#10B981' },
  { id: '3', name: 'Chris', color: '#F59E0B' },
  { id: '4', name: 'Zied', color: '#EC4899' },
  { id: '5', name: 'Johanna', color: '#8B5CF6' },
];

// Sample color array for custom people
const personColors = ['#3E7BFA', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#6366F1', '#D946EF', '#F43F5E'];

// Sample data for initial state
const initialNewRequests: RequestItem[] = [
  {
    id: '1',
    requestText: 'Access to Design System',
    personName: 'John Doe',
    email: 'john.doe@example.com',
    note: 'Needs access to Figma workspace',
    date: '2025-05-15',
    responsiblePersons: [],
    isFulfilled: false
  },
  {
    id: '2',
    requestText: 'New Laptop Setup',
    personName: 'Sarah Miller',
    email: 'sarah.miller@example.com',
    note: 'M1 MacBook Pro with dev tools',
    date: '2025-05-17',
    responsiblePersons: [],
    isFulfilled: false
  }
];

const initialNewJoiners: JoinerItem[] = [
  {
    id: '1',
    name: 'Mike Robinson',
    company: 'Acme Inc.',
    email: 'mike.robinson@acme.com',
    isInAppNotificationSent: false,
    isEmailNotificationSent: false
  },
  {
    id: '2',
    name: 'Lisa Chen',
    company: 'Global Tech',
    email: 'lisa.chen@globaltech.com',
    isInAppNotificationSent: false,
    isEmailNotificationSent: false
  }
];

const initialMotiusAsks: RequestItem[] = [
  {
    id: '1',
    requestText: 'Weekly Project Update',
    personName: 'Motius Team',
    email: 'team@motius.com',
    note: 'Send progress report by Friday',
    date: '2025-05-18',
    responsiblePersons: [],
    isFulfilled: false
  }
];

const initialWeeklyNudges: WeeklyNudge[] = [
  {
    week: getWeekNumber(),
    count: 0,
    year: new Date().getFullYear()
  }
];

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [newRequests, setNewRequests] = useState<RequestItem[]>(initialNewRequests);
  const [requestsInProcess, setRequestsInProcess] = useState<RequestItem[]>([]);
  const [newJoiners, setNewJoiners] = useState<JoinerItem[]>(initialNewJoiners);
  const [fulfillRequests, setFulfillRequests] = useState<FulfillRequestItem[]>([]);
  const [motiusAsks, setMotiusAsks] = useState<RequestItem[]>(initialMotiusAsks);
  const [onboardingList, setOnboardingList] = useState<OnboardingContact[]>([]);
  const [fulfilledRequests, setFulfilledRequests] = useState<RequestItem[]>([]);
  const [recentJoiners, setRecentJoiners] = useState<JoinerItem[]>([]);
  const [responsiblePersons, setResponsiblePersons] = useState<ResponsiblePerson[]>(initialResponsiblePersons);
  const [weeklyNudges, setWeeklyNudges] = useState<WeeklyNudge[]>(initialWeeklyNudges);
  const [weeklyStats, setWeeklyStats] = useState({ newRequests: 0, newJoiners: 0, requestsGranted: 0 });
  const [totalRequestsGranted, setTotalRequestsGranted] = useState(0);

  // Generate Fulfill Requests based on New Requests
  useEffect(() => {
    const generatedFulfillRequests = newRequests.map(request => ({
      id: request.id,
      name: request.personName,
      requestText: request.requestText,
      email: request.email,
      isCompleted: false
    }));
    setFulfillRequests(generatedFulfillRequests);
  }, [newRequests]);

  // Add a new request
  const addNewRequest = (request: Omit<RequestItem, 'id' | 'isFulfilled' | 'responsiblePersons'>) => {
    const newRequest: RequestItem = {
      id: Date.now().toString(),
      ...request,
      responsiblePersons: [],
      isFulfilled: false
    };
    setNewRequests(prev => [...prev, newRequest]);
    
    // Update weekly stats
    setWeeklyStats(prev => ({ ...prev, newRequests: prev.newRequests + 1 }));
  };

  // Add a new joiner
  const addNewJoiner = (joiner: Omit<JoinerItem, 'id' | 'isInAppNotificationSent' | 'isEmailNotificationSent'>) => {
    const newJoiner: JoinerItem = {
      id: Date.now().toString(),
      ...joiner,
      isInAppNotificationSent: false,
      isEmailNotificationSent: false
    };
    setNewJoiners(prev => [...prev, newJoiner]);
    
    // Update weekly stats
    setWeeklyStats(prev => ({ ...prev, newJoiners: prev.newJoiners + 1 }));
  };

  // Add a Motius ask
  const addMotiusAsk = (ask: Omit<RequestItem, 'id' | 'isFulfilled' | 'responsiblePersons'>) => {
    const newAsk: RequestItem = {
      id: Date.now().toString(),
      ...ask,
      responsiblePersons: [],
      isFulfilled: false
    };
    setMotiusAsks(prev => [...prev, newAsk]);
  };

  // Add an onboarding contact
  const addOnboardingContact = (contact: Omit<OnboardingContact, 'id'>) => {
    const newContact: OnboardingContact = {
      id: Date.now().toString(),
      ...contact,
    };
    setOnboardingList(prev => [...prev, newContact]);
  };

  // Assign a responsible person to a request
  const assignResponsibleToRequest = (requestId: string, personId: string) => {
    const person = responsiblePersons.find(p => p.id === personId);
    if (!person) return;

    // Find if the request is in newRequests or requestsInProcess
    let requestFound = newRequests.find(r => r.id === requestId);
    let inNewRequests = !!requestFound;

    if (!requestFound) {
      requestFound = requestsInProcess.find(r => r.id === requestId);
    }

    if (!requestFound) return;
    
    // Don't add if already assigned
    if (requestFound.responsiblePersons.some(p => p.id === person.id)) {
      return;
    }

    const updatedRequestWithPerson = {
      ...requestFound,
      responsiblePersons: [...requestFound.responsiblePersons, person].slice(0, 2) // Max 2 responsible persons
    };

    if (inNewRequests) {
      // Remove from new requests
      const updatedNewRequests = newRequests.filter(r => r.id !== requestId);
      setNewRequests(updatedNewRequests);
      
      // Add to requests in process
      setRequestsInProcess(prev => [...prev, updatedRequestWithPerson]);
    } else {
      // Update in requests in process
      const updatedRequestsInProcess = requestsInProcess.map(r => 
        r.id === requestId ? updatedRequestWithPerson : r
      );
      setRequestsInProcess(updatedRequestsInProcess);
    }
  };

  // Remove a responsible person from a request
  const removeResponsibleFromRequest = (requestId: string, personId: string) => {
    // Only look in requestsInProcess since responsible persons are only in that list
    const request = requestsInProcess.find(r => r.id === requestId);
    if (!request) return;

    const updatedRequestWithoutPerson = {
      ...request,
      responsiblePersons: request.responsiblePersons.filter(p => p.id !== personId)
    };

    // If no responsible persons left, move back to new requests
    if (updatedRequestWithoutPerson.responsiblePersons.length === 0) {
      // Remove from requests in process
      setRequestsInProcess(prev => prev.filter(r => r.id !== requestId));
      
      // Add to new requests
      setNewRequests(prev => [...prev, updatedRequestWithoutPerson]);
    } else {
      // Update in requests in process
      setRequestsInProcess(prev => prev.map(r => 
        r.id === requestId ? updatedRequestWithoutPerson : r
      ));
    }
  };

  // Assign a responsible person to a joiner
  const assignResponsibleToJoiner = (joinerId: string, personId: string) => {
    const person = responsiblePersons.find(p => p.id === personId);
    if (!person) return;

    const updatedJoiners = newJoiners.map(joiner => 
      joiner.id === joinerId ? { ...joiner, responsiblePerson: person } : joiner
    );
    setNewJoiners(updatedJoiners);
  };

  // Mark a request as fulfilled
  const markRequestFulfilled = (requestId: string) => {
    const request = requestsInProcess.find(r => r.id === requestId);
    if (!request) return;

    // Move to fulfilled requests
    setFulfilledRequests(prev => [...prev, { ...request, isFulfilled: true }]);
    
    // Remove from requests in process
    setRequestsInProcess(prev => prev.filter(r => r.id !== requestId));

    // Update tracking statistics
    setTotalRequestsGranted(prev => prev + 1);
    setWeeklyStats(prev => ({ ...prev, requestsGranted: prev.requestsGranted + 1 }));
  };

  // Toggle in-app notification status for a joiner
  const toggleJoinerInAppNotification = (joinerId: string) => {
    const updatedJoiners = newJoiners.map(joiner => 
      joiner.id === joinerId ? 
        { ...joiner, isInAppNotificationSent: !joiner.isInAppNotificationSent } : 
        joiner
    );
    
    // Check if both notifications are sent
    const joiner = updatedJoiners.find(j => j.id === joinerId);
    if (joiner && joiner.isInAppNotificationSent && joiner.isEmailNotificationSent) {
      // Move to recent joiners
      setRecentJoiners(prev => [...prev, joiner]);
      // Remove from new joiners
      setNewJoiners(updatedJoiners.filter(j => j.id !== joinerId));
    } else {
      setNewJoiners(updatedJoiners);
    }
  };

  // Toggle email notification status for a joiner
  const toggleJoinerEmailNotification = (joinerId: string) => {
    const updatedJoiners = newJoiners.map(joiner => 
      joiner.id === joinerId ? 
        { ...joiner, isEmailNotificationSent: !joiner.isEmailNotificationSent } : 
        joiner
    );
    
    // Check if both notifications are sent
    const joiner = updatedJoiners.find(j => j.id === joinerId);
    if (joiner && joiner.isInAppNotificationSent && joiner.isEmailNotificationSent) {
      // Move to recent joiners
      setRecentJoiners(prev => [...prev, joiner]);
      // Remove from new joiners
      setNewJoiners(updatedJoiners.filter(j => j.id !== joinerId));
    } else {
      setNewJoiners(updatedJoiners);
    }
  };

  // Complete a fulfill request
  const completeFulfillRequest = (requestId: string) => {
    setFulfillRequests(prev => prev.filter(r => r.id !== requestId));
  };

  // Add a custom responsible person
  const addCustomResponsiblePerson = (name: string): ResponsiblePerson => {
    const randomColor = personColors[Math.floor(Math.random() * personColors.length)];
    const newPerson: ResponsiblePerson = {
      id: Date.now().toString(),
      name,
      color: randomColor
    };
    
    setResponsiblePersons(prev => [...prev, newPerson]);
    return newPerson;
  };

  // Add a weekly nudge
  const addWeeklyNudge = () => {
    const currentWeek = getWeekNumber();
    const currentYear = new Date().getFullYear();
    
    // Find if we have an entry for this week
    const existingWeek = weeklyNudges.find(nudge => 
      nudge.week === currentWeek && nudge.year === currentYear
    );
    
    if (existingWeek) {
      // Update existing week count
      setWeeklyNudges(prev => prev.map(nudge => 
        nudge.week === currentWeek && nudge.year === currentYear
          ? { ...nudge, count: nudge.count + 1 }
          : nudge
      ));
    } else {
      // Create new week entry
      setWeeklyNudges(prev => [...prev, {
        week: currentWeek,
        count: 1,
        year: currentYear
      }]);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        newRequests,
        requestsInProcess,
        newJoiners,
        fulfillRequests,
        motiusAsks,
        onboardingList,
        fulfilledRequests,
        recentJoiners,
        responsiblePersons,
        weeklyNudges,
        weeklyStats,
        totalRequestsGranted,
        addNewRequest,
        addNewJoiner,
        addMotiusAsk,
        addOnboardingContact,
        assignResponsibleToRequest,
        removeResponsibleFromRequest,
        assignResponsibleToJoiner,
        markRequestFulfilled,
        toggleJoinerInAppNotification,
        toggleJoinerEmailNotification,
        completeFulfillRequest,
        addCustomResponsiblePerson,
        addWeeklyNudge
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
