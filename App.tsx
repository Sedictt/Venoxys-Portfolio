import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Menu, X, Github, Linkedin, Twitter, Mail, ExternalLink,
  Code, Database, Server, PenTool, Layout, Terminal,
  ChevronDown, MapPin, Download, Briefcase, User,
  Film, Camera, Gamepad2, Clapperboard, Box, Palette, Youtube,
  Smartphone, Zap, Coffee, Brush, FileText, Monitor, Image,
  Brain, Bot, Sparkles, Cpu, MessageSquare, Wand, Play, Layers, ArrowRight,
  CheckCircle, AlertCircle, ArrowUp, GraduationCap, Lock, Quote
} from 'lucide-react';
import { PORTFOLIO_DATA, NAV_LINKS } from './constants';

import { AdminDashboard } from './components/AdminDashboard';
import { ProjectGallery } from './components/ProjectGallery';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Skill, Project } from './types';

// Helper to map icon names to components
const IconMap: Record<string, React.FC<any>> = {
  Github, Linkedin, Twitter, Mail, Code, Database, Server,
  PenTool, Container: Layout, Share2: Terminal, React: Code,
  Palette: PenTool, Film, Camera, Gamepad2, Clapperboard, Box, Youtube,
  Layout, Smartphone, Zap, Coffee, Brush, FileText, Monitor, Image,
  Brain, Bot, Sparkles, Cpu, MessageSquare, Wand
};

