
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, Project } from '../types';
import { PORTFOLIO_DATA } from '../constants';

interface PortfolioContextType {
  data: PortfolioData;
  updateProject: (project: Project) => void;
  addProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  resetData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage or fallback to constants
  const [data, setData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('portfolio_data');
    return saved ? JSON.parse(saved) : PORTFOLIO_DATA;
  });

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('portfolio_data', JSON.stringify(data));
  }, [data]);

  const addProject = (project: Project) => {
    setData(prev => ({
      ...prev,
      projects: [project, ...prev.projects]
    }));
  };

  const updateProject = (updatedProject: Project) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === updatedProject.id ? updatedProject : p)
    }));
  };

  const deleteProject = (projectId: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId)
    }));
  };

  const resetData = () => {
    setData(PORTFOLIO_DATA);
  };

  return (
    <PortfolioContext.Provider value={{ data, addProject, updateProject, deleteProject, resetData }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
