// Categories, their colors, and what each one asks for when you add a task.
export const CATS = {
  network:  { name: 'Networking Events', color: '#1CB0F6', dark: '#1899D6' },
  learning: { name: 'Learning',          color: '#A560E8', dark: '#8A47CC' },
  project:  { name: 'Project time',      color: '#FF9600', dark: '#E08200' },
  job:      { name: 'Job Hunt',          color: '#58CC02', dark: '#46A302' },
  house:    { name: 'House work',        color: '#FF4B91', dark: '#E0347A' },
  others:   { name: 'Others',            color: '#00B3A4', dark: '#00968A' },
};

export const CAT_ORDER = ['network', 'learning', 'project', 'job', 'house', 'others'];

// Categories that use a dropdown.
export const OPTIONS = {
  learning: ['Data Analysis', 'Machine Learning video', 'Kaggle', 'AWS Data Certificate'],
  project:  ['Homicide-clearance', 'Spaceship titanic', 'Wine Inventory Tracker'],
  house:    ['Laundry', 'Deep cleaning', 'Decorate'],
};

export const PROMPTS = {
  network: 'What is the event?',
  learning: 'What are you learning?',
  project: 'Which project?',
  job: 'How many applications will you send?',
  house: 'Which chore?',
  others: 'What is the plan?',
};

export const GOAL = 5; // crowns in a week that trigger the celebration
export const DEFAULT_NAME = 'Natalie';

export const catStyle = c => ({ '--c': CATS[c].color, '--cd': CATS[c].dark });
export const possessive = n => (/s$/i.test(n) ? `${n}'` : `${n}'s`);
