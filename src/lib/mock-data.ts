
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Converted' | 'Lost';
export type LeadPriority = 'Low' | 'Medium' | 'High';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: LeadStatus;
  priority: LeadPriority;
  assignedTo: string;
  notes: string;
  followUpDate: string;
  createdAt: string;
  updatedAt: string;
  notesHistory: { timestamp: string; content: string }[];
  statusHistory: { timestamp: string; oldStatus: string; newStatus: string }[];
}

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techcorp.io',
    phone: '+1 (555) 012-3456',
    company: 'TechCorp Solutions',
    source: 'Website',
    status: 'New',
    priority: 'High',
    assignedTo: 'Admin',
    notes: 'Interested in enterprise license for her team of 50.',
    followUpDate: '2024-06-15',
    createdAt: '2024-06-01',
    updatedAt: '2024-06-05',
    notesHistory: [
      { timestamp: '2024-06-01T10:00:00Z', content: 'Lead created via website form.' },
      { timestamp: '2024-06-05T14:30:00Z', content: 'Initial discovery call scheduled.' }
    ],
    statusHistory: [
      { timestamp: '2024-06-01T10:00:00Z', oldStatus: '-', newStatus: 'New' }
    ]
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@globalinfra.com',
    phone: '+1 (555) 987-6543',
    company: 'Global Infra',
    source: 'Referral',
    status: 'Qualified',
    priority: 'Medium',
    assignedTo: 'Admin',
    notes: 'Referred by James from Vertex Systems.',
    followUpDate: '2024-06-12',
    createdAt: '2024-05-20',
    updatedAt: '2024-06-02',
    notesHistory: [
      { timestamp: '2024-05-20T09:15:00Z', content: 'Referred by James.' },
      { timestamp: '2024-06-02T16:45:00Z', content: 'Demo completed. High interest in reporting module.' }
    ],
    statusHistory: [
      { timestamp: '2024-05-20T09:15:00Z', oldStatus: '-', newStatus: 'New' },
      { timestamp: '2024-06-02T16:45:00Z', oldStatus: 'New', newStatus: 'Qualified' }
    ]
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena@creative-pulse.net',
    phone: '+1 (555) 444-3322',
    company: 'Creative Pulse',
    source: 'Event',
    status: 'Converted',
    priority: 'High',
    assignedTo: 'Admin',
    notes: 'Met at the SaaS Expo. Signed 1-year contract.',
    followUpDate: '2024-07-01',
    createdAt: '2024-05-15',
    updatedAt: '2024-06-08',
    notesHistory: [
      { timestamp: '2024-05-15T18:00:00Z', content: 'Met at SaaS Expo.' },
      { timestamp: '2024-06-08T11:00:00Z', content: 'Contract signed!' }
    ],
    statusHistory: [
      { timestamp: '2024-05-15T18:00:00Z', oldStatus: '-', newStatus: 'New' },
      { timestamp: '2024-05-22T10:00:00Z', oldStatus: 'New', newStatus: 'Proposal Sent' },
      { timestamp: '2024-06-08T11:00:00Z', oldStatus: 'Proposal Sent', newStatus: 'Converted' }
    ]
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@wilson-media.com',
    phone: '+1 (555) 777-8888',
    company: 'Wilson Media',
    source: 'Website',
    status: 'Lost',
    priority: 'Low',
    assignedTo: 'Admin',
    notes: 'Pricing was too high for their current budget.',
    followUpDate: '',
    createdAt: '2024-04-10',
    updatedAt: '2024-05-01',
    notesHistory: [],
    statusHistory: [
      { timestamp: '2024-04-10T10:00:00Z', oldStatus: '-', newStatus: 'New' },
      { timestamp: '2024-05-01T15:00:00Z', oldStatus: 'New', newStatus: 'Lost' }
    ]
  }
];

export const MOCK_ACTIVITY = [
  { id: '1', type: 'note', leadName: 'Sarah Jenkins', content: 'Added a note about enterprise license', timestamp: '2 hours ago' },
  { id: '2', type: 'status', leadName: 'Elena Rodriguez', content: 'Changed status to Converted', timestamp: '5 hours ago' },
  { id: '3', type: 'lead', leadName: 'John Doe', content: 'New lead arrived via LinkedIn', timestamp: '1 day ago' },
];
