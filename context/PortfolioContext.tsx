
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, Project } from '../types';
import { PORTFOLIO_DATA } from '../constants';
import { db } from '../services/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';

interface PortfolioContextType {
  data: PortfolioData;
  updateProject: (project: Project) => void;
  addProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  resetData: () => void;
  isLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(PORTFOLIO_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects from Firestore on mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsCollection = collection(db, 'projects');
        const snapshot = await getDocs(projectsCollection);
        const projects = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Project[];
        
        setData(prev => ({
          ...prev,
          projects
        }));
      } catch (error) {
        console.error('Error loading projects from Firestore:', error);
        // Fall back to default data if there's an error
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const addProject = async (project: Project) => {
    try {
      const projectsCollection = collection(db, 'projects');
      const docRef = await addDoc(projectsCollection, project);
      
      // Update local state
      setData(prev => ({
        ...prev,
        projects: [{ ...project, id: docRef.id }, ...prev.projects]
      }));
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProject = async (updatedProject: Project) => {
    try {
      const projectRef = doc(db, 'projects', updatedProject.id);
      await updateDoc(projectRef, updatedProject as any);
      
      // Update local state
      setData(prev => ({
        ...prev,
        projects: prev.projects.map(p => p.id === updatedProject.id ? updatedProject : p)
      }));
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await deleteDoc(projectRef);
      
      // Update local state
      setData(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== projectId)
      }));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const resetData = async () => {
    try {
      // Delete all projects from Firestore
      const projectsCollection = collection(db, 'projects');
      const snapshot = await getDocs(projectsCollection);
      
      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
      }
      
      // Reset to default data
      setData(PORTFOLIO_DATA);
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };

  return (
    <PortfolioContext.Provider value={{ data, addProject, updateProject, deleteProject, resetData, isLoading }}>
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
