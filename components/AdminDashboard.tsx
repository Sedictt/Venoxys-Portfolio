
import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import { Plus, Edit2, Trash2, X, Save, ArrowLeft, Image as ImageIcon, Github, ExternalLink, Lock } from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { data, addProject, updateProject, deleteProject, resetData } = usePortfolio();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const initialFormState: Project = {
    id: '',
    title: '',
    description: '',
    technologies: [],
    imageUrl: '',
    demoUrl: '',
    repoUrl: ''
  };
  const [formData, setFormData] = useState<Project>(initialFormState);
  const [techInput, setTechInput] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side check. In a real app, this would be server-side.
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password');
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setTechInput(project.technologies.join(', '));
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingProject(null);
    setFormData({ ...initialFormState, id: Date.now().toString() });
    setTechInput('');
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const technologies = techInput.split(',').map(t => t.trim()).filter(t => t !== '');
    const finalProject = { ...formData, technologies };

    if (editingProject) {
      updateProject(finalProject);
    } else {
      addProject(finalProject);
    }
    setIsFormOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-900/30 rounded-full">
                <Lock className="w-8 h-8 text-primary-500" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-white text-center mb-6">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Access Code"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Unlock Dashboard
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full text-gray-500 hover:text-gray-300 text-sm py-2"
            >
              Back to Portfolio
            </button>
          </form>
          <p className="mt-4 text-xs text-center text-gray-600">Hint: admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-display font-bold">Project Manager</h1>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={resetData} className="text-sm text-red-400 hover:text-red-300 px-4">
                Reset to Defaults
             </button>
             <button
                onClick={handleAddClick}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
             >
                <Plus className="w-5 h-5" /> New Project
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6">
          {data.projects.map((project) => (
            <div key={project.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-48 aspect-video bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 relative">
                 <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 space-y-2 w-full text-center md:text-left">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {project.technologies.map(t => (
                    <span key={t} className="text-xs px-2 py-1 bg-gray-900 text-primary-400 rounded border border-gray-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(project)}
                  className="p-3 bg-gray-700 hover:bg-blue-600 hover:text-white rounded-lg transition-colors text-gray-300"
                  title="Edit"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(project.id)}
                  className="p-3 bg-gray-700 hover:bg-red-600 hover:text-white rounded-lg transition-colors text-gray-300"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          
          {data.projects.length === 0 && (
             <div className="text-center py-20 text-gray-500 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                No projects found. Create your first one!
             </div>
          )}
        </div>
      </main>

      {/* Editor Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
              <h2 className="text-xl font-bold font-display">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-500 uppercase">Project Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-500 uppercase">Technologies (Comma separated)</label>
                  <input
                    required
                    type="text"
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    placeholder="React, Node.js, AI..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Image URL
                </label>
                <input
                  required
                  type="url"
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://picsum.photos/..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                />
                {formData.imageUrl && (
                    <div className="mt-2 h-32 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-75" />
                    </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-500 uppercase flex items-center gap-2">
                     <ExternalLink className="w-4 h-4" /> Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.demoUrl || ''}
                    onChange={e => setFormData({ ...formData, demoUrl: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-500 uppercase flex items-center gap-2">
                     <Github className="w-4 h-4" /> Repo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.repoUrl || ''}
                    onChange={e => setFormData({ ...formData, repoUrl: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
