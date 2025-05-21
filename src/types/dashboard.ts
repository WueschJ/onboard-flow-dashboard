
export type ResponsiblePerson = {
  id: string;
  name: string;
  color: string;
};

export type RequestItem = {
  id: string;
  requestText: string;
  personName: string;
  email: string;
  note: string;
  date: string;
  responsiblePersons: ResponsiblePerson[];
  isFulfilled: boolean;
};

export type JoinerItem = {
  id: string;
  name: string;
  company: string;
  email: string;
  responsiblePerson?: ResponsiblePerson;
  isInAppNotificationSent: boolean;
  isEmailNotificationSent: boolean;
  creationDate: string;
};

export type FulfillRequestItem = {
  id: string;
  name: string;
  requestText: string;
  email: string;
  isCompleted: boolean;
};

export type OnboardingContact = {
  id: string;
  name: string;
  email: string;
  company: string;
  responsiblePerson?: ResponsiblePerson;
  isCompleted: boolean;
};

export type WeeklyNudge = {
  week: number;
  count: number;
  year: number;
};
