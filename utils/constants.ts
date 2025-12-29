export const CHARACTERS = {
  spiderman: { 
    src: '/images/spidermansmall.png', 
    alt: 'Spider-Man',
    emoji: '🕷️',
    colors: {
      primary: '#E23636',
      secondary: '#0476F2',
      background: '#FFEBEE',
      accent: '#FFD700'
    }
  },
  kimpossible: { 
    src: '/images/supergirl.png', 
    alt: 'Kim Possible',
    emoji: '🦸‍♀️',
    colors: {
      primary: '#FF6600',
      secondary: '#4B5320',
      background: '#FFF3E0',
      accent: '#00A651'
    }
  },
  thanos: { 
    src: '/images/Thanos.png', 
    alt: 'Thanos',
    emoji: '👾',
    colors: {
      primary: '#673ab7',
      secondary: '#F4B3C2',
      background: '#F3E5F5',
      accent: '#FFD700'
    }
  },
  peppapig: { 
    src: '/images/peppapig.png', 
    alt: 'Peppa Pig',
    emoji: '🐷',
    colors: {
      primary: '#F4B3C2',
      secondary: '#673ab7',
      background: '#FCE4EC',
      accent: '#87CEEB'
    }
  },
  blackpanther: { 
    src: '/images/blackpantherlogo.png', 
    alt: 'Black Panther',
    emoji: '🐾',
    colors: {
      primary: '#212121',
      secondary: '#9C27B0',
      background: '#ECEFF1',
      accent: '#9C27B0'
    }
  },
  tomjerry: { 
    src: '/images/tom.png', 
    alt: 'Tom & Jerry',
    emoji: '🐱🐭',
    colors: {
      primary: '#78909C',
      secondary: '#A1887F',
      background: '#EFEBE9',
      accent: '#FFD700'
    }
  },
  olaf: { 
    src: '/images/olaf.png', 
    alt: 'Olaf & Sven',
    emoji: '⛄',
    colors: {
      primary: '#B3E5FC',
      secondary: '#0288D1',
      background: '#E1F5FE',
      accent: '#FF6B9D'
    }
  },
  captainamerica: { 
    src: '/images/Captain america.png', 
    alt: 'Captain America',
    emoji: '🛡️',
    colors: {
      primary: '#0D47A1',
      secondary: '#B71C1C',
      background: '#E3F2FD',
      accent: '#FFFFFF'
    }
  },
  hulk: {
    src: '/images/hulk.png',
    alt: 'Hulk',
    emoji: '💚',
    colors: {
      primary: '#4CAF50',
      secondary: '#2E7D32',
      background: '#E8F5E9',
      accent: '#76FF03'
    }
  },
  bheem: {
    src: '/images/chottabheem.png',
    alt: 'Chhota Bheem',
    emoji: '🦸',
    colors: {
      primary: '#FF9933',
      secondary: '#E65100',
      background: '#FFF3E0',
      accent: '#FFD54F'
    }
  }
}

export const STEPS = [
  { number: 1, title: 'Empathize & Define', subtitle: 'The Detective', char: 'kimpossible' as keyof typeof CHARACTERS },
  { number: 2, title: 'Define', subtitle: 'The Problem Story', char: 'thanos' as keyof typeof CHARACTERS },
  { number: 3, title: 'Ideate', subtitle: 'Crazy 6', char: 'blackpanther' as keyof typeof CHARACTERS },
  { number: 4, title: 'Evaluate', subtitle: 'The Scorecard', char: 'olaf' as keyof typeof CHARACTERS },
  { number: 5, title: 'Prototype', subtitle: 'The Final Solution', char: 'captainamerica' as keyof typeof CHARACTERS },
]

export const COLORS = {
  primary: '#F37021', // SNS Orange
  secondary: '#00A651', // SNS Green
  light: '#FEF3ED',
  dark: '#222222',
}
