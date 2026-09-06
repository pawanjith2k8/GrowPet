import { db, auth } from './firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { Pet, CareTask, HealthLog, Medication, Expense, ChatMessage } from '../types';

// Recursively strip out any undefined fields so Firestore SDK never throws serialization errors
function cleanDoc<T extends Record<string, any>>(obj: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        clean[key] = cleanDoc(value);
      } else {
        clean[key] = value;
      }
    }
  }
  return clean;
}

class FirestoreService {
  // PETS
  async getUserPets(userId: string): Promise<Pet[]> {
    if (!userId || userId === 'guest') return [];
    try {
      const petsRef = collection(db, 'users', userId, 'pets');
      const snapshot = await getDocs(petsRef);
      const pets: Pet[] = [];
      snapshot.forEach(docSnap => {
        if (docSnap.exists()) {
          pets.push(docSnap.data() as Pet);
        }
      });
      return pets;
    } catch (e) {
      console.warn('Firestore getUserPets warning:', e);
      return [];
    }
  }

  // Real-time live listener for multi-browser instant sync
  subscribeToUserPets(userId: string, onUpdate: (pets: Pet[]) => void): Unsubscribe | null {
    if (!userId || userId === 'guest') return null;
    try {
      const petsRef = collection(db, 'users', userId, 'pets');
      return onSnapshot(
        petsRef,
        snapshot => {
          const pets: Pet[] = [];
          snapshot.forEach(docSnap => {
            if (docSnap.exists()) {
              pets.push(docSnap.data() as Pet);
            }
          });
          onUpdate(pets);
        },
        err => {
          console.warn('Pets live sync listener notice:', err);
        }
      );
    } catch (err) {
      return null;
    }
  }

  async savePet(userId: string, pet: Pet): Promise<void> {
    if (!userId || userId === 'guest' || !pet?.id) return;
    try {
      const petRef = doc(db, 'users', userId, 'pets', pet.id);
      const sanitized = cleanDoc(pet);
      await setDoc(petRef, sanitized, { merge: true });
    } catch (e) {
      console.warn('Firestore savePet warning:', e);
    }
  }

  async deletePet(userId: string, petId: string): Promise<void> {
    if (!userId || userId === 'guest' || !petId) return;
    try {
      const petRef = doc(db, 'users', userId, 'pets', petId);
      await deleteDoc(petRef);
    } catch (e) {
      console.warn('Firestore deletePet warning:', e);
    }
  }

  // CARE TASKS
  async getCareTasks(userId: string, petId: string): Promise<CareTask[]> {
    if (!userId || userId === 'guest' || !petId) return [];
    try {
      const tasksRef = collection(db, 'users', userId, 'pets', petId, 'careTasks');
      const snapshot = await getDocs(tasksRef);
      const tasks: CareTask[] = [];
      snapshot.forEach(docSnap => {
        if (docSnap.exists()) {
          tasks.push(docSnap.data() as CareTask);
        }
      });
      return tasks;
    } catch (e) {
      return [];
    }
  }

  async saveCareTasks(userId: string, petId: string, tasks: CareTask[]): Promise<void> {
    if (!userId || userId === 'guest' || !petId) return;
    try {
      for (const task of tasks) {
        if (task?.id) {
          const taskRef = doc(db, 'users', userId, 'pets', petId, 'careTasks', task.id);
          await setDoc(taskRef, cleanDoc(task), { merge: true });
        }
      }
    } catch (e) {
      console.warn('Firestore saveCareTasks warning:', e);
    }
  }

  // HEALTH LOGS
  async getHealthLogs(userId: string, petId: string): Promise<HealthLog[]> {
    if (!userId || userId === 'guest' || !petId) return [];
    try {
      const logsRef = collection(db, 'users', userId, 'pets', petId, 'healthLogs');
      const snapshot = await getDocs(logsRef);
      const logs: HealthLog[] = [];
      snapshot.forEach(docSnap => {
        if (docSnap.exists()) {
          logs.push(docSnap.data() as HealthLog);
        }
      });
      return logs;
    } catch (e) {
      return [];
    }
  }

  async saveHealthLog(userId: string, petId: string, log: HealthLog): Promise<void> {
    if (!userId || userId === 'guest' || !petId || !log?.id) return;
    try {
      const logRef = doc(db, 'users', userId, 'pets', petId, 'healthLogs', log.id);
      await setDoc(logRef, cleanDoc(log), { merge: true });
    } catch (e) {
      console.warn('Firestore saveHealthLog warning:', e);
    }
  }

  // MEDICATIONS
  async getMedications(userId: string, petId: string): Promise<Medication[]> {
    if (!userId || userId === 'guest' || !petId) return [];
    try {
      const medsRef = collection(db, 'users', userId, 'pets', petId, 'medications');
      const snapshot = await getDocs(medsRef);
      const meds: Medication[] = [];
      snapshot.forEach(docSnap => {
        if (docSnap.exists()) {
          meds.push(docSnap.data() as Medication);
        }
      });
      return meds;
    } catch (e) {
      return [];
    }
  }

  async saveMedication(userId: string, petId: string, med: Medication): Promise<void> {
    if (!userId || userId === 'guest' || !petId || !med?.id) return;
    try {
      const medRef = doc(db, 'users', userId, 'pets', petId, 'medications', med.id);
      await setDoc(medRef, cleanDoc(med), { merge: true });
    } catch (e) {
      console.warn('Firestore saveMedication warning:', e);
    }
  }

  // EXPENSES
  async getExpenses(userId: string, petId: string): Promise<Expense[]> {
    if (!userId || userId === 'guest' || !petId) return [];
    try {
      const expRef = collection(db, 'users', userId, 'pets', petId, 'expenses');
      const snapshot = await getDocs(expRef);
      const exps: Expense[] = [];
      snapshot.forEach(docSnap => {
        if (docSnap.exists()) {
          exps.push(docSnap.data() as Expense);
        }
      });
      return exps;
    } catch (e) {
      return [];
    }
  }

  async saveExpense(userId: string, petId: string, expense: Expense): Promise<void> {
    if (!userId || userId === 'guest' || !petId || !expense?.id) return;
    try {
      const expRef = doc(db, 'users', userId, 'pets', petId, 'expenses', expense.id);
      await setDoc(expRef, cleanDoc(expense), { merge: true });
    } catch (e) {
      console.warn('Firestore saveExpense warning:', e);
    }
  }

  // CHAT HISTORY
  async getChatHistory(userId: string, petId: string): Promise<ChatMessage[]> {
    if (!userId || userId === 'guest' || !petId) return [];
    try {
      const chatRef = collection(db, 'users', userId, 'pets', petId, 'chatHistory');
      const snapshot = await getDocs(chatRef);
      const msgs: ChatMessage[] = [];
      snapshot.forEach(docSnap => {
        if (docSnap.exists()) {
          msgs.push(docSnap.data() as ChatMessage);
        }
      });
      msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      return msgs;
    } catch (e) {
      return [];
    }
  }

  async saveChatMessage(userId: string, petId: string, message: ChatMessage): Promise<void> {
    if (!userId || userId === 'guest' || !petId || !message?.id) return;
    try {
      const msgRef = doc(db, 'users', userId, 'pets', petId, 'chatHistory', message.id);
      await setDoc(msgRef, cleanDoc(message), { merge: true });
    } catch (e) {
      console.warn('Firestore saveChatMessage warning:', e);
    }
  }
}

export const firestoreService = new FirestoreService();