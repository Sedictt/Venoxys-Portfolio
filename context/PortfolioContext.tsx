
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

                    // Merge strategy:
                    // 1. Identify projects from PORTFOLIO_DATA that we want to ensure exist or have specific data
                    // 2. For Librowse specifically, we want to ensure the gallery is populated from local constants
                    //    because the DB might not have it yet.
                    // 3. STRICT FILTER: Only allow projects that exist in PORTFOLIO_DATA to be displayed.

                    const mergedProjects = loadedProjects.map(p => {
                        // Find matching local project by ID or Title
                        const localMatch = PORTFOLIO_DATA.projects.find(local =>
                            local.id === p.id || local.title === p.title
                        );

                        if (localMatch) {
                            return {
                                ...p,
                                // Ensure gallery is present if missing in DB but exists locally
                                gallery: p.gallery && p.gallery.length > 0 ? p.gallery : localMatch.gallery,
                                // Ensure imageUrl is present (local might have the updated path)
                                imageUrl: p.imageUrl || localMatch.imageUrl
                            };
                        }
                        return p;
                    });

                    // Also add any local projects that are completely missing from DB (by ID and Title)
                    const missingLocalProjects = PORTFOLIO_DATA.projects.filter(local =>
                        !loadedProjects.some(p => p.id === local.id || p.title === local.title)
                    );

                    setProjects([...mergedProjects, ...missingLocalProjects]);
                } else {
                    // Fallback to local data if DB is empty
                    setProjects(PORTFOLIO_DATA.projects);
                }
            } catch (error) {
                console.error('Error loading projects from Firestore:', error);
                // Fallback to local data on error
                setProjects(PORTFOLIO_DATA.projects);
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

            // Re-populate with default projects from constants
            for (const project of PORTFOLIO_DATA.projects) {
                // We use setDoc with a specific ID if possible, or addDoc if not.
                // Since our local projects have IDs like 'p-librowse', we can try to preserve them 
                // or just let Firestore generate new ones. 
                // To ensure consistency, let's try to use the local ID as the doc ID.
                if (project.id) {
                    await setDoc(doc(db, 'projects', project.id), project);
                } else {
                    await addDoc(projectsCollection, project);
                }
            }

            // Reset local state
            setProjects(PORTFOLIO_DATA.projects);
            console.log('Database reset and synced with local constants.');
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
