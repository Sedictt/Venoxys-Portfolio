
import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import { Plus, Edit2, Trash2, X, Save, ArrowLeft, Image as ImageIcon, Github, ExternalLink, Lock, Upload, Loader2, Sparkles, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';
import { uploadImage } from '../services/cloudinary';
import { generateProjectDetails } from '../services/gemini';

interface AILabCMSProps {
    onBack: () => void;
}

export const AILabCMS: React.FC<AILabCMSProps> = ({ onBack }) => {
    const { data, addProject, updateProject, deleteProject } = usePortfolio();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Form State
    const initialFormState: Project = {
        id: '',
        title: '',
        description: '', // Tagline
        technologies: [],
        imageUrl: '',
        demoUrl: '',
        repoUrl: '',
        aiToolsUsed: [],
        features: [],
        aiDescription: '', // The Solution
        challenge: '', // The Problem
        developmentTime: '',
        gallery: [],
        customSlides: [],
        category: 'Applications'
    };
    const [formData, setFormData] = useState<Project>(initialFormState);
    const [category, setCategory] = useState<string>('Applications');
    const [techInput, setTechInput] = useState('');
    const [aiToolsInput, setAiToolsInput] = useState('');
    const [featuresInput, setFeaturesInput] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // Filter only AI projects
    const aiProjects = data.projects.filter(p => p.aiToolsUsed && p.aiToolsUsed.length > 0);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
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
        setAiToolsInput(project.aiToolsUsed ? project.aiToolsUsed.join(', ') : '');
        setFeaturesInput(project.features ? project.features.join(', ') : '');
        setIsFormOpen(true);
    };

    const handleAddClick = () => {
        setEditingProject(null);
        setFormData({ ...initialFormState, id: Date.now().toString() });
        setTechInput('');
        setAiToolsInput('');
        setFeaturesInput('');
        setIsFormOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            deleteProject(id);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const imageUrl = await uploadImage(file);
            setFormData(prev => ({ ...prev, imageUrl }));
        } catch (error) {
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const uploadPromises = Array.from(files).map((file: File) => uploadImage(file));
            const uploadedUrls = await Promise.all(uploadPromises);
            setFormData(prev => ({
                ...prev,
                gallery: [...(prev.gallery || []), ...uploadedUrls]
            }));
        } catch (error) {
            alert('Failed to upload some images. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCustomSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const imageUrl = await uploadImage(file);
            setFormData(prev => {
                const newSlides = [...(prev.customSlides || [])];
                newSlides[index] = { ...newSlides[index], imageUrl };
                return { ...prev, customSlides: newSlides };
            });
        } catch (error) {
            alert('Failed to upload image.');
        } finally {
            setIsUploading(false);
        }
    };

    const addCustomSlide = () => {
        setFormData(prev => ({
            ...prev,
            customSlides: [
                ...(prev.customSlides || []),
                { id: Date.now().toString(), title: '', content: '' }
            ]
        }));
    };

    const removeCustomSlide = (index: number) => {
        setFormData(prev => ({
            ...prev,
            customSlides: prev.customSlides?.filter((_, i) => i !== index)
        }));
    };

    const updateCustomSlide = (index: number, field: string, value: string) => {
        setFormData(prev => {
            const newSlides = [...(prev.customSlides || [])];
            newSlides[index] = { ...newSlides[index], [field]: value };
            return { ...prev, customSlides: newSlides };
        });
    };

    const handleAutoGenerate = async () => {
        setIsGenerating(true);
        try {
            const details = await generateProjectDetails(formData.title, category);
            setFormData(prev => ({
                ...prev,
                title: details.title,
                description: details.description,
                challenge: details.challenge,
                aiDescription: details.aiDescription,
                technologies: details.technologies,
                aiToolsUsed: details.aiToolsUsed,
                features: details.features,
                developmentTime: details.developmentTime,
                demoUrl: details.demoUrl || prev.demoUrl,
                repoUrl: details.repoUrl || prev.repoUrl
            }));
            setTechInput(details.technologies.join(', '));
            setAiToolsInput(details.aiToolsUsed.join(', '));
            setFeaturesInput(details.features.join(', '));
        } catch (error) {
            console.error(error);
            alert("Failed to generate details. Please ensure your API Key is set in .env.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (index: number) => {
        if (draggedIndex === null) return;
        const newGallery = [...(formData.gallery || [])];
        const [movedItem] = newGallery.splice(draggedIndex, 1);
        newGallery.splice(index, 0, movedItem);
        setFormData(prev => ({ ...prev, gallery: newGallery }));
        setDraggedIndex(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const technologies = techInput.split(',').map(t => t.trim()).filter(t => t !== '');
        const aiToolsUsed = aiToolsInput.split(',').map(t => t.trim()).filter(t => t !== '');
        const features = featuresInput.split(',').map(t => t.trim()).filter(t => t !== '');

        // Ensure it's marked as an AI project if not already
        if (aiToolsUsed.length === 0) {
            alert("Please specify at least one AI tool to add this to the AI Lab.");
            return;
        }

        const finalProject = { ...formData, technologies, aiToolsUsed, features };

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
                            <Sparkles className="w-8 h-8 text-primary-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white text-center mb-6">AI Lab Director</h2>
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
                            Enter Lab
                        </button>
                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full text-gray-500 hover:text-gray-300 text-sm py-2"
                        >
                            Back to Portfolio
                        </button>
                    </form>

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
                        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary-500" />
                            AI Lab Director
                        </h1>
                    </div>
                    <button
                        onClick={handleAddClick}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        <Plus className="w-5 h-5" /> New Experiment
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid gap-6">
                    {aiProjects.map((project) => (
                        <div key={project.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col md:flex-row gap-6 items-center">
                            <div className="w-full md:w-48 aspect-video bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 relative">
                                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 space-y-2 w-full text-center md:text-left">
                                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {project.aiToolsUsed?.map(t => (
                                        <span key={t} className="text-xs px-2 py-1 bg-primary-900/30 text-primary-400 rounded border border-primary-700/50">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditClick(project)}
                                    className="p-3 bg-gray-700 hover:bg-blue-600 hover:text-white rounded-lg transition-colors text-gray-300"
                                    title="Edit Pitch Deck"
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

                    {aiProjects.length === 0 && (
                        <div className="text-center py-20 text-gray-500 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                            No AI experiments found. Start innovating!
                        </div>
                    )}
                </div>
            </main>

            {/* Pitch Deck Editor Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
                            <h2 className="text-xl font-bold font-display flex items-center gap-2">
                                {editingProject ? 'Edit Pitch Deck' : 'New Experiment'}
                            </h2>
                            <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-8">

                            {/* Slide 1: The Hook */}
                            <div className="space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-700/50">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-xs">1</span>
                                    The Hook (Title & Visuals)
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-xs font-mono text-gray-500 uppercase">Project Type</label>
                                            </div>
                                            <select
                                                value={category}
                                                onChange={(e) => {
                                                    setCategory(e.target.value);
                                                    setFormData({ ...formData, category: e.target.value as any });
                                                }}
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none mb-4"
                                            >
                                                <option value="Applications">Application</option>
                                                <option value="Photography">Photography</option>
                                                <option value="Video Editing">Video Editing</option>
                                                <option value="Graphic Design">Graphic Design</option>
                                                <option value="Art">Art</option>
                                            </select>

                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-xs font-mono text-gray-500 uppercase">Project Title</label>
                                                <button
                                                    type="button"
                                                    onClick={handleAutoGenerate}
                                                    disabled={isGenerating}
                                                    className="text-xs flex items-center gap-1 text-primary-400 hover:text-primary-300 transition-colors disabled:opacity-50"
                                                >
                                                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                                    {formData.title ? 'Auto-Complete' : 'Auto-Generate Idea'}
                                                </button>
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-mono text-gray-500 uppercase">Tagline (Short Description)</label>
                                            <textarea
                                                required
                                                rows={3}
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-mono text-gray-500 uppercase flex items-center gap-2 mb-2">
                                                <ImageIcon className="w-4 h-4" /> Hero Image
                                            </label>
                                            <div className="flex flex-col gap-4">
                                                <div className="relative group">
                                                    <div className="h-40 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
                                                        {formData.imageUrl ? (
                                                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-gray-600">No image selected</span>
                                                        )}
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <label className="cursor-pointer px-4 py-2 bg-white text-gray-900 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200">
                                                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                                            Upload Hero
                                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                                                        </label>
                                                    </div>
                                                </div>
                                                <input
                                                    type="url"
                                                    value={formData.imageUrl}
                                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                                    placeholder="Or paste URL..."
                                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-400 focus:border-primary-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Gallery Upload Section */}
                                        <div>
                                            <label className="text-xs font-mono text-gray-500 uppercase flex items-center gap-2 mb-2">
                                                <ImageIcon className="w-4 h-4" /> Gallery Images (Optional)
                                            </label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {formData.gallery?.map((img, idx) => (
                                                    <div
                                                        key={idx}
                                                        draggable
                                                        onDragStart={() => handleDragStart(idx)}
                                                        onDragOver={handleDragOver}
                                                        onDrop={() => handleDrop(idx)}
                                                        onDragEnd={() => setDraggedIndex(null)}
                                                        className={`relative aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700 group cursor-move transition-opacity ${draggedIndex === idx ? 'opacity-40' : 'opacity-100'}`}
                                                    >
                                                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover pointer-events-none" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, gallery: prev.gallery?.filter((_, i) => i !== idx) }))}
                                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <label className="aspect-square bg-gray-800 rounded-lg border border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                                                    {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-gray-400" /> : <Plus className="w-6 h-6 text-gray-400" />}
                                                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={isUploading} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Slide 2: The Challenge */}
                            <div className="space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-700/50">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs">2</span>
                                    The Challenge (Problem Statement)
                                </h3>
                                <div>
                                    <label className="text-xs font-mono text-gray-500 uppercase flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-4 h-4 text-red-400" /> What was the hard part?
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.challenge || ''}
                                        onChange={e => setFormData({ ...formData, challenge: e.target.value })}
                                        placeholder="e.g. Creating a performant 3D procedural city in the browser..."
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Slide 3: The Solution */}
                            <div className="space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-700/50">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-xs">3</span>
                                    The AI Solution (How it helped)
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-mono text-gray-500 uppercase flex items-center gap-2 mb-2">
                                            <Sparkles className="w-4 h-4 text-primary-400" /> AI Tools Used
                                        </label>
                                        <input
                                            type="text"
                                            value={aiToolsInput}
                                            onChange={e => setAiToolsInput(e.target.value)}
                                            placeholder="GitHub Copilot, Midjourney..."
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-mono text-gray-500 uppercase flex items-center gap-2 mb-2">
                                            <Lightbulb className="w-4 h-4 text-yellow-400" /> Implementation Story
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={formData.aiDescription || ''}
                                            onChange={e => setFormData({ ...formData, aiDescription: e.target.value })}
                                            placeholder="Midjourney was instrumental in..."
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Custom Slides Section */}
                            <div className="space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-700/50">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs">+</span>
                                        Custom Slides (Optional)
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={addCustomSlide}
                                        className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Add Slide
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {formData.customSlides?.map((slide, index) => (
                                        <div key={slide.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700 relative">
                                            <button
                                                type="button"
                                                onClick={() => removeCustomSlide(index)}
                                                className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-xs font-mono text-gray-500 uppercase">Slide Title</label>
                                                        <input
                                                            type="text"
                                                            value={slide.title}
                                                            onChange={e => updateCustomSlide(index, 'title', e.target.value)}
                                                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                                                            placeholder="e.g. Market Analysis"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-mono text-gray-500 uppercase">Content</label>
                                                        <textarea
                                                            rows={3}
                                                            value={slide.content}
                                                            onChange={e => updateCustomSlide(index, 'content', e.target.value)}
                                                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none resize-none"
                                                            placeholder="Slide details..."
                                                        ></textarea>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-mono text-gray-500 uppercase mb-2 block">Slide Image</label>
                                                    <div className="h-32 bg-gray-900 rounded border border-gray-700 flex items-center justify-center relative group overflow-hidden">
                                                        {slide.imageUrl ? (
                                                            <img src={slide.imageUrl} alt="Slide" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-gray-600 text-xs">No image</span>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <label className="cursor-pointer px-3 py-1 bg-white text-black rounded text-xs font-bold hover:bg-gray-200">
                                                                Upload
                                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCustomSlideImageUpload(e, index)} disabled={isUploading} />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!formData.customSlides || formData.customSlides.length === 0) && (
                                        <div className="text-center py-4 text-gray-500 text-sm italic">
                                            No custom slides added.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Slide 4: The Results */}
                            <div className="space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-700/50">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs">4</span>
                                    The Results (Features & Stats)
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-mono text-gray-500 uppercase flex items-center gap-2 mb-2">
                                            <CheckCircle className="w-4 h-4 text-green-400" /> Key Features
                                        </label>
                                        <input
                                            type="text"
                                            value={featuresInput}
                                            onChange={e => setFeaturesInput(e.target.value)}
                                            placeholder="Feature 1, Feature 2..."
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-mono text-gray-500 uppercase mb-2 block">Dev Time</label>
                                            <input
                                                type="text"
                                                value={formData.developmentTime || ''}
                                                onChange={e => setFormData({ ...formData, developmentTime: e.target.value })}
                                                placeholder="2 Weeks"
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-mono text-gray-500 uppercase mb-2 block">Tech Stack</label>
                                            <input
                                                type="text"
                                                value={techInput}
                                                onChange={e => setTechInput(e.target.value)}
                                                placeholder="React, Three.js..."
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6 pt-4">
                                    <div>
                                        <label className="text-xs font-mono text-gray-500 uppercase flex items-center gap-2 mb-2">
                                            <ExternalLink className="w-4 h-4" /> Demo URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.demoUrl || ''}
                                            onChange={e => setFormData({ ...formData, demoUrl: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-mono text-gray-500 uppercase flex items-center gap-2 mb-2">
                                            <Github className="w-4 h-4" /> Repo URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.repoUrl || ''}
                                            onChange={e => setFormData({ ...formData, repoUrl: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                                        />
                                    </div>
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
                                    <Save className="w-4 h-4" /> Save Experiment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