// ProjectCard Component for Scroll Animations
const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 } // Trigger when 15% visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row gap-12 md:gap-24 items-center transition-all duration-1000 ease-out transform ${index % 2 === 1 ? 'md:flex-row-reverse' : ''
        } ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-20'}`}
    >
      {/* Image Side - Interactive Card */}
      <div className="w-full md:w-3/5 group perspective-1000">
        <div className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 ease-out transform group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary-900/40 group-hover:scale-105">
          <div className="absolute inset-0 bg-primary-500/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full aspect-video object-cover grayscale group-hover:grayscale-0 transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      </div>

      {/* Text Side */}
      <div className="w-full md:w-2/5 space-y-6">
        <div className="flex flex-wrap gap-2">
          {project.technologies.map(tech => (
            <span key={tech} className="text-xs font-mono text-primary-400 border border-primary-500/30 px-2 py-1 rounded">
              {tech}
            </span>
          ))}
        </div>
        <h3 className="text-4xl font-bold text-white font-display leading-tight">{project.title}</h3>
        <p className="text-gray-400 text-lg font-light leading-relaxed">
          {project.description}
        </p>
        <div className="flex gap-6 pt-4">
          {project.demoUrl && (
            <a href={project.demoUrl} className="flex items-center gap-2 text-white hover:text-primary-400 transition-colors">
              <ExternalLink className="w-5 h-5" /> Live Demo
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} className="flex items-center gap-2 text-white hover:text-primary-400 transition-colors">
              <Github className="w-5 h-5" /> Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const MainPortfolio: React.FC<{ onAdminClick: () => void; onGalleryClick: () => void }> = ({ onAdminClick, onGalleryClick }) => {
  const { data } = usePortfolio(); // Use context instead of constants
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Mouse tracking state for spotlight and parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Scroll Animation State
  const aboutRef = useRef<HTMLElement>(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Toolbox/Skills State
  const [activeSkillTab, setActiveSkillTab] = useState('All');

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formErrors, setFormErrors] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle');

  // Typewriter effect phrases
  const phrases = ["Intelligent Systems", "Cinematic Stories", "Immersive Games", "Digital Worlds"];

  // Handle Typewriter Effect
  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = phrases[textIndex];

      if (isDeleting) {
        setDisplayedText(prev => prev.substring(0, prev.length - 1));
      } else {
        setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
      }

      if (!isDeleting && displayedText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 2000); // Pause at end
      } else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % phrases.length);
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? 50 : 100);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, textIndex]);

  // Handle Intersection Observer for Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAboutVisible(true);
        }
      },
      { threshold: 0.2 } // Trigger when 20% visible
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) observer.unobserve(aboutRef.current);
    };
  }, []);

  // Handle scroll spy and mouse movement
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = NAV_LINKS.map(link => link.href.substring(1));

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Calculate 3D Tilt for Hero Section
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        // Only calculate if mouse is somewhat near the hero section (performance)
        if (e.clientY < rect.height + 100) {
          const x = (e.clientX - rect.left - rect.width / 2) / 25; // Divide controls sensitivity
          const y = (e.clientY - rect.top - rect.height / 2) / 25;
          setTilt({ x, y });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Smooth Scroll Handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 100; // Account for fixed header (approx 96px)
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setIsMenuOpen(false);
    }
  };

  // Filter skills logic
  const getFilteredSkills = () => {
    if (activeSkillTab === 'All') return data.skills;
    if (activeSkillTab === 'Development') return data.skills.filter(s => ['Frontend', 'Backend', 'Tools'].includes(s.category));
    if (activeSkillTab === 'AI & Intelligence') return data.skills.filter(s => s.category === 'AI');
    if (activeSkillTab === 'Creative Suite') return data.skills.filter(s => s.category === 'Creative');
    return [];
  };

  const filteredSkills = getFilteredSkills();
  const skillCategories = ['All', 'Development', 'AI & Intelligence', 'Creative Suite'];

  // Form Handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
    // Clear specific error on change
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const errors = { name: '', email: '', message: '' };
    let isValid = true;

    if (!contactForm.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!contactForm.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!contactForm.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    }

    setFormErrors(errors);

    if (isValid) {
      setFormStatus('success');
      // No auto-reset to allow user to see the success message
    }
  };

  const resetForm = () => {
    setFormStatus('idle');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden selection:bg-primary-500 selection:text-white">

      {/* Noise Overlay */}
      <div className="bg-noise"></div>

      {/* Dynamic Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(96, 125, 59, 0.15), transparent 80%)`
        }}
      />

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Parallax Blobs */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%]"
          style={{ transform: `translateY(-${scrollY * 0.2}px)` }}
        >
          <div className="w-full h-full bg-primary-900/10 rounded-full blur-[100px] animate-blob"></div>
        </div>

        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%]"
          style={{ transform: `translateY(-${scrollY * 0.15}px)` }}
        >
          <div className="w-full h-full bg-accent-900/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        </div>

        {/* Grid Overlay with Parallax Position */}
        <div
          className="absolute inset-0 bg-grid-pattern opacity-10"
          style={{ backgroundPosition: `0px -${scrollY * 0.05}px` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex-shrink-0 flex items-center gap-3">
              <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="text-2xl font-bold text-white tracking-tighter font-display">
                {data.name.split(' ')[0]}<span className="text-primary-500">.</span>
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-12">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`text-sm font-medium transition-all duration-300 relative group ${activeSection === link.href.substring(1)
                      ? 'text-primary-400'
                      : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 h-[1px] bg-primary-500 transition-all duration-300 ${activeSection === link.href.substring(1) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Unique Hero Section */}
      <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Typography */}
            <div className="text-left space-y-10 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">System Online</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter">
                  <span className="block text-white">Crafting</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 typewriter-cursor min-h-[1.1em]">
                    {displayedText}
                  </span>
                </h1>
              </div>

              <p className="max-w-xl text-xl text-gray-400 leading-relaxed font-light">
                Blurring the lines between <span className="text-white">code</span> and <span className="text-white">cinema</span>.
                Leveraging <span className="text-primary-400 font-medium">AI workflows</span> to build next-gen applications.
              </p>

              <div className="flex flex-wrap gap-6 pt-4">
                <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} className="group flex items-center gap-3 text-white border-b border-primary-500 pb-1 hover:text-primary-400 transition-colors">
                  Explore Work
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right Column: Visual Tech-Art Stack - Interactive */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative perspective-1000">
              {/* Decorative background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-500/20 blur-[80px] rounded-full"></div>

              <div
                className="relative w-72 h-80 sm:w-80 sm:h-96 transition-transform duration-100 ease-out"
                style={{
                  transform: `rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)`
                }}
              >
                {/* Layer 1: Code (Back) */}
                <div
                  className="absolute inset-0 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl transition-transform duration-200"
                  style={{ transform: `translateZ(-50px) translateX(${tilt.x * 1.5}px) translateY(${tilt.y * 1.5}px)` }}
                >
                  <div className="h-6 bg-gray-800 border-b border-gray-700 flex items-center px-3 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                  </div>
                  <div className="p-4 font-mono text-xs text-primary-300/50 space-y-1">
                    <p><span className="text-purple-400">const</span> <span className="text-yellow-400">reality</span> = <span className="text-blue-400">new</span> <span className="text-green-400">World</span>();</p>
                    <p>reality.<span className="text-blue-300">render</span>({'{'}</p>
                    <p className="pl-4">mode: <span className="text-accent-400">'cinematic'</span>,</p>
                    <p className="pl-4">ai: <span className="text-purple-400">true</span></p>
                    <p>{'})'};{'}'}</p>
                  </div>
                </div>

                {/* Layer 2: Video/Creative (Middle) */}
                <div
                  className="absolute inset-0 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl overflow-hidden"
                  style={{ transform: `rotate(-3deg) translateZ(0px) translateX(${tilt.x}px) translateY(${tilt.y}px)` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-900/20 to-transparent"></div>
                  <div className="h-full flex flex-col justify-center p-6 gap-3">
                    <div className="h-12 bg-gray-900/50 rounded flex items-center justify-center">
                      <div className="w-full h-8 flex items-end gap-1 px-2">
                        {[40, 70, 30, 80, 50, 90, 20, 60, 40].map((h, i) => (
                          <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-accent-500/50 rounded-t-sm"></div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 font-mono">
                      <span>REC</span>
                      <span>00:04:12</span>
                    </div>
                  </div>
                </div>

                {/* Layer 3: Digital Synthesis (Front) - Replaces Gemini Integration */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gray-900/90 backdrop-blur-xl border border-accent-500/50 rounded-2xl shadow-[0_0_30px_rgba(217,134,46,0.3)] flex flex-col items-center justify-center gap-3"
                  style={{ transform: `translateZ(50px) translateX(${-tilt.x}px) translateY(${-tilt.y}px)` }}
                >
                  <div className="relative">
                    <Wand className="w-12 h-12 text-accent-400 animate-float" />
                    <div className="absolute inset-0 bg-accent-400/20 blur-lg rounded-full"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white tracking-wider font-display">SYNTHESIS</p>
                    <p className="text-xs text-accent-400 uppercase tracking-widest">Art + Code</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Section - Editorial Layout */}
      <section id="about" ref={aboutRef} className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Image overlaps background */}
            <div
              className={`md:col-span-5 relative transition-all duration-1000 ease-bounce-out transform ${isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
            >
              <div className="aspect-[3/4] rounded-sm overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
                <img
                  src="/avatar.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-40"></div>
              </div>
              {/* Floating decorative elements */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary-600 rounded-full blur-[40px] opacity-40"></div>
            </div>

            {/* Text Content */}
            <div className="md:col-span-7 space-y-8 relative">
              <h2
                className={`text-4xl md:text-6xl font-bold text-white font-display tracking-tight leading-none transition-all duration-1000 delay-300 ease-bounce-out transform ${isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
              >
                Storyteller.<br />
                <span className="text-outline">Developer.</span><br />
                Artist.
              </h2>
              <div className="space-y-6 text-gray-400 text-lg font-light leading-relaxed max-w-2xl">
                <p
                  className={`transition-all duration-1000 delay-500 ease-bounce-out transform ${isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                >
                  I'm a creative technologist based in <span className="text-white font-medium">{data.location}</span>. My work exists at the intersection of technical precision and artistic expression.
                </p>
                <p
                  className={`transition-all duration-1000 delay-700 ease-bounce-out transform ${isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                >
                  Whether it's a responsive web app, a cinematic film edit, or an immersive game environment, I bring a unified vision of design and functionality. I believe in <span className="text-primary-400">AI-augmented development</span>—using intelligent tools to bridge the gap between complex logic and rapid creativity.
                </p>
              </div>

              <div
                className={`pt-8 grid md:grid-cols-2 gap-8 transition-all duration-1000 delay-1000 ease-bounce-out transform ${isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
              >
                <div className="space-y-2">
                  <h3 className="text-white font-display text-xl flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary-400" /> Experience
                  </h3>
                  <ul className="space-y-4 pt-2">
                    {data.experience.map((exp) => (
                      <li key={exp.id} className="border-l border-gray-800 pl-4 hover:border-primary-500 transition-colors">
                        <p className="text-white font-medium">{exp.role}</p>
                        <p className="text-sm text-gray-500">{exp.company}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-display text-xl flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-accent-400" /> Education
                  </h3>
                  <ul className="space-y-4 pt-2">
                    {data.education.map((edu) => (
                      <li key={edu.id} className="border-l border-gray-800 pl-4 hover:border-accent-500 transition-colors">
                        <p className="text-white font-medium">{edu.degree}</p>
                        <p className="text-sm text-gray-500">{edu.school}</p>
                        <p className="text-xs text-gray-600">{edu.period}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className={`flex items-end transition-all duration-1000 delay-1000 ease-bounce-out transform ${isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
              >
                <button className="text-primary-400 hover:text-white transition-colors border-b border-primary-500 pb-1 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      {data.philosophy && (
        <section className="py-32 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative text-center">
              {/* Big Quote Icon */}
              <div className="flex justify-center mb-8">
                <Quote className="w-20 h-20 text-primary-500/20 fill-primary-500/5 transform rotate-180" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white font-display mb-8 tracking-tight">
                {data.philosophy.title}
              </h3>

              <div className="relative">
                <p className="text-xl md:text-2xl font-light text-gray-300 leading-relaxed italic">
                  "{data.philosophy.content}"
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section - List Layout */}
      <section id="services" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20">
            <span className="text-primary-500 font-mono text-sm uppercase tracking-widest">Capabilities</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 font-display">Creative & <br />Technical Services</h2>
          </div>

          <div className="divide-y divide-gray-800 border-t border-gray-800">
            {data.services.map((service, index) => {
              const Icon = IconMap[service.iconName] || Code;
              return (
                <div key={service.id} className="group py-12 flex flex-col md:flex-row items-start gap-8 cursor-pointer hover:bg-gray-800/20 transition-colors px-4 md:px-6 rounded-2xl">
                  <span className="text-gray-600 font-mono text-sm mt-4">0{index + 1}</span>

                  <div className="flex-1">
                    <div className="flex items-center gap-6 mb-4">
                      <div className="p-3 rounded-xl bg-gray-800 text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-lg border border-gray-700/50">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-200 group-hover:text-white transition-colors font-display">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-gray-500 text-lg leading-relaxed group-hover:text-gray-300 transition-colors max-w-2xl md:ml-[88px]">
                      {service.description}
                    </p>
                  </div>

                  <div className="hidden md:flex mt-4 text-gray-600 group-hover:text-primary-400 transition-colors transform group-hover:translate-x-2 duration-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section - Editorial Zig-Zag */}
      <section id="projects" className="py-32 relative z-10 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-24 flex justify-between items-end">
            <div>
              <span className="text-primary-500 font-mono text-sm uppercase tracking-widest">Selected Works</span>
              <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 font-display">Featured <br />Projects</h2>
            </div>
            <button
              onClick={onGalleryClick}
              className="hidden md:flex items-center gap-2 text-white border-b border-white pb-1 hover:text-primary-400 hover:border-primary-400 transition-colors"
            >
              View Archives
            </button>
          </div>

          <div className="space-y-32">
            {/* Show only first 3 projects in the main view */}
            {data.projects.slice(0, 3).map((project: Project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <div className="mt-24 text-center md:hidden">
            <button
              onClick={onGalleryClick}
              className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:text-primary-400 hover:border-primary-400 transition-colors"
            >
              View All Projects
            </button>
          </div>
        </div>
      </section>

      {/* Toolbox/Skills Section - Interactive Tabbed Grid */}
      <section id="skills" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-500 font-mono text-sm uppercase tracking-widest">The Inventory</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white font-display mt-2">Tools of the Trade</h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-16 border-b border-gray-800 pb-1">
            {skillCategories.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSkillTab(tab)}
                className={`text-lg md:text-xl font-display transition-all duration-300 relative pb-4 -mb-1.5 border-b-2 ${activeSkillTab === tab
                  ? 'text-white border-primary-500'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredSkills.map((skill, index) => {
              const Icon = IconMap[skill.iconName] || Code;
              const isAI = skill.category === 'AI';
              const isCreative = skill.category === 'Creative';

              return (
                <div
                  key={skill.name + index}
                  className={`group relative rounded-xl border transition-all duration-300 hover:shadow-2xl flex items-center gap-4 p-4 h-20
                      ${isAI
                      ? 'bg-gray-900/60 border-primary-500/30 hover:border-primary-500/80 hover:bg-gray-800'
                      : isCreative
                        ? 'bg-gray-900/60 border-accent-900/30 hover:border-accent-500/80 hover:bg-gray-800'
                        : 'bg-gray-900/60 border-gray-800 hover:border-gray-600 hover:bg-gray-800'
                    }
                    `}
                >
                  {/* Glow effect for AI - Added rounded-xl since overflow is not hidden */}
                  {isAI && <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>}

                  <div className={`
                       relative p-2 rounded-lg transition-colors duration-300 flex-shrink-0
                       ${isAI
                      ? 'bg-primary-900/20 text-primary-400 group-hover:bg-primary-500 group-hover:text-white'
                      : isCreative
                        ? 'bg-accent-900/20 text-accent-400 group-hover:bg-accent-500 group-hover:text-white'
                        : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white'
                    }
                     `}>
                    <Icon className="w-6 h-6 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-6" />

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 whitespace-nowrap transform translate-y-2 group-hover:translate-y-0">
                      <div className="font-semibold text-white text-xs">{skill.name}</div>
                      <div className="text-[10px] text-primary-400">{skill.category}</div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>

                  <div className="flex flex-col z-10">
                    <span className="text-gray-200 font-medium group-hover:text-white transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 group-hover:text-gray-400">
                      {skill.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section - Minimal Integrated */}
      <section id="contact" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/2 space-y-8">
              <h2 className="text-5xl md:text-7xl font-bold text-white font-display tracking-tight">
                Let's create<br />something<br />iconic.
              </h2>
              <div className="space-y-4 text-gray-400">
                <p className="text-lg">Have a vision for a project? I'm currently available for freelance work and collaborations.</p>
                <a href={`mailto:${data.email}`} className="text-2xl text-white border-b border-primary-500 pb-1 hover:text-primary-400 transition-colors inline-block">
                  {data.email}
                </a>
              </div>
              <div className="flex gap-6 pt-4">
                {data.socials.map((social) => {
                  const Icon = IconMap[social.iconName] || ExternalLink;
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-transform hover:-translate-y-1"
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="md:w-1/2 relative min-h-[400px]">
              {formStatus === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 bg-gray-800/30 border border-gray-700 rounded-2xl p-8 animate-in fade-in zoom-in duration-500">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                      <CheckCircle className="w-12 h-12 text-white animate-[bounce_1s_infinite]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-3xl md:text-4xl font-bold text-white font-display">Message Sent!</h3>
                    <p className="text-gray-400 text-lg">
                      Thank you, <span className="text-primary-400 font-medium">{contactForm.name}</span>.<br />
                      I'll be in touch shortly.
                    </p>
                  </div>

                  <button
                    onClick={resetForm}
                    className="mt-4 px-6 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors text-sm font-medium"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="space-y-8 transition-opacity duration-300" onSubmit={handleContactSubmit} noValidate>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-mono text-gray-500 uppercase">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        className={`w-full bg-transparent border-b py-3 text-white focus:outline-none transition-all duration-300 ${formErrors.name
                          ? 'border-red-500 focus:border-red-500 focus:shadow-[0_10px_20px_-10px_rgba(239,68,68,0.2)]'
                          : 'border-gray-700 hover:border-primary-500/50 focus:border-primary-500 focus:shadow-[0_10px_20px_-10px_rgba(96,125,59,0.3)]'
                          }`}
                        placeholder="John Doe"
                      />
                      {formErrors.name && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-mono text-gray-500 uppercase">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        className={`w-full bg-transparent border-b py-3 text-white focus:outline-none transition-all duration-300 ${formErrors.email
                          ? 'border-red-500 focus:border-red-500 focus:shadow-[0_10px_20px_-10px_rgba(239,68,68,0.2)]'
                          : 'border-gray-700 hover:border-primary-500/50 focus:border-primary-500 focus:shadow-[0_10px_20px_-10px_rgba(96,125,59,0.3)]'
                          }`}
                        placeholder="john@example.com"
                      />
                      {formErrors.email && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.email}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-gray-500 uppercase">Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={contactForm.message}
                      onChange={handleInputChange}
                      className={`w-full bg-transparent border-b py-3 text-white focus:outline-none transition-all duration-300 resize-none ${formErrors.message
                        ? 'border-red-500 focus:border-red-500 focus:shadow-[0_10px_20px_-10px_rgba(239,68,68,0.2)]'
                        : 'border-gray-700 hover:border-primary-500/50 focus:border-primary-500 focus:shadow-[0_10px_20px_-10px_rgba(96,125,59,0.3)]'
                        }`}
                      placeholder="Tell me about your project..."
                    ></textarea>
                    {formErrors.message && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-4 font-bold rounded-lg transition-all duration-300 bg-white text-gray-900 hover:bg-primary-500 hover:text-white flex items-center gap-2"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm font-mono">
            © {new Date().getFullYear()} {data.name}
          </p>
          <div className="flex gap-8 text-sm text-gray-600 font-mono items-center">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <button onClick={onAdminClick} className="hover:text-white transition-colors flex items-center gap-1">
              <Lock className="w-3 h-3" /> Admin
            </button>
          </div>
        </div>
      </footer>


      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-24 z-40 p-3 rounded-full bg-gray-900/80 backdrop-blur border border-gray-700 shadow-xl text-gray-400 hover:text-primary-400 hover:border-primary-500 transition-all duration-300 transform ${scrollY > 500 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
          }`}
        aria-label="Back to Top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'gallery'>('home');

  return (
    <PortfolioProvider>
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full"
          >
            <MainPortfolio
              onAdminClick={() => setCurrentView('admin')}
              onGalleryClick={() => setCurrentView('gallery')}
            />
          </motion.div>
        )}

        {currentView === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full fixed inset-0 z-50 overflow-y-auto bg-gray-900"
          >
            <AdminDashboard onBack={() => setCurrentView('home')} />
          </motion.div>
        )}

        {currentView === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full fixed inset-0 z-50 overflow-y-auto bg-gray-900"
          >
            <ProjectGallery onBack={() => setCurrentView('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </PortfolioProvider>
  );
};

export default App;
