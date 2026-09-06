import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Pet, CareTask, HealthLog, Medication, Expense, ChatMessage } from '../types';
import { storage } from '../services/storageService';
import { firestoreService } from '../services/firestoreService';
import { generateTasksForPet } from '../data/speciesCareTemplates';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

interface PetContextValue {
  pets: Pet[];
  activePet: Pet | null;
  setActivePetId: (id: string | null) => void;
  addPet: (petData: Omit<Pet, 'id' | 'createdAt' | 'moodScore' | 'streakDays'>) => Pet;
  updatePet: (id: string, petData: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  careTasks: CareTask[];
  toggleCareTask: (taskId: string) => void;
  addCareTask: (task: Omit<CareTask, 'id' | 'petId' | 'completed'>) => void;
  healthLogs: HealthLog[];
  addHealthLog: (log: Omit<HealthLog, 'id' | 'petId'>) => void;
  deleteHealthLog: (id: string) => void;
  medications: Medication[];
  addMedication: (med: Omit<Medication, 'id' | 'petId'>) => void;
  toggleMedicationTaken: (id: string) => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'petId'>) => void;
  deleteExpense: (id: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'petId' | 'timestamp'>) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAddPetOpen: boolean;
  openAddPet: () => void;
  closeAddPet: () => void;
}

