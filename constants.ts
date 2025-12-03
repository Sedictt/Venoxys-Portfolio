
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
      id: "p-librowse",
      title: "Librowse",
      description: "A comprehensive book lending and borrowing platform for PLV, featuring real-time availability tracking, smart recommendations, and an integrated AI chat assistant.",
      technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
      imageUrl: "/projects/librowse/Librowse_Home_Page.png",
      demoUrl: "https://librowse.onrender.com",
      repoUrl: "#",
      category: 'Applications',
      developmentTime: "3 Months",
      aiToolsUsed: ["ChatGPT", "GitHub Copilot"],
      features: [
        "Real-time book availability tracking",
        "Integrated AI Chat Assistant",
        "Daily check-in & gamification system",
        "Automated violation monitoring & reporting"
      ],
      aiDescription: "AI was utilized to generate the initial database schema and API endpoints. The chat assistant logic was refined using LLMs to provide accurate book recommendations based on user history.",
      challenge: "Implementing a real-time notification system for due dates and chat messages that scales efficiently with a large user base.",
      gallery: [
        "/projects/librowse/Librowse_Home_Page.png",
        "/projects/librowse/Librowse_Books_Page.png",
        "/projects/librowse/Librowse_Chat_Modal.png",
        "/projects/librowse/Librowse_Chats_Page.png",
        "/projects/librowse/Librowse_Daily_Check-in_Modal.png",
        "/projects/librowse/Librowse_Modal.png",
        "/projects/librowse/Librowse_Monitoring_Page.png",
        "/projects/librowse/Librowse_My_Books_Tab.png",
        "/projects/librowse/Librowse_Notification_Modal.png",
        "/projects/librowse/Librowse_Profile_Page.png",
        "/projects/librowse/Librowse_Request_Page.png",
        "/projects/librowse/Librowse_Reviews_Tab.png",
        "/projects/librowse/Librowse_Settings_Tab.png",
        "/projects/librowse/Librowse_Verification_Tab.png",
        "/projects/librowse/Librowse_Violations_Tab.png"
      ]
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