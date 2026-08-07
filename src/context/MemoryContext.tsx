import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MemoryScope = 'long-term' | 'session';

export interface MemoryItem {
  id: string;
  category: 'About you' | 'Preferences' | 'Interactions';
  fact: string;
  sourceContext: string;
  scope: MemoryScope;
  createdAt: number;
}

export interface ActivityLog {
  id: string;
  action: 'Added' | 'Forgotten' | 'Scope Changed';
  description: string;
  timestamp: number;
}

interface MemoryContextType {
  memories: MemoryItem[];
  activityLogs: ActivityLog[];
  addMemory: (memory: Omit<MemoryItem, 'id' | 'createdAt'>) => void;
  updateMemoryScope: (id: string, scope: MemoryScope) => void;
  forgetMemory: (id: string) => void;
  clearAllMemories: () => void;
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (val: boolean) => void;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    const saved = localStorage.getItem('sathiai_memories');
    return saved ? JSON.parse(saved) : [];
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('sathiai_activity_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [hasSeenOnboarding, setHasSeenOnboardingState] = useState<boolean>(() => {
    return localStorage.getItem('sathiai_onboarding_seen') === 'true';
  });

  // Session memories are cleared on reload, so we filter them out when saving/loading if we wanted to be strict.
  // For demo purposes, we'll keep them in state but they represent "session" conceptually.
  // Real implementation might use sessionStorage for 'session' scope. 
  // Here, we'll just filter them out from localStorage persistence to truly make them session-bound.
  
  useEffect(() => {
    const longTermMemories = memories.filter(m => m.scope === 'long-term');
    localStorage.setItem('sathiai_memories', JSON.stringify(longTermMemories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('sathiai_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const setHasSeenOnboarding = (val: boolean) => {
    setHasSeenOnboardingState(val);
    localStorage.setItem('sathiai_onboarding_seen', String(val));
  }

  const logActivity = (action: ActivityLog['action'], description: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substring(7),
      action,
      description,
      timestamp: Date.now()
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const addMemory = (memoryData: Omit<MemoryItem, 'id' | 'createdAt'>) => {
    const newMemory: MemoryItem = {
      ...memoryData,
      id: Math.random().toString(36).substring(7),
      createdAt: Date.now()
    };
    setMemories(prev => [...prev, newMemory]);
    logActivity('Added', `Memory added: ${memoryData.fact} (${memoryData.scope})`);
  };

  const updateMemoryScope = (id: string, scope: MemoryScope) => {
    setMemories(prev => prev.map(m => {
      if (m.id === id) {
        logActivity('Scope Changed', `Scope changed to ${scope} for: ${m.fact}`);
        return { ...m, scope };
      }
      return m;
    }));
  };

  const forgetMemory = (id: string) => {
    const memory = memories.find(m => m.id === id);
    if (memory) {
      logActivity('Forgotten', `Forgotten: ${memory.fact}`);
      setMemories(prev => prev.filter(m => m.id !== id));
    }
  };

  const clearAllMemories = () => {
    logActivity('Forgotten', 'All memory cleared by user');
    setMemories([]);
  };

  return (
    <MemoryContext.Provider value={{
      memories,
      activityLogs,
      addMemory,
      updateMemoryScope,
      forgetMemory,
      clearAllMemories,
      hasSeenOnboarding,
      setHasSeenOnboarding
    }}>
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (!context) throw new Error('useMemory must be used within a MemoryProvider');
  return context;
};
