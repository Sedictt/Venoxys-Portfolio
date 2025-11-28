import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Github, Search } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';

interface ProjectGalleryProps {
    onBack: () => void;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ onBack }) => {
    const { data } = usePortfolio();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTech, setSelectedTech] = useState<string | null>(null);

    // Extract all unique technologies from projects
    const allTechnologies = Array.from(
        new Set(data.projects.flatMap(p => p.technologies))
    ).sort();

    // Filter projects based on search and selected tech
    const filteredProjects = data.projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTech = selectedTech ? project.technologies.includes(selectedTech) : true;
        return matchesSearch && matchesTech;
    });

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 selection:bg-primary-500 selection:text-white">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <button
                            onClick={onBack}
                            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                        >
                            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </button>
                        <h1 className="text-4xl md:text-5xl font-bold text-white font-display">Project Archives</h1>
                        <p className="text-gray-400 mt-2">A collection of my experiments, products, and creative works.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="sticky top-0 z-20 bg-gray-900/90 backdrop-blur-md py-4 mb-12 border-b border-gray-800 -mx-4 px-4 md:mx-0 md:px-0 md:rounded-xl md:border">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors"
                            />
                        </div>

                        {/* Tech Tags */}
                        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                            <button
                                onClick={() => setSelectedTech(null)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedTech === null
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                All
                            </button>
                            {allTechnologies.map(tech => (
                                <button
                                    key={tech}
                                    onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedTech === tech
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                        }`}
                                >
                                    {tech}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className="group bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-900/20 flex flex-col"
                        >
                            {/* Image */}
                            <div className="relative aspect-video overflow-hidden">
                                <div className="absolute inset-0 bg-primary-500/10 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.slice(0, 3).map(tech => (
                                        <span key={tech} className="text-[10px] font-mono text-primary-400 border border-primary-500/30 px-2 py-1 rounded">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 3 && (
                                        <span className="text-[10px] font-mono text-gray-500 border border-gray-700 px-2 py-1 rounded">
                                            +{project.technologies.length - 3}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-white font-display mb-2 group-hover:text-primary-400 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                                    {project.description}
                                </p>

                                <div className="flex gap-4 pt-4 border-t border-gray-700/50 mt-auto">
                                    {project.demoUrl && (
                                        <a
                                            href={project.demoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" /> Live Demo
                                        </a>
                                    )}
                                    {project.repoUrl && (
                                        <a
                                            href={project.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                                        >
                                            <Github className="w-4 h-4" /> Source
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedTech(null); }}
                            className="mt-4 text-primary-400 hover:text-primary-300"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
