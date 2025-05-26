import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  RequestItem, 
  JoinerItem, 
  NominationItem,
  FulfillRequestItem, 
  OnboardingContact,
  ResponsiblePerson,
  WeeklyNudge,
  NewsItem
} from '../types/dashboard';

type DashboardContextType = {
  newRequests: RequestItem[];
  requestsInProcess: RequestItem[];
  newJoiners: JoinerItem[];
  nominations: NominationItem[];
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
  newsItems: NewsItem[];
  addNewsItem: (news: Omit<NewsItem, 'id'>) => void;
  updateNewsItem: (news: NewsItem) => void;
  deleteNewsItem: (newsId: string) => void;
  addNewRequest: (request: Omit<RequestItem, 'id' | 'isFulfilled' | 'responsiblePersons'>) => void;
  addNewJoiner: (joiner: Omit<JoinerItem, 'id' | 'isInAppNotificationSent' | 'isEmailNotificationSent' | 'creationDate'>) => void;
  addNomination: (nomination: Omit<NominationItem, 'id' | 'isCompleted' | 'creationDate'>) => void;
  addMotiusAsk: (ask: Omit<RequestItem, 'id' | 'isFulfilled' | 'responsiblePersons'>) => void;
  addOnboardingContact: (contact: Omit<OnboardingContact, 'id' | 'isCompleted'>, responsiblePersonId?: string) => void;
  assignResponsibleToRequest: (requestId: string, personId: string, isMotiusAsk?: boolean) => void;
  removeResponsibleFromRequest: (requestId: string, personId: string, isMotiusAsk?: boolean) => void;
  assignResponsibleToJoiner: (joinerId: string, personId: string) => void;
  assignResponsibleToNomination: (nominationId: string, personId: string) => void;
  markRequestFulfilled: (requestId: string) => void;
  toggleJoinerInAppNotification: (joinerId: string) => void;
  toggleJoinerEmailNotification: (joinerId: string) => void;
  toggleNominationInAppNotification: (nominationId: string) => void;
  toggleNominationEmailNotification: (nominationId: string) => void;
  completeFulfillRequest: (requestId: string) => void;
  addCustomResponsiblePerson: (name: string) => ResponsiblePerson;
  addWeeklyNudge: () => void;
  completeOnboardingContact: (contactId: string) => void;
  completeNomination: (nominationId: string) => void;
  updateRequest: (request: RequestItem) => void;
  deleteRequest: (requestId: string) => void;
  updateFulfillRequest: (request: FulfillRequestItem) => void;
  deleteFulfillRequest: (requestId: string) => void;
  updateFulfilledRequest: (request: RequestItem) => void;
  deleteFulfilledRequest: (requestId: string) => void;
  updateRecentJoiner: (joiner: JoinerItem) => void;
  deleteRecentJoiner: (joinerId: string) => void;
  returnRequestToProcess: (requestId: string) => void;
  returnJoinerToBoard: (joinerId: string) => void;
  updateJoiner: (joiner: JoinerItem) => void;
  deleteJoiner: (joinerId: string) => void;
  updateNomination: (nomination: NominationItem) => void;
  deleteNomination: (nominationId: string) => void;
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

// Local storage keys
const STORAGE_KEYS = {
  NEW_REQUESTS: 'dashboard_new_requests',
  NEW_JOINERS: 'dashboard_new_joiners',
  NOMINATIONS: 'dashboard_nominations',
  MOTIUS_ASKS: 'dashboard_motius_asks',
  ONBOARDING_LIST: 'dashboard_onboarding_list',
  FULFILLED_REQUESTS: 'dashboard_fulfilled_requests',
  RECENT_JOINERS: 'dashboard_recent_joiners',
  REQUESTS_IN_PROCESS: 'dashboard_requests_in_process',
  RESPONSIBLE_PERSONS: 'dashboard_responsible_persons',
  WEEKLY_STATS: 'dashboard_weekly_stats',
  TOTAL_REQUESTS_GRANTED: 'dashboard_total_requests_granted',
  NEWS_ITEMS: 'dashboard_news_items'
};

// Load data from localStorage with fallback
const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

// Save data to localStorage
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Handle storage errors silently
  }
};

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
    isEmailNotificationSent: false,
    creationDate: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Lisa Chen',
    company: 'Global Tech',
    email: 'lisa.chen@globaltech.com',
    isInAppNotificationSent: false,
    isEmailNotificationSent: false,
    creationDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
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

