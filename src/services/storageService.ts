import { Pet, CareTask, HealthLog, Medication, Expense, ChatMessage, UserProfile } from '../types';
import { firestoreService } from './firestoreService';

class StorageService {
  private currentUserId: string = 'guest';

  setCurrentUserId(uid: string | null) {
    this.currentUserId = uid || 'guest';
  }

  getCurrentUserId(): string {
    return this.currentUserId;
  }

  private getKey(prefix: string): string {
    return `${prefix}_${this.currentUserId}`;
  }

  private get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent('smartcare_storage_change', { detail: { key, value } }));
    } catch (e) {
      console.error('Storage set error', e);
    }
  }

  // PETS
  getPets(): Pet[] {
    return this.get<Pet[]>(this.getKey('smartcare_pets'), []);
  }

  async syncPetsFromCloud(userId: string): Promise<Pet[]> {
    this.setCurrentUserId(userId);
    try {
      const cloudPets = await firestoreService.getUserPets(userId);
      if (cloudPets && cloudPets.length > 0) {
        this.set(this.getKey('smartcare_pets'), cloudPets);
        return cloudPets;
      } else {
        // If Firestore has no pets yet, check if local storage had pets created and sync them to Firestore
        const localPets = this.getPets();
        if (localPets.length > 0 && userId !== 'guest') {
          for (const pet of localPets) {
            await firestoreService.savePet(userId, pet);
          }
        }
        return localPets;
      }
    } catch (e) {
      console.warn('Sync pets from cloud error:', e);
      return this.getPets();
    }
  }

  savePets(pets: Pet[]): void {
    this.set(this.getKey('smartcare_pets'), pets);
    if (this.currentUserId && this.currentUserId !== 'guest') {
      pets.forEach(p => firestoreService.savePet(this.currentUserId, p));
    }
  }

  async deletePet(petId: string): Promise<void> {
    const pets = this.getPets().filter(p => p.id !== petId);
    this.set(this.getKey('smartcare_pets'), pets);
    if (this.currentUserId && this.currentUserId !== 'guest') {
      await firestoreService.deletePet(this.currentUserId, petId);
    }
  }

  getActivePetId(): string | null {
    const pets = this.getPets();
    if (pets.length === 0) return null;
    const active = this.get<string | null>(this.getKey('smartcare_active_pet_id'), null);
    if (active && pets.some(p => p.id === active)) {
      return active;
    }
    return pets[0]?.id || null;
  }

  setActivePetId(id: string | null): void {
    this.set(this.getKey('smartcare_active_pet_id'), id);
  }

  // CARE TASKS
  getCareTasks(petId: string): CareTask[] {
    const all = this.get<Record<string, CareTask[]>>(this.getKey('smartcare_care_tasks'), {});
    return all[petId] || [];
  }

  async syncCareTasksFromCloud(userId: string, petId: string): Promise<CareTask[]> {
    try {
      const cloudTasks = await firestoreService.getCareTasks(userId, petId);
      if (cloudTasks && cloudTasks.length > 0) {
        const all = this.get<Record<string, CareTask[]>>(this.getKey('smartcare_care_tasks'), {});
        all[petId] = cloudTasks;
        this.set(this.getKey('smartcare_care_tasks'), all);
        return cloudTasks;
      }
    } catch (e) {}
    return this.getCareTasks(petId);
  }

  saveCareTasks(petId: string, tasks: CareTask[]): void {
    const all = this.get<Record<string, CareTask[]>>(this.getKey('smartcare_care_tasks'), {});
    all[petId] = tasks;
    this.set(this.getKey('smartcare_care_tasks'), all);
    if (this.currentUserId && this.currentUserId !== 'guest') {
      firestoreService.saveCareTasks(this.currentUserId, petId, tasks);
    }
  }

  // HEALTH LOGS
  getHealthLogs(petId: string): HealthLog[] {
    const all = this.get<HealthLog[]>(this.getKey('smartcare_health_logs'), []);
    return all.filter(l => l.petId === petId);
  }

  async syncHealthLogsFromCloud(userId: string, petId: string): Promise<HealthLog[]> {
    try {
      const cloudLogs = await firestoreService.getHealthLogs(userId, petId);
      if (cloudLogs && cloudLogs.length > 0) {
        const all = this.get<HealthLog[]>(this.getKey('smartcare_health_logs'), []);
        const filtered = all.filter(l => l.petId !== petId);
        const merged = [...cloudLogs, ...filtered];
        this.set(this.getKey('smartcare_health_logs'), merged);
        return cloudLogs;
      }
    } catch (e) {}
    return this.getHealthLogs(petId);
  }

  saveHealthLog(log: HealthLog): void {
    const all = this.get<HealthLog[]>(this.getKey('smartcare_health_logs'), []);
    const existingIndex = all.findIndex(l => l.id === log.id);
    if (existingIndex >= 0) {
      all[existingIndex] = log;
    } else {
      all.unshift(log);
    }
    this.set(this.getKey('smartcare_health_logs'), all);
    if (this.currentUserId && this.currentUserId !== 'guest') {
      firestoreService.saveHealthLog(this.currentUserId, log.petId, log);
    }
  }

  deleteHealthLog(id: string): void {
    const all = this.get<HealthLog[]>(this.getKey('smartcare_health_logs'), []);
    this.set(this.getKey('smartcare_health_logs'), all.filter(l => l.id !== id));
  }

  // MEDICATIONS
  getMedications(petId: string): Medication[] {
    const all = this.get<Medication[]>(this.getKey('smartcare_medications'), []);
    return all.filter(m => m.petId === petId);
  }

  async syncMedicationsFromCloud(userId: string, petId: string): Promise<Medication[]> {
    try {
      const cloudMeds = await firestoreService.getMedications(userId, petId);
      if (cloudMeds && cloudMeds.length > 0) {
        const all = this.get<Medication[]>(this.getKey('smartcare_medications'), []);
        const filtered = all.filter(m => m.petId !== petId);
        const merged = [...cloudMeds, ...filtered];
        this.set(this.getKey('smartcare_medications'), merged);
        return cloudMeds;
      }
    } catch (e) {}
    return this.getMedications(petId);
  }

  saveMedication(med: Medication): void {
    const all = this.get<Medication[]>(this.getKey('smartcare_medications'), []);
    const existingIndex = all.findIndex(m => m.id === med.id);
    if (existingIndex >= 0) {
      all[existingIndex] = med;
    } else {
      all.unshift(med);
    }
    this.set(this.getKey('smartcare_medications'), all);
    if (this.currentUserId && this.currentUserId !== 'guest') {
      firestoreService.saveMedication(this.currentUserId, med.petId, med);
    }
  }

  // EXPENSES
  getExpenses(petId: string): Expense[] {
    const all = this.get<Expense[]>(this.getKey('smartcare_expenses'), []);
    return all.filter(e => e.petId === petId);
  }

  async syncExpensesFromCloud(userId: string, petId: string): Promise<Expense[]> {
    try {
      const cloudExps = await firestoreService.getExpenses(userId, petId);
      if (cloudExps && cloudExps.length > 0) {
        const all = this.get<Expense[]>(this.getKey('smartcare_expenses'), []);
        const filtered = all.filter(e => e.petId !== petId);
        const merged = [...cloudExps, ...filtered];
        this.set(this.getKey('smartcare_expenses'), merged);
        return cloudExps;
      }
    } catch (e) {}
    return this.getExpenses(petId);
  }

  saveExpense(expense: Expense): void {
    const all = this.get<Expense[]>(this.getKey('smartcare_expenses'), []);
    all.unshift(expense);
    this.set(this.getKey('smartcare_expenses'), all);
    if (this.currentUserId && this.currentUserId !== 'guest') {
      firestoreService.saveExpense(this.currentUserId, expense.petId, expense);
    }
  }

  deleteExpense(id: string): void {
    const all = this.get<Expense[]>(this.getKey('smartcare_expenses'), []);
    this.set(this.getKey('smartcare_expenses'), all.filter(e => e.id !== id));
  }

  // CHAT HISTORY
  getChatMessages(petId: string): ChatMessage[] {
    const all = this.get<Record<string, ChatMessage[]>>(this.getKey('smartcare_chat_messages'), {});
    return all[petId] || [];
  }

  async syncChatFromCloud(userId: string, petId: string): Promise<ChatMessage[]> {
    try {
      const cloudMsgs = await firestoreService.getChatHistory(userId, petId);
      if (cloudMsgs && cloudMsgs.length > 0) {
        const all = this.get<Record<string, ChatMessage[]>>(this.getKey('smartcare_chat_messages'), {});
        all[petId] = cloudMsgs;
        this.set(this.getKey('smartcare_chat_messages'), all);
        return cloudMsgs;
      }
    } catch (e) {}
    return this.getChatMessages(petId);
  }

  saveChatMessage(petId: string, message: ChatMessage): void {
    const all = this.get<Record<string, ChatMessage[]>>(this.getKey('smartcare_chat_messages'), {});
    if (!all[petId]) {
      all[petId] = [];
    }
    all[petId].push(message);
    this.set(this.getKey('smartcare_chat_messages'), all);
    if (this.currentUserId && this.currentUserId !== 'guest') {
      firestoreService.saveChatMessage(this.currentUserId, petId, message);
    }
  }

  // USER PROFILE
  getUserProfile(): UserProfile | null {
    return this.get<UserProfile | null>('smartcare_active_user_session', null);
  }

  saveUserProfile(profile: UserProfile | null): void {
    if (profile) {
      this.setCurrentUserId(profile.uid);
      this.set('smartcare_active_user_session', profile);
    } else {
      localStorage.removeItem('smartcare_active_user_session');
      this.setCurrentUserId('guest');
    }
  }

  clearUserSession(): void {
    localStorage.removeItem('smartcare_active_user_session');
    this.setCurrentUserId('guest');
    window.dispatchEvent(new CustomEvent('smartcare_storage_reset'));
  }
}

export const storage = new StorageService();