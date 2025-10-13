
export const LANGUAGES = [
  { 
    code: 'en', 
    name: 'English',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" fill="#012169"/>
        <path d="M2.5 5.5L16 16M29.5 26.5L16 16M16 16L2.5 26.5M16 16L29.5 5.5" stroke="white" strokeWidth="3"/>
        <path d="M2.5 5.5L16 16M29.5 26.5L16 16M16 16L2.5 26.5M16 16L29.5 5.5" stroke="#C8102E" strokeWidth="2"/>
        <path d="M16 2V30M2 16H30" stroke="white" strokeWidth="5"/>
        <path d="M16 2V30M2 16H30" stroke="#C8102E" strokeWidth="3"/>
      </svg>
    )
  },
  { 
    code: 'es', 
    name: 'Español',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
        <rect y="5" width="32" height="6" fill="#AA151B"/>
        <rect y="11" width="32" height="10" fill="#F1BF00"/>
        <rect y="21" width="32" height="6" fill="#AA151B"/>
      </svg>
    )
  },
] as const;