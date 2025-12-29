'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Idea {
  id: number;
  mode: 'draw' | 'write';
  content: string;
}

export interface Evaluation {
  ideaId: number;
  score: number;
  solvesProblem: 'yes' | 'no' | '';
}

interface PlaybookContextType {
  user: {
    name: string;
    age: number;
  };
  step1: {
    problem: string;
    feelings: {
      mode: 'draw' | 'write';
      content: string;
    };
  };
  step2: {
    who: string;
    what: string;
    when: string;
    why: string;
  };
  step3: {
    ideas: Idea[];
  };
  step4: {
    evaluations: Evaluation[];
  };
  step5: {
    bestIdea: {
      mode: 'draw' | 'write';
      content: string;
    };
    ideaName: string;
    summary: string;
  };
  updateUser: (data: Partial<{ name: string; age: number }>) => void;
  updateStep1: (data: Partial<PlaybookContextType['step1']>) => void;
  updateStep2: (data: Partial<PlaybookContextType['step2']>) => void;
  updateStep3: (ideas: Idea[]) => void;
  updateStep4: (evaluations: Evaluation[]) => void;
  updateStep5: (data: Partial<PlaybookContextType['step5']>) => void;
  resetAll: () => void;
  exportData: () => string;
  importData: (json: string) => void;
}

const defaultContext: PlaybookContextType = {
  user: { name: '', age: 0 },
  step1: {
    problem: '',
    feelings: { mode: 'write', content: '' },
  },
  step2: {
    who: '',
    what: '',
    when: '',
    why: '',
  },
  step3: {
    ideas: Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      mode: 'write' as const,
      content: '',
    })),
  },
  step4: {
    evaluations: Array.from({ length: 6 }, (_, i) => ({
      ideaId: i + 1,
      score: 5,
      solvesProblem: '' as const,
    })),
  },
  step5: {
    bestIdea: { mode: 'write', content: '' },
    ideaName: '',
    summary: '',
  },
  updateUser: () => {},
  updateStep1: () => {},
  updateStep2: () => {},
  updateStep3: () => {},
  updateStep4: () => {},
  updateStep5: () => {},
  resetAll: () => {},
  exportData: () => '',
  importData: () => {},
};

const PlaybookContext = createContext<PlaybookContextType>(defaultContext);

export function PlaybookProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(defaultContext.user);
  const [step1, setStep1] = useState(defaultContext.step1);
  const [step2, setStep2] = useState(defaultContext.step2);
  const [step3, setStep3] = useState(defaultContext.step3);
  const [step4, setStep4] = useState(defaultContext.step4);
  const [step5, setStep5] = useState(defaultContext.step5);

  const updateUser = (data: Partial<typeof user>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  const updateStep1 = (data: Partial<typeof step1>) => {
    setStep1(prev => ({ ...prev, ...data }));
  };

  const updateStep2 = (data: Partial<typeof step2>) => {
    setStep2(prev => ({ ...prev, ...data }));
  };

  const updateStep3 = (ideas: Idea[]) => {
    setStep3({ ideas });
  };

  const updateStep4 = (evaluations: Evaluation[]) => {
    setStep4({ evaluations });
  };

  const updateStep5 = (data: Partial<typeof step5>) => {
    setStep5(prev => ({ ...prev, ...data }));
  };

  const resetAll = () => {
    setUser(defaultContext.user);
    setStep1(defaultContext.step1);
    setStep2(defaultContext.step2);
    setStep3(defaultContext.step3);
    setStep4(defaultContext.step4);
    setStep5(defaultContext.step5);
  };

  const exportData = () => {
    return JSON.stringify({ user, step1, step2, step3, step4, step5 });
  };

  const importData = (json: string) => {
    try {
      const data = JSON.parse(json);
      setUser(data.user || defaultContext.user);
      setStep1(data.step1 || defaultContext.step1);
      setStep2(data.step2 || defaultContext.step2);
      setStep3(data.step3 || defaultContext.step3);
      setStep4(data.step4 || defaultContext.step4);
      setStep5(data.step5 || defaultContext.step5);
    } catch (error) {
      console.error('Error importing data:', error);
    }
  };

  return (
    <PlaybookContext.Provider
      value={{
        user,
        step1,
        step2,
        step3,
        step4,
        step5,
        updateUser,
        updateStep1,
        updateStep2,
        updateStep3,
        updateStep4,
        updateStep5,
        resetAll,
        exportData,
        importData,
      }}
    >
      {children}
    </PlaybookContext.Provider>
  );
}

export function usePlaybook() {
  const context = useContext(PlaybookContext);
  if (!context) {
    throw new Error('usePlaybook must be used within PlaybookProvider');
  }
  return context;
}