const PetContext = createContext<PetContextValue | null>(null);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>(() => storage.getPets());
  const [activePetId, setActivePetIdState] = useState<string | null>(() => storage.getActivePetId());
  const [careTasksMap, setCareTasksMap] = useState<Record<string, CareTask[]>>({});
  const [healthLogsList, setHealthLogsList] = useState<HealthLog[]>([]);
  const [medicationsList, setMedicationsList] = useState<Medication[]>([]);
  const [expensesList, setExpensesList] = useState<Expense[]>([]);
  const [chatMessagesMap, setChatMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAddPetOpen, setIsAddPetOpen] = useState<boolean>(false);

  const { showToast } = useToast();

  const loadPetData = useCallback(async (petId: string, userId?: string) => {
    // Initial local read
    setCareTasksMap(prev => ({ ...prev, [petId]: storage.getCareTasks(petId) }));
    setHealthLogsList(storage.getHealthLogs(petId));
    setMedicationsList(storage.getMedications(petId));
    setExpensesList(storage.getExpenses(petId));
    setChatMessagesMap(prev => ({ ...prev, [petId]: storage.getChatMessages(petId) }));

    // Cloud background sync if authenticated
    if (userId && userId !== 'guest') {
      try {
        const [cloudTasks, cloudLogs, cloudMeds, cloudExps, cloudMsgs] = await Promise.all([
          storage.syncCareTasksFromCloud(userId, petId),
          storage.syncHealthLogsFromCloud(userId, petId),
          storage.syncMedicationsFromCloud(userId, petId),
          storage.syncExpensesFromCloud(userId, petId),
          storage.syncChatFromCloud(userId, petId)
        ]);

        if (cloudTasks) setCareTasksMap(prev => ({ ...prev, [petId]: cloudTasks }));
        if (cloudLogs) setHealthLogsList(cloudLogs);
        if (cloudMeds) setMedicationsList(cloudMeds);
        if (cloudExps) setExpensesList(cloudExps);
        if (cloudMsgs) setChatMessagesMap(prev => ({ ...prev, [petId]: cloudMsgs }));
      } catch (e) {
        console.warn('Sync background error:', e);
      }
    }
  }, []);

  // When user auth changes (login/logout/switch user)
  useEffect(() => {
    let isMounted = true;
    const uid = user ? user.uid : 'guest';
    storage.setCurrentUserId(uid);

    // Initial local + cloud sync
    const initialPets = storage.getPets();
    setPets(initialPets);

    const syncUserPets = async () => {
      if (user && user.uid && user.uid !== 'guest') {
        const cloudPets = await storage.syncPetsFromCloud(user.uid);
        if (cloudPets && isMounted) {
          setPets(cloudPets);
          const targetActiveId = cloudPets.some(p => p.id === activePetId)
            ? activePetId
            : cloudPets[0]?.id || null;
          setActivePetIdState(targetActiveId);
          storage.setActivePetId(targetActiveId);
          if (targetActiveId) {
            loadPetData(targetActiveId, user.uid);
          }
        }
      }
    };

    syncUserPets();

    // Subscribe to live multi-browser Firestore changes
    let unsubscribe: (() => void) | null = null;
    if (user && user.uid && user.uid !== 'guest') {
      unsubscribe = firestoreService.subscribeToUserPets(user.uid, (cloudPets) => {
        if (!isMounted) return;
        if (cloudPets && cloudPets.length > 0) {
          setPets(cloudPets);
          storage.savePets(cloudPets);
          setActivePetIdState(prev => {
            const valid = prev && cloudPets.some(p => p.id === prev);
            const nextId = valid ? prev : cloudPets[0].id;
            storage.setActivePetId(nextId);
            return nextId;
          });
        }
      });
    }

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (activePetId) {
      loadPetData(activePetId, user?.uid);
    }
  }, [activePetId, user?.uid, loadPetData]);

  useEffect(() => {
    const handleReset = () => {
      const resetPets = storage.getPets();
      setPets(resetPets);
      const defId = resetPets[0]?.id || null;
      setActivePetIdState(defId);
      if (defId) {
        loadPetData(defId, user?.uid);
      } else {
        setCareTasksMap({});
        setHealthLogsList([]);
        setMedicationsList([]);
        setExpensesList([]);
        setChatMessagesMap({});
      }
    };
    window.addEventListener('smartcare_storage_reset', handleReset);
    return () => window.removeEventListener('smartcare_storage_reset', handleReset);
  }, [loadPetData, user?.uid]);

  const activePet = useMemo(() => {
    return pets.find(p => p.id === activePetId) || pets[0] || null;
  }, [pets, activePetId]);

  const careTasks = useMemo(() => {
    return (activePetId && careTasksMap[activePetId]) || [];
  }, [careTasksMap, activePetId]);

  const chatMessages = useMemo(() => {
    return (activePetId && chatMessagesMap[activePetId]) || [];
  }, [chatMessagesMap, activePetId]);

  const setActivePetId = (id: string | null) => {
    setActivePetIdState(id);
    storage.setActivePetId(id);
    if (id) {
      loadPetData(id);
    }
  };

  const addPet = (petData: Omit<Pet, 'id' | 'createdAt' | 'moodScore' | 'streakDays'>): Pet => {
    const newId = 'pet-' + Date.now();
    const colors = [
      'from-amber-400 to-orange-500',
      'from-emerald-400 to-teal-600',
      'from-cyan-400 to-blue-600',
      'from-purple-400 to-pink-600',
      'from-rose-400 to-red-600',
      'from-indigo-400 to-purple-600'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newPet: Pet = {
      ...petData,
      id: newId,
      createdAt: new Date().toISOString(),
      moodScore: 85,
      streakDays: 1,
      colorTheme: petData.colorTheme || randomColor
    };

    const updatedPets = [...pets, newPet];
    storage.savePets(updatedPets);
    setPets(updatedPets);

    // Generate tailored care plan for species
    const initialTasks = generateTasksForPet(newId, newPet.category);
    storage.saveCareTasks(newId, initialTasks);
    setCareTasksMap(prev => ({ ...prev, [newId]: initialTasks }));

    const welcomeMsg: ChatMessage = {
      id: 'msg-welcome-' + newId,
      petId: newId,
      sender: 'assistant',
      text: 'Hello! I am your species-tailored AI care assistant for **' + newPet.name + '** (' + newPet.species + '). Ask me any questions about feeding, habitat care, behavior, or health symptoms!',
      timestamp: new Date().toISOString()
    };
    storage.saveChatMessage(newId, welcomeMsg);
    setChatMessagesMap(prev => ({ ...prev, [newId]: [welcomeMsg] }));

    setActivePetId(newId);
    setIsAddPetOpen(false);
    showToast('🎉 ' + newPet.name + ' (' + newPet.species + ') added to your pet family!', 'success');
    return newPet;
  };

  const updatePet = (id: string, petData: Partial<Pet>) => {
    const updated = pets.map(p => (p.id === id ? { ...p, ...petData } : p));
    storage.savePets(updated);
    setPets(updated);
    showToast('Pet profile updated!', 'success');
  };

  const deletePet = (id: string) => {
    const updated = pets.filter(p => p.id !== id);
    storage.deletePet(id);
    setPets(updated);
    const nextActive = updated[0]?.id || null;
    setActivePetId(nextActive);
    showToast('Pet profile removed.', 'info');
  };

  const toggleCareTask = (taskId: string) => {
    if (!activePetId) return;
    const current = careTasksMap[activePetId] || [];
    const updated = current.map(t => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined
        };
      }
      return t;
    });

    storage.saveCareTasks(activePetId, updated);
    setCareTasksMap(prev => ({ ...prev, [activePetId]: updated }));

    const completedCount = updated.filter(t => t.completed).length;
    const totalCount = updated.length || 1;
    const completionPct = Math.round((completedCount / totalCount) * 100);
    const newMood = Math.min(100, Math.max(50, 70 + Math.round(completionPct * 0.3)));

    const updatedPets = pets.map(p => (p.id === activePetId ? { ...p, moodScore: newMood } : p));
    storage.savePets(updatedPets);
    setPets(updatedPets);

    if (completedCount === totalCount && totalCount > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast('🎉 All daily care tasks completed for ' + (activePet?.name || 'your pet') + '! Happiness score is at 100%!', 'success');
    }
  };

  const addCareTask = (taskData: Omit<CareTask, 'id' | 'petId' | 'completed'>) => {
    if (!activePetId) return;
    const current = careTasksMap[activePetId] || [];
    const newTask: CareTask = {
      ...taskData,
      id: 'task-' + Date.now(),
      petId: activePetId,
      completed: false
    };
    const updated = [...current, newTask];
    storage.saveCareTasks(activePetId, updated);
    setCareTasksMap(prev => ({ ...prev, [activePetId]: updated }));
    showToast('Daily care task added!', 'success');
  };

  const addHealthLog = (logData: Omit<HealthLog, 'id' | 'petId'>) => {
    if (!activePetId) return;
    const newLog: HealthLog = {
      ...logData,
      id: 'hl-' + Date.now(),
      petId: activePetId
    };
    storage.saveHealthLog(newLog);
    setHealthLogsList(prev => [newLog, ...prev]);

    if (newLog.type === 'weight' && newLog.value) {
      const val = newLog.unit === 'g' ? newLog.value / 1000 : newLog.value;
      const updatedPets = pets.map(p => (p.id === activePetId ? { ...p, weightKg: val } : p));
      storage.savePets(updatedPets);
      setPets(updatedPets);
    }
    showToast('Health record logged successfully!', 'success');
  };

  const deleteHealthLog = (id: string) => {
    storage.deleteHealthLog(id);
    setHealthLogsList(prev => prev.filter(l => l.id !== id));
    showToast('Health log deleted.', 'info');
  };

  const addMedication = (medData: Omit<Medication, 'id' | 'petId'>) => {
    if (!activePetId) return;
    const newMed: Medication = {
      ...medData,
      id: 'med-' + Date.now(),
      petId: activePetId
    };
    storage.saveMedication(newMed);
    setMedicationsList(prev => [newMed, ...prev]);
    showToast('Medication & reminder added!', 'success');
  };

  const toggleMedicationTaken = (id: string) => {
    const med = medicationsList.find(m => m.id === id);
    if (!med) return;
    const updatedMed = { ...med, lastGiven: new Date().toISOString() };
    storage.saveMedication(updatedMed);
    setMedicationsList(prev => prev.map(m => (m.id === id ? updatedMed : m)));
    showToast('Dose logged as given for ' + med.name + '!', 'success');
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'petId'>) => {
    if (!activePetId) return;
    const newExpense: Expense = {
      ...expenseData,
      id: 'exp-' + Date.now(),
      petId: activePetId
    };
    storage.saveExpense(newExpense);
    setExpensesList(prev => [newExpense, ...prev]);
    showToast('Expense recorded!', 'success');
  };

  const deleteExpense = (id: string) => {
    storage.deleteExpense(id);
    setExpensesList(prev => prev.filter(e => e.id !== id));
    showToast('Expense removed.', 'info');
  };

  const addChatMessage = (msgData: Omit<ChatMessage, 'id' | 'petId' | 'timestamp'>) => {
    if (!activePetId) return;
    const newMsg: ChatMessage = {
      ...msgData,
      id: 'msg-' + Date.now(),
      petId: activePetId,
      timestamp: new Date().toISOString()
    };
    storage.saveChatMessage(activePetId, newMsg);
    setChatMessagesMap(prev => ({
      ...prev,
      [activePetId]: [...(prev[activePetId] || []), newMsg]
    }));
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        activePet,
        setActivePetId,
        addPet,
        updatePet,
        deletePet,
        careTasks,
        toggleCareTask,
        addCareTask,
        healthLogs: healthLogsList,
        addHealthLog,
        deleteHealthLog,
        medications: medicationsList,
        addMedication,
        toggleMedicationTaken,
        expenses: expensesList,
        addExpense,
        deleteExpense,
        chatMessages,
        addChatMessage,
        activeTab,
        setActiveTab,
        isAddPetOpen,
        openAddPet: () => setIsAddPetOpen(true),
        closeAddPet: () => setIsAddPetOpen(false)
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePet = (): PetContextValue => {
  const ctx = useContext(PetContext);
  if (!ctx) throw new Error('usePet must be used within PetProvider');
  return ctx;
};