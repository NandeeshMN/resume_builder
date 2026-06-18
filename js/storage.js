// Storage and Mock Data Handler for ResuMetric

const STORAGE_KEY = 'resumetric_data';

// Default Rohan Deshmukh Mock Data (Image 1)
const DEFAULT_RESUME_DATA = {
  templateId: 'professional', // default template
  styles: {
    themeColor: '#2563EB', // Brand Blue
    fontFamily: 'sans',    // Outfit
    margins: '20',         // 20px
    displayPhoto: true,
    highlightSkillsBg: true
  },
  personal: {
    fullName: 'Rohan Deshmukh',
    email: 'rohan.architect@example.com',
    phone: '+91 98765 43210',
    location: 'Pune, India',
    linkedin: 'linkedin.com/in/rohan-mca',
    github: 'github.com/rohan-mca',
    photoDataUrl: '' // Base64 image data can go here
  },
  objective: 'Ambitious MCA Graduate with a focus on Full-Stack Engineering and Cloud Architecture. Proven track record of developing scalable web applications using React, Node.js, and AWS. Passionate about software craftsmanship, clean code, and solving complex algorithmic challenges. Seeking to leverage technical expertise in a high-growth engineering environment.',
  education: [
    {
      id: 'edu-1',
      university: 'Savitribai Phule Pune University',
      degree: 'Master of Computer Applications (MCA)',
      year: '2022 - 2024',
      grade: 'CGPA: 9.2/10'
    }
  ],
  skills: [
    'React/Next.js',
    'Node.js',
    'TypeScript',
    'PostgreSQL',
    'AWS Lambda',
    'Docker',
    'Git/CI-CD'
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Full-Stack Development Intern',
      company: 'TechVision Systems | Remote',
      duration: 'Jun 2024 - Present',
      bullets: [
        'Architected and implemented a real-time dashboard using React and WebSockets, reducing data latency by 40%.',
        'Optimized MongoDB queries which improved application load times by 25% for high-traffic endpoints.',
        'Collaborated with senior architects to migrate legacy monolithic services to a microservices architecture using Docker.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Open Source Contributor',
      company: 'Various JS Frameworks | GitHub',
      duration: 'Jun 2023 - Dec 2023',
      bullets: [
        'Contributed to core library features in several popular utility libraries, focusing on performance bottlenecks.',
        'Authored documentation and unit tests, achieving 95% code coverage for new modules.'
      ]
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Real-time Analytics Dashboard',
      role: 'Lead Developer',
      duration: 'Mar 2024 - May 2024',
      description: 'Built a collaborative dashboard featuring live charts and logs. Implemented SSE (Server-Sent Events) and custom Redis caching pipelines to handle high data throughput.'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'AWS Certified Developer - Associate',
      issuer: 'Amazon Web Services',
      date: '2024'
    }
  ],
  languages: 'English, Hindi, Marathi',
  achievements: 'Won 1st place in National Level Smart India Hackathon 2023.\nPublished technical article on Microservices optimization, gaining 10k+ views.'
};

/**
 * Loads resume data from local storage or returns mock data if empty
 * @returns {Object} Resume data object
 */
function loadResumeData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      console.log('No saved data found. Loading default template mock data.');
      return JSON.parse(JSON.stringify(DEFAULT_RESUME_DATA));
    }
    
    const parsed = JSON.parse(raw);
    
    // Fallback merge to ensure structure compatibility with updates
    const merged = {
      ...DEFAULT_RESUME_DATA,
      ...parsed,
      styles: { ...DEFAULT_RESUME_DATA.styles, ...parsed.styles },
      personal: { ...DEFAULT_RESUME_DATA.personal, ...parsed.personal }
    };
    
    return merged;
  } catch (error) {
    console.error('Failed to load resume data:', error);
    return JSON.parse(JSON.stringify(DEFAULT_RESUME_DATA));
  }
}

/**
 * Saves resume data to local storage
 * @param {Object} data - The resume data to persist
 */
function saveResumeData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save resume data:', error);
  }
}
