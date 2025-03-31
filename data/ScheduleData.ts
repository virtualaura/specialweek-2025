export interface EventScheduleItem {
  day: string;
  start_time: string;
  end_time: string;
  event: string;
  location: string;
}

export const eventScheduleData: EventScheduleItem[] = [
  { day: 'Tuesday', start_time: '08:40', end_time: '10:10', event: 'Presentation: Introduction & Planning', location: 'Auditoire' },
  { day: 'Tuesday', start_time: '10:15', end_time: '10:45', event: 'Gouter', location: 'on-site' },
  { day: 'Tuesday', start_time: '10:45', end_time: '11:15', event: 'Presentation: Problem Framing', location: 'Auditoire' },
  { day: 'Tuesday', start_time: '11:15', end_time: '12:00', event: 'Team Work', location: 'on-site' },
  { day: 'Tuesday', start_time: '12:00', end_time: '13:00', event: 'Lunch', location: 'Rosey cafeteria' },
  { day: 'Tuesday', start_time: '13:00', end_time: '13:30', event: 'Presentation: User Feedback', location: 'Auditoire' },
  { day: 'Tuesday', start_time: '13:30', end_time: '15:30', event: 'Team Work', location: 'on-site' },
  { day: 'Wednesday', start_time: '08:40', end_time: '13:00', event: 'Interviews & Box Lunch', location: 'off-site' },
  { day: 'Wednesday', start_time: '13:00', end_time: '13:45', event: 'Team Presentations: Problem Identification', location: 'on-site' },
  { day: 'Wednesday', start_time: '13:45', end_time: '14:15', event: 'Presentation: Developing Solutions', location: 'Auditoire' },
  { day: 'Wednesday', start_time: '14:15', end_time: '15:30', event: 'Team Work', location: 'on-site' },
  { day: 'Thursday', start_time: '08:40', end_time: '09:10', event: 'Presentation: Solution Ideation & Prototyping', location: 'on-site' },
  { day: 'Thursday', start_time: '09:10', end_time: '10:10', event: 'Team Work', location: 'on-site' },  
  { day: 'Thursday', start_time: '10:15', end_time: '10:45', event: 'Gouter', location: 'on-site' },
  { day: 'Thursday', start_time: '10:30', end_time: '12:00', event: 'Team Work', location: 'on-site' },
  { day: 'Thursday', start_time: '12:00', end_time: '12:30', event: 'Presentation: Assessing Pitches', location: 'Auditoire' },
  { day: 'Thursday', start_time: '12:30', end_time: '13:30', event: 'Lunch', location: 'Rosey cafeteria' },
  { day: 'Thursday', start_time: '13:30', end_time: '16:30', event: 'Interviews', location: 'off-site' },
  { day: 'Thursday', start_time: '16:30', end_time: '22:00', event: 'Hackathon', location: 'on-site' },
  { day: 'Friday', start_time: '08:40', end_time: '09:10', event: 'Presentation: Pitch Development', location: 'Auditoire' },
  { day: 'Friday', start_time: '09:10', end_time: '10:15', event: 'Team Work', location: 'on-site' },
  { day: 'Friday', start_time: '10:15', end_time: '10:45', event: 'Gouter', location: 'on-site' },
  { day: 'Friday', start_time: '10:45', end_time: '14:00', event: 'Team Work & Box Lunch', location: 'on-site' },
  { day: 'Friday', start_time: '14:00', end_time: '16:00', event: 'Pitch Event', location: 'Auditoire' }
];
