// Category types decide what a category asks for when you add a task.
//   event:    text + start/end time (time switched on by default)
//   dropdown: all-day, pick one option from a list you can grow
//   count:    a whole number, e.g. how many applications
//   text:     free text, start/end time optional
export const TYPES = {
  event:    { name: 'Event',    hint: 'Text plus a start and end time', prompt: 'What is the event?' },
  dropdown: { name: 'Dropdown', hint: 'All-day, pick from a list',      prompt: 'What are you doing?' },
  count:    { name: 'Count',    hint: 'Type in a whole number',         prompt: 'How many?' },
  text:     { name: 'Other',    hint: 'Text, time is optional',         prompt: 'What is the plan?' },
};
export const TYPE_ORDER = ['event', 'dropdown', 'count', 'text'];

export const COLORS = [
  { color: '#1CB0F6', dark: '#1899D6' },
  { color: '#A560E8', dark: '#8A47CC' },
  { color: '#FF9600', dark: '#E08200' },
  { color: '#58CC02', dark: '#46A302' },
  { color: '#FF4B91', dark: '#E0347A' },
  { color: '#00B3A4', dark: '#00968A' },
  { color: '#FF4B4B', dark: '#D93636' },
  { color: '#6C63FF', dark: '#544BE0' },
  { color: '#C47A3A', dark: '#A3612A' },
];

export const ICONS = ['network', 'learning', 'project', 'job', 'house', 'star', 'reminder'];

// The starting categories. Users can rename, recolor, add and remove them; they are saved with the tasks.
export const DEFAULT_CATS = [
  { id: 'network',  name: 'Networking Events', type: 'event',    icon: 'network',  ...COLORS[0], prompt: 'What is the event?' },
  { id: 'learning', name: 'Learning',          type: 'dropdown', icon: 'learning', ...COLORS[1], prompt: 'What are you learning?',
    options: ['Data Analysis', 'Machine Learning video', 'Kaggle', 'AWS Data Certificate'] },
  { id: 'project',  name: 'Project time',      type: 'dropdown', icon: 'project',  ...COLORS[2], prompt: 'Which project?',
    options: ['Homicide-clearance', 'Spaceship titanic', 'Wine Inventory Tracker'] },
  { id: 'job',      name: 'Job Hunt',          type: 'count',    icon: 'job',      ...COLORS[3], prompt: 'How many applications will you send?', unit: 'job application' },
  { id: 'house',    name: 'House work',        type: 'dropdown', icon: 'house',    ...COLORS[4], prompt: 'Which chore?',
    options: ['Laundry', 'Deep cleaning', 'Decorate'] },
  { id: 'others',   name: 'Others',            type: 'text',     icon: 'star',     ...COLORS[5], prompt: 'What is the plan?' },
  { id: 'reminder', name: 'Reminder',          type: 'text',     icon: 'reminder', color: '#FF4B4B', dark: '#D93636', prompt: 'What is extremely important?' },
];

// Shown if a task points at a category that no longer exists.
const MISSING = { id: '', name: 'Uncategorized', type: 'text', icon: 'star', color: '#777F86', dark: '#5E666C', prompt: 'What is the plan?' };
export const catById = (cats, id) => cats.find(c => c.id === id) || MISSING;

export const GOAL = 5; // crowns in a week that trigger the celebration
export const DEFAULT_NAME = 'Natalie';

export const catStyle = cat => ({ '--c': cat.color, '--cd': cat.dark });
export const possessive = n => (/s$/i.test(n) ? `${n}'` : `${n}'s`);
