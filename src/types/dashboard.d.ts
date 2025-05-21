export interface RequestItem {
  id: string;
  requestText: string;
  personName: string;
  email: string;
  note?: string;
  date: string;
  responsiblePersons: ResponsiblePerson[];
  isFulfilled: boolean;
}

export interface JoinerItem {
  id: string;
  name: string;
  company: string;
  email: string;
  responsiblePerson?: ResponsiblePerson;
  isInAppNotificationSent: boolean;
  isEmailNotificationSent: boolean;
  creationDate: string;
}

export interface FulfillRequestItem {
  id: string;
  name: string;
  requestText: string;
  email: string;
  isCompleted: boolean;
}

export interface OnboardingContact {
  id: string;
  name: string;
  email: string;
  company: string;
  notes?: string;
  responsiblePerson?: ResponsiblePerson;
  isCompleted: boolean;
}

export interface ResponsiblePerson {
  id: string;
  name: string;
  color: string;
}

export interface WeeklyNudge {
  week: number;
  count: number;
  year: number;
}

export interface NewsItem {
  id: string;
  personName: string;
  content: string;
  date: string;
}
