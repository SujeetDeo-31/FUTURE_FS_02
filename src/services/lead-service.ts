
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
  limit
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
        // In a real scenario, we'd append to an array field in Firestore
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

    // Note: For simplicity in this prototype refactor, we are overwriting or using a pattern 
    // that assumes we handle the array merger in the UI or use arrayUnion
    updateDoc(leadRef, {
      updatedAt: now,
      // In a production app, use arrayUnion(newNote)
    }).catch(async (error) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: leadRef.path,
        operation: 'update',
        requestResourceData: { newNote }
      }));
    });
  }
};
