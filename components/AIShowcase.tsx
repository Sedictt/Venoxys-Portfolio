import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Github, Sparkles, Clock, Bot, X, ChevronRight, ChevronLeft, Maximize2, Images, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { motion, AnimatePresence } from 'framer-motion';

interface AIShowcaseProps {
    onBack: () => void;
}

export const AIShowcase: React.FC<AIShowcaseProps> = ({ onBack }) => {
    const { data } = usePortfolio();
    const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
    const [galleryState, setGalleryState] = useState<{ isOpen: boolean; currentImageIndex: number }>({
        isOpen: false,
        currentImageIndex: 0
    });
    const [zoomLevel, setZoomLevel] = useState(1);

    // Filter projects that have AI tools used
    const aiProjects = data.projects.filter(project =>
        project.aiToolsUsed && project.aiToolsUsed.length > 0
    );

    const currentProject = aiProjects[currentProjectIndex];

    const nextProject = () => {
        setCurrentProjectIndex((prev) => (prev + 1) % aiProjects.length);
    };

    const prevProject = () => {
        setCurrentProjectIndex((prev) => (prev - 1 + aiProjects.length) % aiProjects.length);
    };

    const openGallery = (index: number = 0) => {
        setGalleryState({ isOpen: true, currentImageIndex: index });
        setZoomLevel(1);
    };

    const closeGallery = () => {
        setGalleryState({ ...galleryState, isOpen: false });
        setZoomLevel(1);
    };

    const nextGalleryImage = () => {
        if (!currentProject) return;
        const images = [currentProject.imageUrl, ...(currentProject.gallery || [])];
        setGalleryState(prev => ({
            ...prev,
            currentImageIndex: (prev.currentImageIndex + 1) % images.length
        }));
        setZoomLevel(1);
    };

    const prevGalleryImage = () => {
        if (!currentProject) return;
        const images = [currentProject.imageUrl, ...(currentProject.gallery || [])];
        setGalleryState(prev => ({
            ...prev,
            currentImageIndex: (prev.currentImageIndex - 1 + images.length) % images.length
        }));
        setZoomLevel(1);
    };

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 3));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));
    const handleResetZoom = () => setZoomLevel(1);

    if (aiProjects.length === 0) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
                <button
                    onClick={onBack}
                    className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </button>
                <Bot className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No AI Projects Found</h3>
                <p className="text-gray-500">Check back later for new experiments.</p>
            </div>
        );
    }

    const currentProjectImages = [currentProject.imageUrl, ...(currentProject.gallery || [])];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 selection:bg-primary-500 selection:text-white overflow-hidden flex flex-col">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-600/10 rounded-full blur-[120px] animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-primary-400" />
                        <h1 className="text-2xl font-bold text-white font-display tracking-tight">AI Lab</h1>
                    </div>
                </div>

                {/* Main Slideshow Area */}
                <div className="flex-1 flex items-center justify-center relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevProject}
                        className="absolute left-0 z-20 p-3 rounded-full bg-gray-800/50 text-white hover:bg-primary-500 transition-all backdrop-blur-sm border border-gray-700 hover:border-primary-500 -ml-4 md:-ml-12"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={nextProject}
                        className="absolute right-0 z-20 p-3 rounded-full bg-gray-800/50 text-white hover:bg-primary-500 transition-all backdrop-blur-sm border border-gray-700 hover:border-primary-500 -mr-4 md:-mr-12"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="w-full max-w-6xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentProject.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                            >
                                {/* Image Section - Strictly 16:9 */}
                                <div className="relative group">
                                    <div
                                        className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-700 bg-gray-800 relative cursor-zoom-in shadow-2xl shadow-primary-900/20"
                                        onClick={() => openGallery(0)}
                                    >
                                        <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                        <img
                                            src={currentProject.imageUrl}
                                            alt={currentProject.title}
                                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                            <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium border border-white/10">
                                                <Maximize2 className="w-4 h-4" />
                                                View Gallery
                                            </div>
                                        </div>

                                        {/* Gallery Indicator */}
                                        {currentProject.gallery && currentProject.gallery.length > 0 && (
                                            <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-white flex items-center gap-2 border border-white/10">
                                                <Images className="w-3 h-3" />
                                                +{currentProject.gallery.length} photos
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm text-primary-400 font-mono">
                                            <span className="px-2 py-1 rounded bg-primary-500/10 border border-primary-500/20">
                                                Project {currentProjectIndex + 1} / {aiProjects.length}
                                            </span>
                                            {currentProject.developmentTime && (
                                                <span className="flex items-center gap-1.5 text-gray-400">
                                                    <Clock className="w-4 h-4" />
                                                    {currentProject.developmentTime}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-4xl md:text-5xl font-bold text-white font-display leading-tight">
                                            {currentProject.title}
                                        </h2>

                                        <div className="flex flex-wrap gap-2">
                                            {currentProject.aiToolsUsed?.map(tool => (
                                                <span key={tool} className="flex items-center gap-1.5 text-xs font-mono text-white bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-full">
                                                    <Sparkles className="w-3 h-3 text-primary-400" />
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>

                                        <p className="text-lg text-gray-300 leading-relaxed">
                                            {currentProject.description}
                                        </p>

                                        {currentProject.aiDescription && (
                                            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                                                <p className="text-sm text-gray-400 italic">
                                                    "{currentProject.aiDescription}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-700/50">
                                        {currentProject.demoUrl && (
                                            <a
                                                href={currentProject.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-primary-500 hover:text-white transition-all flex items-center gap-2"
                                            >
                                                <ExternalLink className="w-4 h-4" /> Launch Demo
                                            </a>
                                        )}
                                        {currentProject.repoUrl && (
                                            <a
                                                href={currentProject.repoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 bg-gray-800 text-white rounded-full font-bold hover:bg-gray-700 transition-all border border-gray-700 flex items-center gap-2"
                                            >
                                                <Github className="w-4 h-4" /> View Code
                                            </a>
                                        )}

                                        <button
                                            onClick={() => openGallery(0)}
                                            className="px-6 py-3 bg-gray-800 text-white rounded-full font-bold hover:bg-gray-700 transition-all border border-gray-700 flex items-center gap-2"
                                        >
                                            <Images className="w-4 h-4" /> View Gallery
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bottom Indicators */}
                <div className="flex justify-center gap-2 mt-8">
                    {aiProjects.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentProjectIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentProjectIndex
                                ? 'w-8 bg-primary-500'
                                : 'w-2 bg-gray-700 hover:bg-gray-600'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Gallery Modal */}
            <AnimatePresence>
                {galleryState.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl"
                    >
                        {/* Top Controls */}
                        <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full p-1 border border-white/10">
                                <button
                                    onClick={handleZoomOut}
                                    className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
                                    title="Zoom Out"
                                >
                                    <ZoomOut className="w-5 h-5" />
                                </button>
                                <span className="text-sm font-mono text-gray-300 w-12 text-center">
                                    {Math.round(zoomLevel * 100)}%
                                </span>
                                <button
                                    onClick={handleZoomIn}
                                    className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
                                    title="Zoom In"
                                >
                                    <ZoomIn className="w-5 h-5" />
                                </button>
                                <div className="w-px h-6 bg-white/10 mx-1"></div>
                                <button
                                    onClick={handleResetZoom}
                                    className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
                                    title="Reset Zoom"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={closeGallery}
                                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Main Image View */}
                        <div className="flex-1 flex items-center justify-center relative p-4 md:p-12 overflow-hidden">
                            <button
                                onClick={prevGalleryImage}
                                className="absolute left-4 md:left-8 z-40 p-3 rounded-full bg-black/50 text-white hover:bg-primary-500 transition-all backdrop-blur-sm border border-white/10"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            <button
                                onClick={nextGalleryImage}
                                className="absolute right-4 md:right-8 z-40 p-3 rounded-full bg-black/50 text-white hover:bg-primary-500 transition-all backdrop-blur-sm border border-white/10"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            <div className="w-full h-full flex items-center justify-center overflow-auto">
                                <motion.img
                                    key={galleryState.currentImageIndex}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: zoomLevel }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    src={currentProjectImages[galleryState.currentImageIndex]}
                                    alt={`Gallery image ${galleryState.currentImageIndex + 1}`}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-200 ease-out"
                                    style={{ cursor: zoomLevel > 1 ? 'grab' : 'default' }}
                                    drag={zoomLevel > 1}
                                    dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
                                />
                            </div>
                        </div>

                        {/* Thumbnail Carousel */}
                        <div className="h-32 bg-gray-900/80 border-t border-gray-800 p-4 flex items-center justify-center gap-4 overflow-x-auto z-50">
                            {currentProjectImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setGalleryState(prev => ({ ...prev, currentImageIndex: idx }));
                                        setZoomLevel(1);
                                    }}
                                    className={`relative h-20 aspect-video rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${idx === galleryState.currentImageIndex
                                        ? 'border-primary-500 scale-105 ring-2 ring-primary-500/20'
                                        : 'border-transparent opacity-50 hover:opacity-100 hover:border-gray-600'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