const initialNominations: NominationItem[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    company: 'Tech Innovations',
    isCompleted: false,
    creationDate: new Date().toISOString()
  }
];

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load data from localStorage with fallback
  const [newRequests, setNewRequests] = useState<RequestItem[]>(() => 
    loadFromStorage(STORAGE_KEYS.NEW_REQUESTS, initialNewRequests)
  );
  const [requestsInProcess, setRequestsInProcess] = useState<RequestItem[]>(() => 
    loadFromStorage(STORAGE_KEYS.REQUESTS_IN_PROCESS, [])
  );
  const [newJoiners, setNewJoiners] = useState<JoinerItem[]>(() => 
    loadFromStorage(STORAGE_KEYS.NEW_JOINERS, initialNewJoiners)
  );
  const [nominations, setNominations] = useState<NominationItem[]>(() => 
    loadFromStorage(STORAGE_KEYS.NOMINATIONS, initialNominations)
  );
  const [fulfillRequests, setFulfillRequests] = useState<FulfillRequestItem[]>([]);
  const [motiusAsks, setMotiusAsks] = useState<RequestItem[]>(() => 
    loadFromStorage(STORAGE_KEYS.MOTIUS_ASKS, initialMotiusAsks)
  );
  const [onboardingList, setOnboardingList] = useState<OnboardingContact[]>(() => 
    loadFromStorage(STORAGE_KEYS.ONBOARDING_LIST, [])
  );
  const [fulfilledRequests, setFulfilledRequests] = useState<RequestItem[]>(() => 
    loadFromStorage(STORAGE_KEYS.FULFILLED_REQUESTS, [])
  );
  const [recentJoiners, setRecentJoiners] = useState<JoinerItem[]>(() => 
    loadFromStorage(STORAGE_KEYS.RECENT_JOINERS, [])
  );
  const [responsiblePersons, setResponsiblePersons] = useState<ResponsiblePerson[]>(() => 
    loadFromStorage(STORAGE_KEYS.RESPONSIBLE_PERSONS, initialResponsiblePersons)
  );
  const [weeklyNudges, setWeeklyNudges] = useState<WeeklyNudge[]>(initialWeeklyNudges);
  const [weeklyStats, setWeeklyStats] = useState(() => 
    loadFromStorage(STORAGE_KEYS.WEEKLY_STATS, { newRequests: 0, newJoiners: 0, requestsGranted: 0 })
  );
  const [totalRequestsGranted, setTotalRequestsGranted] = useState(() => 
    loadFromStorage(STORAGE_KEYS.TOTAL_REQUESTS_GRANTED, 0)
  );
  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => 
    loadFromStorage(STORAGE_KEYS.NEWS_ITEMS, [])
  );

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NEW_REQUESTS, newRequests);
  }, [newRequests]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.REQUESTS_IN_PROCESS, requestsInProcess);
  }, [requestsInProcess]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NEW_JOINERS, newJoiners);
  }, [newJoiners]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOMINATIONS, nominations);
  }, [nominations]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MOTIUS_ASKS, motiusAsks);
  }, [motiusAsks]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ONBOARDING_LIST, onboardingList);
  }, [onboardingList]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FULFILLED_REQUESTS, fulfilledRequests);
  }, [fulfilledRequests]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.RECENT_JOINERS, recentJoiners);
  }, [recentJoiners]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.RESPONSIBLE_PERSONS, responsiblePersons);
  }, [responsiblePersons]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.WEEKLY_STATS, weeklyStats);
  }, [weeklyStats]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TOTAL_REQUESTS_GRANTED, totalRequestsGranted);
  }, [totalRequestsGranted]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NEWS_ITEMS, newsItems);
  }, [newsItems]);

  // Generate Fulfill Requests based on New Requests and Requests in Process
  useEffect(() => {
    const allRequests = [...newRequests, ...requestsInProcess];
    const generatedFulfillRequests = allRequests.map(request => ({
      id: request.id,
      name: request.personName,
      requestText: request.requestText,
      email: request.email,
      isCompleted: false
    }));
    
    // Keep existing fulfill requests that are not in newRequests or requestsInProcess
    // (this preserves any fulfill requests that were kept after a request was fulfilled)
    const existingFulfillRequests = fulfillRequests.filter(item => 
      !allRequests.some(request => request.id === item.id)
    );
    
    setFulfillRequests([...generatedFulfillRequests, ...existingFulfillRequests]);
  }, [newRequests, requestsInProcess]);

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
  const addNewJoiner = (joiner: Omit<JoinerItem, 'id' | 'isInAppNotificationSent' | 'isEmailNotificationSent' | 'creationDate'>) => {
    const newJoiner: JoinerItem = {
      id: Date.now().toString(),
      ...joiner,
      isInAppNotificationSent: false,
      isEmailNotificationSent: false,
      creationDate: new Date().toISOString()
    };
    setNewJoiners(prev => [...prev, newJoiner]);
    
    // Update weekly stats
    setWeeklyStats(prev => ({ ...prev, newJoiners: prev.newJoiners + 1 }));
  };

  // Add a nomination
  const addNomination = (nomination: Omit<NominationItem, 'id' | 'isCompleted' | 'creationDate'>) => {
    const newNomination: NominationItem = {
      id: Date.now().toString(),
      ...nomination,
      isCompleted: false,
      creationDate: new Date().toISOString()
    };
    setNominations(prev => [...prev, newNomination]);
  };

  // Complete a nomination
  const completeNomination = (nominationId: string) => {
    setNominations(prev => prev.filter(nomination => nomination.id !== nominationId));
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
  const addOnboardingContact = (contact: Omit<OnboardingContact, 'id' | 'isCompleted'>, responsiblePersonId?: string) => {
    let responsiblePerson: ResponsiblePerson | undefined;
    
    if (responsiblePersonId) {
      responsiblePerson = responsiblePersons.find(p => p.id === responsiblePersonId);
    }
    
    const newContact: OnboardingContact = {
      id: Date.now().toString(),
      ...contact,
      responsiblePerson,
      isCompleted: false
    };
    setOnboardingList(prev => [...prev, newContact]);
  };

  // Assign a responsible person to a request
  const assignResponsibleToRequest = (requestId: string, personId: string, isMotiusAsk: boolean = false) => {
    const person = responsiblePersons.find(p => p.id === personId);
    if (!person) return;

    // Find if the request is in newRequests, requestsInProcess, or motiusAsks
    let requestFound = isMotiusAsk 
      ? motiusAsks.find(r => r.id === requestId) 
      : newRequests.find(r => r.id === requestId);
    
    let sourceCollection = isMotiusAsk ? 'motiusAsks' : 'newRequests';

    if (!requestFound) {
      requestFound = requestsInProcess.find(r => r.id === requestId);
      sourceCollection = 'requestsInProcess';
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

    if (sourceCollection === 'motiusAsks') {
      // Remove from motius asks
      setMotiusAsks(prev => prev.filter(r => r.id !== requestId));
      
      // Add to requests in process
      setRequestsInProcess(prev => [...prev, updatedRequestWithPerson]);
    } else if (sourceCollection === 'newRequests') {
      // Remove from new requests
      setNewRequests(prev => prev.filter(r => r.id !== requestId));
      
      // Add to requests in process
      setRequestsInProcess(prev => [...prev, updatedRequestWithPerson]);
    } else {
      // Update in requests in process
      setRequestsInProcess(prev => prev.map(r => 
        r.id === requestId ? updatedRequestWithPerson : r
      ));
    }
  };

  // Remove a responsible person from a request
  const removeResponsibleFromRequest = (requestId: string, personId: string, isMotiusAsk: boolean = false) => {
    // Only look in requestsInProcess since responsible persons are only in that list
    const request = requestsInProcess.find(r => r.id === requestId);
    if (!request) return;

    const updatedRequestWithoutPerson = {
      ...request,
      responsiblePersons: request.responsiblePersons.filter(p => p.id !== personId)
    };

    // If no responsible persons left, move back to original collection
    if (updatedRequestWithoutPerson.responsiblePersons.length === 0) {
      // Remove from requests in process
      setRequestsInProcess(prev => prev.filter(r => r.id !== requestId));
      
      // Add back to original collection
      if (isMotiusAsk) {
        setMotiusAsks(prev => [...prev, updatedRequestWithoutPerson]);
      } else {
        setNewRequests(prev => [...prev, updatedRequestWithoutPerson]);
      }
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

  // Assign a responsible person to a nomination
  const assignResponsibleToNomination = (nominationId: string, personId: string) => {
    const person = responsiblePersons.find(p => p.id === personId);
    if (!person) return;

    const updatedNominations = nominations.map(nomination => 
      nomination.id === nominationId ? { ...nomination, responsiblePerson: person } : nomination
    );
    setNominations(updatedNominations);
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

  // Toggle in-app notification status for a nomination
  const toggleNominationInAppNotification = (nominationId: string) => {
    const updatedNominations = nominations.map(nomination => 
      nomination.id === nominationId ? 
        { ...nomination, isInAppNotificationSent: !nomination.isInAppNotificationSent } : 
        nomination
    );
    setNominations(updatedNominations);
  };

  // Toggle email notification status for a nomination
  const toggleNominationEmailNotification = (nominationId: string) => {
    const updatedNominations = nominations.map(nomination => 
      nomination.id === nominationId ? 
        { ...nomination, isEmailNotificationSent: !nomination.isEmailNotificationSent } : 
        nomination
    );
    setNominations(updatedNominations);
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

  // Complete an onboarding contact
  const completeOnboardingContact = (contactId: string) => {
    const updatedOnboardingList = onboardingList.filter(contact => contact.id !== contactId);
    setOnboardingList(updatedOnboardingList);
  };

  // Complete a nomination
  const completeNomination = (nominationId: string) => {
    setNominations(prev => prev.filter(nomination => nomination.id !== nominationId));
  };

  // Update a request
  const updateRequest = (request: RequestItem) => {
    if (request.responsiblePersons.length > 0) {
      // Update in requests in process
      setRequestsInProcess(prev => prev.map(r => 
        r.id === request.id ? request : r
      ));
    } else {
      // Update in new requests or motius asks
      if (newRequests.some(r => r.id === request.id)) {
        setNewRequests(prev => prev.map(r => 
          r.id === request.id ? request : r
        ));
      } else {
        setMotiusAsks(prev => prev.map(r => 
          r.id === request.id ? request : r
        ));
      }
    }
  };

  // Delete a request
  const deleteRequest = (requestId: string) => {
    // Check which collection the request is in and delete from there
    if (newRequests.some(r => r.id === requestId)) {
      setNewRequests(prev => prev.filter(r => r.id !== requestId));
    } else if (requestsInProcess.some(r => r.id === requestId)) {
      setRequestsInProcess(prev => prev.filter(r => r.id !== requestId));
    } else if (motiusAsks.some(r => r.id === requestId)) {
      setMotiusAsks(prev => prev.filter(r => r.id !== requestId));
    }

    // Also remove from fulfill requests if it exists there
    setFulfillRequests(prev => prev.filter(r => r.id !== requestId));
  };

  // Update a fulfill request
  const updateFulfillRequest = (request: FulfillRequestItem) => {
    setFulfillRequests(prev => prev.map(r => 
      r.id === request.id ? request : r
    ));
  };

  // Delete a fulfill request
  const deleteFulfillRequest = (requestId: string) => {
    setFulfillRequests(prev => prev.filter(r => r.id !== requestId));
  };

  // Update a fulfilled request
  const updateFulfilledRequest = (request: RequestItem) => {
    setFulfilledRequests(prev => prev.map(r => 
      r.id === request.id ? request : r
    ));
  };

  // Delete a fulfilled request
  const deleteFulfilledRequest = (requestId: string) => {
    setFulfilledRequests(prev => prev.filter(r => r.id !== requestId));
  };

  // Update a recent joiner
  const updateRecentJoiner = (joiner: JoinerItem) => {
    setRecentJoiners(prev => prev.map(j => 
      j.id === joiner.id ? joiner : j
    ));
  };

  // Delete a recent joiner
  const deleteRecentJoiner = (joinerId: string) => {
    setRecentJoiners(prev => prev.filter(j => j.id !== joinerId));
  };

  // Return a request back to In Process from Fulfilled
  const returnRequestToProcess = (requestId: string) => {
    const request = fulfilledRequests.find(r => r.id === requestId);
    if (!request) return;

    // Remove from fulfilled requests
    setFulfilledRequests(prev => prev.filter(r => r.id !== requestId));

    // Add back to requests in process
    setRequestsInProcess(prev => [...prev, { ...request, isFulfilled: false }]);
  };

  // Return a joiner back to board from Recent Joiners
  const returnJoinerToBoard = (joinerId: string) => {
    const joiner = recentJoiners.find(j => j.id === joinerId);
    if (!joiner) return;

    // Remove from recent joiners
    setRecentJoiners(prev => prev.filter(j => j.id !== joinerId));

    // Add back to new joiners
    setNewJoiners(prev => [...prev, { ...joiner, isInAppNotificationSent: false, isEmailNotificationSent: false }]);
  };

  // Update a joiner in the newJoiners list
  const updateJoiner = (updatedJoiner: JoinerItem) => {
    setNewJoiners(prev => prev.map(j => j.id === updatedJoiner.id ? updatedJoiner : j));
  };
  
  // Delete a joiner from the newJoiners list
  const deleteJoiner = (joinerId: string) => {
    setNewJoiners(prev => prev.filter(j => j.id !== joinerId));
  };

  // Update a nomination
  const updateNomination = (updatedNomination: NominationItem) => {
    setNominations(prev => prev.map(n => n.id === updatedNomination.id ? updatedNomination : n));
  };
  
  // Delete a nomination
  const deleteNomination = (nominationId: string) => {
    setNominations(prev => prev.filter(n => n.id !== nominationId));
  };

  // Add a news item
  const addNewsItem = (news: Omit<NewsItem, 'id'>) => {
    const newItem: NewsItem = {
      id: Date.now().toString(),
      ...news
    };
    setNewsItems(prev => [...prev, newItem]);
  };

  // Update a news item
  const updateNewsItem = (news: NewsItem) => {
    setNewsItems(prev => prev.map(item => 
      item.id === news.id ? news : item
    ));
  };

  // Delete a news item
  const deleteNewsItem = (newsId: string) => {
    setNewsItems(prev => prev.filter(item => item.id !== newsId));
  };

  return (
    <DashboardContext.Provider
      value={{
        newRequests,
        requestsInProcess,
        newJoiners,
        nominations,
        fulfillRequests,
        motiusAsks,
        onboardingList,
        fulfilledRequests,
        recentJoiners,
        responsiblePersons,
        weeklyNudges,
        weeklyStats,
        totalRequestsGranted,
        newsItems,
        addNewsItem,
        updateNewsItem,
        deleteNewsItem,
        addNewRequest,
        addNewJoiner,
        addNomination,
        addMotiusAsk,
        addOnboardingContact,
        assignResponsibleToRequest,
        removeResponsibleFromRequest,
        assignResponsibleToJoiner,
        assignResponsibleToNomination,
        markRequestFulfilled,
        toggleJoinerInAppNotification,
        toggleJoinerEmailNotification,
        toggleNominationInAppNotification,
        toggleNominationEmailNotification,
        completeFulfillRequest,
        addCustomResponsiblePerson,
        addWeeklyNudge,
        completeOnboardingContact,
        completeNomination,
        updateRequest,
        deleteRequest,
        updateFulfillRequest,
        deleteFulfillRequest,
        updateFulfilledRequest,
        deleteFulfilledRequest,
        updateRecentJoiner,
        deleteRecentJoiner,
        returnRequestToProcess,
        returnJoinerToBoard,
        updateJoiner,
        deleteJoiner,
        updateNomination,
        deleteNomination
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
