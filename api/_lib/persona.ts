export const PERSONA = {
  personal: {
    name: "Harsh Gupta",
    phone: "+1 (919) 641-8348",
    email: "harshgupta.duke@gmail.com",
    portfolio: "tabsoverspaces4.github.io",
    linkedin: "linkedin.com/in/harshguptaworks",
    github: "github.com/TabsOverSpaces4",
    target: "Summer 2026 internships — Software Engineering and AI/ML",
    current_location: "Durham, NC (Duke University)",
    relocation: "Open to relocating to any location within the United States"
  },
  education: [
    { institution: "Duke University", degree: "M.Eng. Management", gpa: "3.66/4.0", dates: "Aug 2025 – May 2027",
      coursework: ["Managing AI in Business", "Design Thinking", "Marketing", "Product Management in High Tech Industries"],
      activities: ["Co-authoring HCI research on AI tools and user critical thinking", "Cred-Ability capstone — FinTech product strategy lead"] },
    { institution: "SRM Institute of Science and Technology", degree: "B.E. Computer Science (Cloud Computing)", gpa: "3.74/4.0", dates: "2019–2023",
      research: { title: "CNN and Sentinel-2 Imagery for Forest Cover Change Prediction in the North-Western Himalayas", grade: "A+",
        tools: ["SciPy", "NumPy", "Matplotlib"], methods: ["statistical analysis", "image processing", "CNN"] } }
  ],
  skills: {
    languages: ["JavaScript", "TypeScript", "Python", "SQL", "HTML/CSS", "Shell/Bash"],
    ai_ml: ["PyTorch", "LangChain", "LLM/GenAI", "OpenAI APIs", "GPT-4o mini", "CNN", "Anthropic Claude API", "prompt engineering", "agentic AI"],
    frontend: ["React", "React Native", "Next.js", "Tailwind CSS", "Vite"],
    backend: ["Node.js", "Express", "Puppeteer"],
    cloud_devops: ["AWS (EC2, S3, RDS)", "Docker", "CI/CD", "Vercel", "Linux"],
    tools: ["Git", "Axios", "ESLint"],
    methodologies: ["Agile", "Design Thinking", "Enterprise Design Thinking (IBM)", "VRIO Analysis", "Business Process Reengineering"],
    product: ["User research", "User interviews", "Product strategy", "Gamification design"]
  },
  certifications: ["AWS Academy Graduate", "React (certification)", "Duke Fuqua Innovation & Entrepreneurship", "IBM Enterprise Design Thinking"],
  experience: [
    { company: "Crewscale", title: "Software Development Engineer (SDE)", dates: "Jul 2024 – Jun 2025", location: "Bangalore, India", product: "Beanbag.ai",
      bullets: [
        "Led business process reengineering (BPR) for Beanbag.ai; automated LinkedIn workflows; +60% user efficiency",
        "Built agentic AI with LangChain + OpenAI APIs; Puppeteer automations cut manual endorsement time 85% at 99.9% uptime",
        "Shipped customer-facing AI/ML features end-to-end using GPT-4o mini for chatbot and analytics"
      ] },
    { company: "Intelliflow.AI", title: "Software Developer", dates: "Jun 2023 – Mar 2024", location: "Bangalore, India",
      bullets: [
        "Built React.js / React Native / Node.js / Docker apps; reduced deploy time 60%; AWS infrastructure",
        "Redesigned critical UI flows; user satisfaction improved from 82% to 95%",
        "Led Workflow++ initiative; shipped eSignature and Workflow Builder features"
      ] },
    { company: "KredX", title: "Web/App Developer Intern", dates: "Jun 2022 – Sep 2022", location: "Bangalore, India", domain: "FinTech",
      bullets: [
        "Built BNPL calculator in React serving 2,000+ daily users; +45% stability improvement",
        "Created email templates and landing pages; +60% engagement lift"
      ] },
    { company: "Capgemini", title: "Cloud Engineer Intern", dates: "Aug 2021 – Dec 2021", location: "Bangalore, India",
      bullets: ["Managed AWS infrastructure (EC2, S3, RDS); shell scripting automation on Linux"] }
  ],
  projects: [
    { name: "Mood Curator", role: "Solo developer",
      description: "AI-powered situation-to-playlist curator. Users describe a real-life situation; Claude Sonnet analyzes cognitive load, energy, emotional context and returns a Spotify-powered playlist with rationale.",
      tech: ["React 19", "TypeScript", "Vite", "Tailwind", "Express", "Anthropic SDK", "Spotify API"] },
    { name: "AssistAI", role: "Developer / Researcher",
      description: "Privacy-first Chrome extension measuring cognitive engagement with AI assistants (ChatGPT, Claude, Gemini, Perplexity). Tracks behavioral metadata — not content. Outputs Cognitive Engagement Score and AI Reliance Score via Gemini API. Tied to co-authored HCI research." },
    { name: "The Crux", role: "Product Owner", dates: "Jun 2024 – Jul 2025",
      description: "AI book discovery platform with recommendation engine and vector search. React, Next.js, Vercel serverless." },
    { name: "Cred-Ability", role: "FinTech Product Strategy Lead (Duke)", dates: "Aug – Dec 2025",
      description: "Financial inclusion platform; 44+ user interviews, VRIO analysis, gamified learning design." }
  ],
  research: {
    current: "Co-authoring HCI research at Duke on AI tools and user critical thinking (ties to AssistAI).",
    published: "CNN + Sentinel-2 Imagery for Forest Cover Change Prediction (North-Western Himalayas), A+ grade, SRM."
  },
  differentiators: [
    "Bridges engineering and management — M.Eng. Management at Duke + 3 years SDE",
    "End-to-end AI product builder — prompt engineering to production deployment",
    "Active HCI researcher on AI and human cognition",
    "Multi-project AI portfolio: agentic (Crewscale), situation-aware recs (Mood Curator), cognitive measurement (AssistAI)",
    "FinTech depth across industry (KredX) and academic (Cred-Ability) work"
  ]
} as const;
