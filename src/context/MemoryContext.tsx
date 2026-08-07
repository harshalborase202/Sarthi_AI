import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MemoryScope = 'long-term' | 'session';

export interface MemoryItem {
  id: string;
  category: 'About You' | 'Preferences' | 'Scheme Interests';
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

const initialMemories: MemoryItem[] = [
  {
    id: 'm1',
    category: 'About You',
    fact: 'Small/Marginal Farmer in Maharashtra (Cultivable land: 1.5 Ha)',
    sourceContext: 'Initial Profile Setup',
    scope: 'long-term',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'm2',
    category: 'Preferences',
    fact: 'Prefers Direct Benefit Transfer (DBT) bank accounts',
    sourceContext: 'Scheme Filtering',
    scope: 'long-term',
    createdAt: Date.now() - 86400000
  },
  {
    id: 'm3',
    category: 'Scheme Interests',
    fact: 'Queried about Ayushman Bharat PM-JAY health card',
    sourceContext: 'Chat Conversation',
    scope: 'session',
    createdAt: Date.now() - 3600000
  }
];

const initialLogs: ActivityLog[] = [
  {
    id: 'l1',
    action: 'Added',
    description: 'Added: Small/Marginal Farmer profile (Long-term)',
    timestamp: Date.now() - 86400000 * 2
  },
  {
    id: 'l2',
    action: 'Added',
    description: 'Added: DBT Bank account preference (Long-term)',
    timestamp: Date.now() - 86400000
  },
  {
    id: 'l3',
    action: 'Added',
    description: 'Added: Health Card interest (Session)',
    timestamp: Date.now() - 3600000
  }
];

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    const saved = localStorage.getItem('sarkarsaathi_memories');
    return saved ? JSON.parse(saved) : initialMemories;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('sarkarsaathi_logs');
    return saved ? JSON.parse(saved) : initialLogs;
  });

  const [hasSeenOnboarding, setHasSeenOnboardingState] = useState<boolean>(() => {
    return localStorage.getItem('sarkarsaathi_onboarding') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sarkarsaathi_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('sarkarsaathi_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const setHasSeenOnboarding = (val: boolean) => {
    setHasSeenOnboardingState(val);
    localStorage.setItem('sarkarsaathi_onboarding', String(val));
  };

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
    setMemories(prev => [newMemory, ...prev]);
    logActivity('Added', `Added: ${memoryData.fact} (${memoryData.scope})`);
  };

  const updateMemoryScope = (id: string, scope: MemoryScope) => {
    setMemories(prev => prev.map(m => {
      if (m.id === id) {
        logActivity('Scope Changed', `Changed scope to ${scope} for: "${m.fact}"`);
        return { ...m, scope };
      }
      return m;
    }));
  };

  const forgetMemory = (id: string) => {
    const target = memories.find(m => m.id === id);
    if (target) {
      logActivity('Forgotten', `Forgotten: "${target.fact}"`);
      setMemories(prev => prev.filter(m => m.id !== id));
    }
  };

  const clearAllMemories = () => {
    logActivity('Forgotten', 'Cleared all memories');
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
  if (!context) throw new Error('useMemory must be used within MemoryProvider');
  return context;
};
