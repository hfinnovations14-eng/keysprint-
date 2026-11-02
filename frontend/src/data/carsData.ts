import { CarModelId } from '../components/common/SvgCar';

export interface CarItem {
  id: CarModelId;
  name: string;
  category: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  price: number;
  owned: boolean;
  equipped: boolean;
  description: string;
  topSpeedTier: string;
  accelerationTier: string;
  trailColor: string;
}

export const CARS_DATA: CarItem[] = [
  {
    id: 'starter',
    name: 'Starter Car',
    category: 'Common',
    price: 0,
    owned: true,
    equipped: true,
    description: 'The reliable lightweight street racer provided to every rookie KeySprint driver.',
    topSpeedTier: 'A',
    accelerationTier: 'A',
    trailColor: '#38BDF8'
  },
  {
    id: 'blaze',
    name: 'Blaze Runner',
    category: 'Rare',
    price: 1200,
    owned: true,
    equipped: false,
    description: 'Fiery crimson aerodynamics with racing decals tuned for lightning reflexes.',
    topSpeedTier: 'A+',
    accelerationTier: 'A',
    trailColor: '#FF5A1F'
  },
  {
    id: 'golden',
    name: 'Golden Flash',
    category: 'Epic',
    price: 1800,
    owned: false,
    equipped: false,
    description: 'Gold-plated composite bodywork that glistens under the arena floodlights.',
    topSpeedTier: 'S',
    accelerationTier: 'A+',
    trailColor: '#FBBF24'
  },
  {
    id: 'neon',
    name: 'Neon Rider',
    category: 'Epic',
    price: 2000,
    owned: false,
    equipped: false,
    description: 'Cyber-infused purple chassis with ultraviolet underglow neon bars.',
    topSpeedTier: 'S',
    accelerationTier: 'S',
    trailColor: '#C084FC'
  },
  {
    id: 'shadow',
    name: 'Shadow X',
    category: 'Legendary',
    price: 2500,
    owned: false,
    equipped: false,
    description: 'Ultra-rare matte stealth carbon silhouette feared across all competitive tracks.',
    topSpeedTier: 'S+',
    accelerationTier: 'S+',
    trailColor: '#EF4444'
  },
  {
    id: 'ice',
    name: 'Ice Drift',
    category: 'Rare',
    price: 1400,
    owned: false,
    equipped: false,
    description: 'Cool frosted cyan body that leaves chilled mist vapor in its slipstream.',
    topSpeedTier: 'A',
    accelerationTier: 'A+',
    trailColor: '#67E8F9'
  },
  {
    id: 'forest',
    name: 'Forest Beast',
    category: 'Rare',
    price: 1500,
    owned: false,
    equipped: false,
    description: 'Emerald green muscle power inspired by high-speed woodland rallies.',
    topSpeedTier: 'A+',
    accelerationTier: 'A',
    trailColor: '#4ADE80'
  },
  {
    id: 'rose',
    name: 'Rose Racer',
    category: 'Epic',
    price: 1900,
    owned: false,
    equipped: false,
    description: 'Daring magenta grand-tourer delivering unmatched cornering elegance.',
    topSpeedTier: 'S',
    accelerationTier: 'A',
    trailColor: '#F472B6'
  },
  {
    id: 'retro',
    name: 'Retro Classic',
    category: 'Epic',
    price: 2200,
    owned: false,
    equipped: false,
    description: 'Vintage racing heritage engineered with timeless aerodynamic contours.',
    topSpeedTier: 'S',
    accelerationTier: 'A+',
    trailColor: '#F59E0B'
  },
  {
    id: 'jeep',
    name: 'Jeep Pioneer',
    category: 'Common',
    price: 1600,
    owned: false,
    equipped: false,
    description: 'All-terrain endurance cruiser built for rugged resilience across tough tracks.',
    topSpeedTier: 'A',
    accelerationTier: 'A',
    trailColor: '#10B981'
  }
];

export interface TrackItem {
  id: string;
  name: string;
  plays: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  bgGradient: string;
  accentColor: string;
  iconName: string;
  description: string;
}

export const TRACKS_DATA: TrackItem[] = [
  {
    id: 'green-valley',
    name: 'Green Valley',
    plays: '980 plays',
    difficulty: 'Easy',
    bgGradient: 'linear-gradient(135deg, #86efac 0%, #3b82f6 100%)',
    accentColor: '#22C55E',
    iconName: 'trees',
    description: 'Smooth open highways through grassy hills and sunny valleys. Perfect for warming up.'
  },
  {
    id: 'desert-rush',
    name: 'Desert Rush',
    plays: '1.5K plays',
    difficulty: 'Medium',
    bgGradient: 'linear-gradient(135deg, #fdba74 0%, #ea580c 100%)',
    accentColor: '#EA580C',
    iconName: 'sun',
    description: 'Sun-drenched canyon passes and golden dunes testing intermediate typing cadences.'
  },
  {
    id: 'city-night',
    name: 'City Night',
    plays: '2.1K plays',
    difficulty: 'Hard',
    bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #818cf8 100%)',
    accentColor: '#818CF8',
    iconName: 'building',
    description: 'High-speed urban highway lined with towering neon skyscrapers and tight chicanes.'
  },
  {
    id: 'snow-land',
    name: 'Snow Land',
    plays: '750 plays',
    difficulty: 'Expert',
    bgGradient: 'linear-gradient(135deg, #e0f2fe 0%, #38bdf8 100%)',
    accentColor: '#0284C7',
    iconName: 'snowflake',
    description: 'Frosty alpine mountain curves with crisp icy straightaways demanding maximum precision.'
  }
];
