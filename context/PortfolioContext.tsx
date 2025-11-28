
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
  // Only track dynamic data in state
  const [projects, setProjects] = useState<Project[]>(PORTFOLIO_DATA.projects);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects from Firestore on mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsCollection = collection(db, 'projects');
        const snapshot = await getDocs(projectsCollection);

        if (!snapshot.empty) {
          const loadedProjects = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          })) as Project[];

          setProjects(loadedProjects);
        }
      } catch (error) {
        console.error('Error loading projects from Firestore:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Derive the full data object
  const data: PortfolioData = {
    ...PORTFOLIO_DATA,
    projects: projects
  };

  const addProject = async (project: Project) => {
    try {
      const projectsCollection = collection(db, 'projects');
      const docRef = await addDoc(projectsCollection, project);

      setProjects(prev => [{ ...project, id: docRef.id }, ...prev]);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProject = async (updatedProject: Project) => {
    try {
      const projectRef = doc(db, 'projects', updatedProject.id);
      await updateDoc(projectRef, updatedProject as any);

      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await deleteDoc(projectRef);

      setProjects(prev => prev.filter(p => p.id !== projectId));
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

      // Reset to default projects
      setProjects(PORTFOLIO_DATA.projects);
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
