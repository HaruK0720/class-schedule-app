export interface Lesson {
  id: string;
  day: string;
  period: number;
  subject: string;
  room: string;
  teacher: string;
  type: string;
  belongings: string[];

  zoomInfo?: {
    url: string;
    meetingId: string;
    passcode: string;
  };
}

export interface TimeRange {
  start: string;
  end: string;
}