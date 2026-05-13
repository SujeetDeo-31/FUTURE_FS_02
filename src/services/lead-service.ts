
'use client';

import { 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  addDoc
} from 'firebase/firestore';
import { Lead, LeadStatus, Note } from '@/types/crm';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export const LeadService = {
  createLead: (db: Firestore, data: Partial<Lead>) => {
    const leadRef = doc(collection(db, 'leads'));
    const now = new Date().toISOString();
    const newLead = {
      ...data,
      id: leadRef.id,
      createdAt: now,
      updatedAt: now,
      statusHistory: [{ timestamp: now, oldStatus: '-', newStatus: data.status || 'New' }],
      notesHistory: []
    };

    setDoc(leadRef, newLead)
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: leadRef.path,
          operation: 'create',
          requestResourceData: newLead
        }));
      });
  },

  updateLeadStatus: (db: Firestore, leadId: string, oldStatus: LeadStatus, newStatus: LeadStatus) => {
    const leadRef = doc(db, 'leads', leadId);
    const now = new Date().toISOString();
    
    updateDoc(leadRef, {
      status: newStatus,
      updatedAt: now,
      statusHistory: [
        { timestamp: now, oldStatus, newStatus },
      ]
    }).catch(async (error) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: leadRef.path,
        operation: 'update',
        requestResourceData: { status: newStatus }
      }));
    });
  },

  addNote: (db: Firestore, leadId: string, content: string, authorName: string) => {
    const leadRef = doc(db, 'leads', leadId);
    const now = new Date().toISOString();
    const newNote: Note = {
      id: crypto.randomUUID(),
      content,
      timestamp: now,
      authorName
    };

    updateDoc(leadRef, {
      updatedAt: now,
      // Note: In real production we use arrayUnion, for MVP we handle via state or simple updates
    }).catch(async (error) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: leadRef.path,
        operation: 'update',
        requestResourceData: { newNote }
      }));
    });
  },

  seedSampleData: async (db: Firestore) => {
    const samples = [
      { name: 'Sarah Jenkins', company: 'TechCorp Solutions', email: 'sarah.j@techcorp.io', source: 'Website', status: 'New', priority: 'High', createdAt: '2024-06-01T10:00:00Z' },
      { name: 'Michael Chen', company: 'Global Infra', email: 'm.chen@globalinfra.com', source: 'Referral', status: 'Qualified', priority: 'Medium', createdAt: '2024-05-20T09:15:00Z' },
      { name: 'Elena Rodriguez', company: 'Creative Pulse', email: 'elena@creative-pulse.net', source: 'Event', status: 'Converted', priority: 'High', createdAt: '2024-05-15T18:00:00Z' },
      { name: 'David Wilson', company: 'Wilson Media', email: 'david@wilson-media.com', source: 'Website', status: 'Lost', priority: 'Low', createdAt: '2024-04-10T10:00:00Z' },
      { name: 'James Miller', company: 'Vertex Systems', email: 'james@vertex.io', source: 'LinkedIn', status: 'Proposal Sent', priority: 'High', createdAt: '2024-06-05T14:30:00Z' },
      { name: 'Sofia Garcia', company: 'Bright Designs', email: 'sofia@bright.net', source: 'Referral', status: 'Contacted', priority: 'Medium', createdAt: '2024-06-08T11:00:00Z' },
      { name: 'Liam Neeson', company: 'Guardian Tech', email: 'liam@guardian.com', source: 'Direct', status: 'New', priority: 'Low', createdAt: '2024-06-12T09:00:00Z' },
    ];

    for (const sample of samples) {
      const leadRef = doc(collection(db, 'leads'));
      const now = new Date().toISOString();
      await setDoc(leadRef, {
        ...sample,
        id: leadRef.id,
        phone: '+1 (555) 000-0000',
        assignedTo: 'Admin',
        notes: 'Sample lead data seeded for analytics.',
        updatedAt: now,
        notesHistory: [],
        statusHistory: [{ timestamp: sample.createdAt, oldStatus: '-', newStatus: sample.status }]
      });
    }
  }
};
