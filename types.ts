
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  demoUrl?: string;
  repoUrl?: string;
}

export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Creative' | 'Tools' | 'AI';
  iconName: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  iconName: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  period: string;
  description?: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  services: Service[]; // General high-level skills
  skills: Skill[]; // Specific Tech Stack & Tools
  projects: Project[];
  experience: Experience[];
  education: Education[];
  socials: SocialLink[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}