
import { PortfolioData } from './types';

export const PORTFOLIO_DATA: PortfolioData = {
  name: "Venoxy",
  title: "Creative Developer & Multimedia Artist",
  bio: "I am a multidisciplinary creator blurring the lines between technology and art. I specialize in AI-augmented workflows to accelerate development and unlock new creative possibilities. From immersive web experiences to indie games, I believe in mastering both the code and the canvas.",
  email: "venoxyarts@gmail.com",
  location: "Philippines",
  services: [
    {
      id: "s0",
      title: "AI Workflow Integration",
      description: "Leveraging LLMs and automation to accelerate development cycles and build adaptive systems.",
      iconName: "Sparkles"
    },
    {
      id: "s1",
      title: "Web Development",
      description: "Building responsive, interactive, and performant frontend applications.",
      iconName: "Code"
    },
    {
      id: "s2",
      title: "Graphic Design",
      description: "Creating visual identities, UI assets, and branding materials.",
      iconName: "Palette"
    },
    {
      id: "s3",
      title: "Video Editing",
      description: "Post-production, color grading, and motion graphics for film and social.",
      iconName: "Film"
    },
    {
      id: "s4",
      title: "Game Development",
      description: "Designing and programming interactive 2D/3D gaming experiences.",
      iconName: "Gamepad2"
    },
    {
      id: "s5",
      title: "Filmmaking",
      description: "Directing and producing narrative and documentary short films.",
      iconName: "Clapperboard"
    }
  ],
  skills: [
    // AI & Intelligence
    { name: "Gemini API", category: "AI", iconName: "Sparkles" },
    { name: "OpenAI API", category: "AI", iconName: "Bot" },
    { name: "Generative AI", category: "AI", iconName: "Brain" },
    { name: "Prompt Eng.", category: "AI", iconName: "MessageSquare" },
    { name: "Stable Diffusion", category: "AI", iconName: "Cpu" },

    // Frontend Stack
    { name: "HTML5", category: "Frontend", iconName: "Layout" },
    { name: "CSS3", category: "Frontend", iconName: "Palette" },
    { name: "JavaScript", category: "Frontend", iconName: "Code" },
    { name: "React", category: "Frontend", iconName: "Code" },
    { name: "TypeScript", category: "Frontend", iconName: "Code" },
    { name: "Tailwind CSS", category: "Frontend", iconName: "Layout" },
    { name: "Flutter", category: "Frontend", iconName: "Smartphone" },

    // Backend / Languages
    { name: "Node.js", category: "Backend", iconName: "Server" },
    { name: "Java", category: "Backend", iconName: "Coffee" },
    { name: "C#", category: "Backend", iconName: "Code" },

    // Creative Tools
    { name: "Photoshop", category: "Creative", iconName: "Image" },
    { name: "Illustrator", category: "Creative", iconName: "PenTool" },
    { name: "After Effects", category: "Creative", iconName: "Film" },
    { name: "Figma", category: "Creative", iconName: "PenTool" },
    { name: "IbisPaint X", category: "Creative", iconName: "Brush" },
    { name: "Canva", category: "Creative", iconName: "Layout" },

    // Dev Tools & Tech
    { name: "Unity", category: "Tools", iconName: "Gamepad2" },
    { name: "VS Code", category: "Tools", iconName: "Terminal" },
    { name: "Visual Studio", category: "Tools", iconName: "Monitor" },
    { name: "Vite", category: "Tools", iconName: "Zap" },
    { name: "GitHub", category: "Tools", iconName: "Github" },
    { name: "Office Suites", category: "Tools", iconName: "FileText" },
  ],
  experience: [
    {
      id: "exp-1",
      role: "Multimedia Specialist",
      company: "Visionary Studios",
      period: "2022 - Present",
      description: [
        "Spearhead the frontend development of interactive web experiences using React and WebGL.",
        "Produce and edit promotional video content for client campaigns, increasing engagement by 150%.",
        "Design assets and UI elements for internal game prototypes."
      ]
    },
    {
      id: "exp-2",
      role: "Freelance Creative Developer",
      company: "Self-Employed",
      period: "2019 - 2022",
      description: [
        "Delivered bespoke websites for artists and musicians, focusing on unique visual identities.",
        "Directed and edited short films and music videos featured in local festivals.",
        "Collaborated with indie game developers on level design and environmental art."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Science in Information Technology",
      school: "Pamantasan ng Lungsod ng Valenzuela",
      period: "Current",
      description: "Focusing on software engineering, system architecture, and multimedia computing."
    }
  ],
  projects: [
    {
      id: "p1",
      title: "Neon Horizon",
      description: "A cyberpunk-themed 3D browser game built with Three.js and React. Players navigate a procedurally generated city to a synthwave soundtrack.",
      technologies: ["React", "Three.js", "WebGL", "Blender"],
      imageUrl: "https://picsum.photos/800/600?random=10",
      demoUrl: "#",
      repoUrl: "#",
      category: 'Applications',
      developmentTime: "2 Weeks",
      aiToolsUsed: ["GitHub Copilot", "Midjourney"],
      features: [
        "Procedurally generated 3D cityscapes",
        "Reactive audio visualization",
        "Post-processing bloom and glitch effects",
        "High-score leaderboard system"
      ],
      aiDescription: "Midjourney was instrumental in conceptualizing the visual style, generating mood boards for the cyberpunk aesthetic. GitHub Copilot accelerated the Three.js boilerplate code and helped optimize the procedural generation algorithms, reducing development time by approximately 40%.",
      challenge: "Creating a performant 3D procedural city in the browser that reacts to audio input in real-time without dropping frames on average hardware."
    },
    {
      id: "p2",
      title: "Cinematic Reel 2024",
      description: "A compilation of my best work in cinematography and video editing, featuring color grading, motion graphics, and sound design.",
      technologies: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
      imageUrl: "https://picsum.photos/800/600?random=11",
      demoUrl: "#",
      repoUrl: "#",
      category: 'Video Editing'
    },
    {
      id: "p3",
      title: "Lens & Light Portfolio",
      description: "A high-performance photography gallery featuring masonry layouts, lazy loading, and lightbox interactions.",
      technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
      imageUrl: "https://picsum.photos/800/600?random=12",
      demoUrl: "#",
      repoUrl: "#",
      category: 'Applications',
      developmentTime: "3 Days",
      aiToolsUsed: ["ChatGPT", "V0"],
      features: [
        "Masonry grid layout with lazy loading",
        "Custom lightbox with zoom and pan",
        "EXIF data extraction and display",
        "Dark mode support"
      ],
      aiDescription: "V0 was used to rapidly prototype the UI components, specifically the masonry grid and lightbox. ChatGPT assisted in writing the complex logic for EXIF data parsing and image optimization strategies.",
      challenge: "Building a masonry layout that handles images of varying aspect ratios gracefully while maintaining fast load times and smooth transitions."
    }
  ],
  socials: [
    { platform: "ArtStation", url: "https://artstation.com", iconName: "Palette" },
    { platform: "GitHub", url: "https://github.com", iconName: "Github" },
    { platform: "Instagram", url: "https://instagram.com", iconName: "Camera" },
    { platform: "YouTube", url: "https://youtube.com", iconName: "Youtube" },
  ],
  philosophy: {
    title: "Why I'm Not Your Average 'Vibe Coder'",
    content: "I try to use AI thoughtfully, not as a shortcut, but as a tool to help bring my ideas to life. I don’t expect a fully functional app to appear from a single prompt. Instead, I focus on giving clear instructions, breaking tasks into smaller steps, and guiding AI with the concepts I want to explore. In this process, AI becomes more of a collaborator than just a tool, it helps me experiment, refine, and realize ideas that might otherwise take much longer to develop. I see it as a way to enhance my own abilities, learn in the process, and slowly turn my plans into something tangible. Using AI this way has taught me patience, careful thinking, and the importance of guiding technology with intention rather than relying on it blindly."
  }
};

export const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Tech Stack', href: '#skills' },
  { name: 'Contact', href: '#contact' },
];