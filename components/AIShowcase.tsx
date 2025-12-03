import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Github, Sparkles, Clock, Bot, Cpu, X, ChevronRight, CheckCircle, AlertTriangle, Lightbulb, ChevronLeft } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface AIShowcaseProps {
    onBack: () => void;
}

export const AIShowcase: React.FC<AIShowcaseProps> = ({ onBack }) => {
    const { data } = usePortfolio();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Filter projects that have AI tools used
    const aiProjects = data.projects.filter(project =>
        (project.aiToolsUsed && project.aiToolsUsed.length > 0) &&
        (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setCurrentSlide(0);
    };

    const nextSlide = () => {
        if (currentSlide < 3) setCurrentSlide(prev => prev + 1);
    };

    const prevSlide = () => {
        if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 selection:bg-primary-500 selection:text-white">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900"></div>
                {/* AI Themed Background Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-600/10 rounded-full blur-[120px] animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                    <div>
                        <button
                            onClick={onBack}
                            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                        >
                            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </button>
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="w-8 h-8 text-primary-400" />
                            <h1 className="text-4xl md:text-6xl font-bold text-white font-display tracking-tight">AI Lab</h1>
                        </div>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            Exploring the frontier of AI-augmented development. Showcasing how intelligent tools accelerate creation and expand possibilities.
                        </p>
                    </div>
                </div>

                {/* Stats / Intro Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-gray-800/30 border border-gray-700/50 p-6 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2 text-primary-400">
                            <Clock className="w-5 h-5" />
                            <span className="font-mono text-sm uppercase tracking-wider">Velocity</span>
                        </div>
                        <p className="text-gray-300 text-sm">
                            Rapid prototyping and development cycles enabled by AI assistants.
                        </p>
                    </div>
                    <div className="bg-gray-800/30 border border-gray-700/50 p-6 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2 text-accent-400">
                            <Bot className="w-5 h-5" />
                            <span className="font-mono text-sm uppercase tracking-wider">Collaboration</span>
                        </div>
                        <p className="text-gray-300 text-sm">
                            Using LLMs as pair programmers to solve complex logic and optimize code.
                        </p>
                    </div>
                    <div className="bg-gray-800/30 border border-gray-700/50 p-6 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2 text-green-400">
                            <Cpu className="w-5 h-5" />
                            <span className="font-mono text-sm uppercase tracking-wider">Generation</span>
                        </div>
                        <p className="text-gray-300 text-sm">
                            Leveraging generative models for assets, copy, and design inspiration.
                        </p>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 gap-12">
                    {aiProjects.map((project, index) => (
                        <div
                            key={project.id}
                            className="group relative bg-gray-800/40 border border-gray-700 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-900/10 cursor-pointer"
                            onClick={() => handleProjectClick(project)}
                        >
                            <div className="flex flex-col lg:flex-row h-full">
                                {/* Image Section */}
                                <div className="lg:w-1/2 relative overflow-hidden min-h-[300px] lg:min-h-full">
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent z-10 lg:hidden"></div>
                                    <div className="absolute inset-0 bg-primary-500/10 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                    />
                                    {/* View Details Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 bg-black/40 backdrop-blur-sm">
                                        <span className="px-6 py-3 bg-white text-gray-900 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            View Pitch Deck <ChevronRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center relative">
                                    {/* Decorative background number */}
                                    <span className="absolute top-4 right-6 text-9xl font-bold text-gray-800/20 font-display select-none pointer-events-none">
                                        0{index + 1}
                                    </span>

                                    <div className="relative z-10">
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {project.aiToolsUsed?.map(tool => (
                                                <span key={tool} className="flex items-center gap-1.5 text-xs font-mono text-white bg-primary-500/20 border border-primary-500/30 px-3 py-1.5 rounded-full">
                                                    <Sparkles className="w-3 h-3" />
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>

                                        <h3 className="text-3xl md:text-4xl font-bold text-white font-display mb-4 group-hover:text-primary-400 transition-colors">
                                            {project.title}
                                        </h3>

                                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                            {project.description}
                                        </p>

                                        <div className="grid grid-cols-2 gap-6 mb-8 border-t border-gray-700/50 pt-6">
                                            <div>
                                                <span className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Development Time</span>
                                                <span className="text-xl font-bold text-white flex items-center gap-2">
                                                    <Clock className="w-5 h-5 text-accent-400" />
                                                    {project.developmentTime || 'N/A'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Tech Stack</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.technologies.slice(0, 3).map(tech => (
                                                        <span key={tech} className="text-sm text-gray-300">{tech}</span>
                                                    ))}
                                                    {project.technologies.length > 3 && <span className="text-sm text-gray-500">+{project.technologies.length - 3}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {aiProjects.length === 0 && (
                    <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700 border-dashed">
                        <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No AI Projects Found</h3>
                        <p className="text-gray-500">Check back later for new experiments.</p>
                    </div>
                )}
            </div>

            {/* Pitch Deck Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
                    >
                        <div className="w-full h-full max-w-7xl mx-auto flex flex-col relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Progress Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-40">
                                <motion.div
                                    className="h-full bg-primary-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${((currentSlide + 1) / 4) * 100}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>

                            {/* Slides Container */}
                            <div className="flex-1 flex items-center justify-center p-4 md:p-12 overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {/* SLIDE 1: THE HOOK */}
                                    {currentSlide === 0 && (
                                        <motion.div
                                            key="slide1"
                                            initial={{ opacity: 0, x: 100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            className="w-full grid lg:grid-cols-2 gap-12 items-center"
                                        >
                                            <div className="space-y-8">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-400 text-sm font-mono uppercase tracking-wider">
                                                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                                                    The Concept
                                                </div>
                                                <h2 className="text-5xl md:text-7xl font-bold text-white font-display leading-tight">
                                                    {selectedProject.title}
                                                </h2>
                                                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-xl">
                                                    {selectedProject.description}
                                                </p>
                                                <div className="flex flex-wrap gap-3">
                                                    {selectedProject.technologies.map(tech => (
                                                        <span key={tech} className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 text-sm border border-gray-700">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden border border-gray-700 shadow-2xl shadow-primary-900/20">
                                                <img
                                                    src={selectedProject.imageUrl}
                                                    alt={selectedProject.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* SLIDE 2: THE CHALLENGE */}
                                    {currentSlide === 1 && (
                                        <motion.div
                                            key="slide2"
                                            initial={{ opacity: 0, x: 100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            className="max-w-4xl mx-auto text-center space-y-12"
                                        >
                                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-mono uppercase tracking-wider">
                                                <AlertTriangle className="w-4 h-4" />
                                                The Challenge
                                            </div>
                                            <h3 className="text-4xl md:text-6xl font-bold text-white font-display leading-tight">
                                                "What was the hardest part?"
                                            </h3>
                                            <div className="bg-gray-800/50 p-8 md:p-12 rounded-3xl border border-gray-700/50 backdrop-blur-sm relative">
                                                <QuoteIcon className="absolute top-8 left-8 w-12 h-12 text-gray-700 opacity-50" />
                                                <p className="text-2xl md:text-3xl text-gray-200 leading-relaxed font-light italic relative z-10">
                                                    {selectedProject.challenge || "No challenge defined for this project."}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* SLIDE 3: THE SOLUTION */}
                                    {currentSlide === 2 && (
                                        <motion.div
                                            key="slide3"
                                            initial={{ opacity: 0, x: 100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            className="w-full grid lg:grid-cols-2 gap-12 items-center"
                                        >
                                            <div className="order-2 lg:order-1 relative aspect-square rounded-3xl overflow-hidden border border-gray-700 bg-gray-800 flex items-center justify-center p-12">
                                                <div className="grid grid-cols-2 gap-4 w-full h-full">
                                                    <div className="bg-gray-900/50 rounded-2xl flex items-center justify-center border border-gray-700/50">
                                                        <Bot className="w-16 h-16 text-primary-500 opacity-50" />
                                                    </div>
                                                    <div className="bg-gray-900/50 rounded-2xl flex items-center justify-center border border-gray-700/50">
                                                        <Sparkles className="w-16 h-16 text-accent-500 opacity-50" />
                                                    </div>
                                                    <div className="bg-gray-900/50 rounded-2xl flex items-center justify-center border border-gray-700/50 col-span-2">
                                                        <Cpu className="w-16 h-16 text-green-500 opacity-50" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="order-1 lg:order-2 space-y-8">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-400 text-sm font-mono uppercase tracking-wider">
                                                    <Lightbulb className="w-4 h-4" />
                                                    The AI Solution
                                                </div>
                                                <h3 className="text-4xl md:text-5xl font-bold text-white font-display">
                                                    Intelligent Acceleration
                                                </h3>
                                                <div className="space-y-6">
                                                    <div className="flex flex-wrap gap-3">
                                                        {selectedProject.aiToolsUsed?.map(tool => (
                                                            <span key={tool} className="flex items-center gap-2 px-4 py-2 bg-primary-900/30 border border-primary-500/30 rounded-lg text-primary-300 font-mono text-sm">
                                                                <Sparkles className="w-4 h-4" /> {tool}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <p className="text-xl text-gray-300 leading-relaxed">
                                                        {selectedProject.aiDescription || "No AI description available."}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* SLIDE 4: THE RESULTS */}
                                    {currentSlide === 3 && (
                                        <motion.div
                                            key="slide4"
                                            initial={{ opacity: 0, x: 100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            className="max-w-5xl mx-auto w-full space-y-12"
                                        >
                                            <div className="text-center space-y-6">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-mono uppercase tracking-wider">
                                                    <CheckCircle className="w-4 h-4" />
                                                    The Results
                                                </div>
                                                <h3 className="text-4xl md:text-6xl font-bold text-white font-display">
                                                    Delivered in {selectedProject.developmentTime || 'Record Time'}
                                                </h3>
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-6">
                                                {selectedProject.features?.map((feature, i) => (
                                                    <div key={i} className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                                                        <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 mb-4 font-bold">
                                                            {i + 1}
                                                        </div>
                                                        <p className="text-gray-200 font-medium text-lg">{feature}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-center gap-6 pt-8">
                                                {selectedProject.demoUrl && (
                                                    <a
                                                        href={selectedProject.demoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-primary-500 hover:text-white transition-all transform hover:scale-105 flex items-center gap-2 text-lg"
                                                    >
                                                        <ExternalLink className="w-5 h-5" /> Launch Demo
                                                    </a>
                                                )}
                                                {selectedProject.repoUrl && (
                                                    <a
                                                        href={selectedProject.repoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-8 py-4 bg-gray-800 text-white rounded-full font-bold hover:bg-gray-700 transition-all transform hover:scale-105 flex items-center gap-2 text-lg border border-gray-700"
                                                    >
                                                        <Github className="w-5 h-5" /> View Code
                                                    </a>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Navigation Controls */}
                            <div className="p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
                                <button
                                    onClick={prevSlide}
                                    disabled={currentSlide === 0}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${currentSlide === 0
                                        ? 'opacity-0 pointer-events-none'
                                        : 'bg-gray-800 text-white hover:bg-gray-700'
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5" /> Previous
                                </button>

                                <div className="flex gap-2">
                                    {[0, 1, 2, 3].map(idx => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentSlide(idx)}
                                            className={`w-3 h-3 rounded-full transition-all ${currentSlide === idx ? 'bg-primary-500 w-8' : 'bg-gray-700 hover:bg-gray-600'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={nextSlide}
                                    disabled={currentSlide === 3}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${currentSlide === 3
                                        ? 'opacity-50 cursor-not-allowed bg-gray-800 text-gray-500'
                                        : 'bg-white text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    Next <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Helper Icon
const QuoteIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
    </svg>
);
