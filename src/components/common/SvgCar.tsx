import React from 'react';

export type CarModelId = 
  | 'starter' 
  | 'blaze' 
  | 'golden' 
  | 'neon' 
  | 'shadow' 
  | 'ice' 
  | 'forest' 
  | 'rose' 
  | 'retro' 
  | 'jeep';

interface SvgCarProps {
  id: CarModelId;
  size?: number | string;
  width?: number;
  height?: number;
  viewAngle?: 'side' | 'isometric' | 'top';
  className?: string;
  animatedNitro?: boolean;
}

export const SvgCar: React.FC<SvgCarProps> = ({
  id,
  size = 140,
  width,
  height,
  viewAngle = 'side',
  className = '',
  animatedNitro = false
}) => {
  const w = width || (typeof size === 'number' ? size : 140);
  const h = height || (typeof size === 'number' ? size * 0.58 : 80);

  // Theme palettes for vehicles
  const palettes: Record<CarModelId, {
    primary: string;
    secondary: string;
    highlight: string;
    dark: string;
    windshield: string;
    accents: string;
    glow: string;
  }> = {
    starter: {
      primary: '#0284C7',
      secondary: '#38BDF8',
      highlight: '#BAE6FD',
      dark: '#0369A1',
      windshield: '#0F172A',
      accents: '#FFFFFF',
      glow: '#38BDF8'
    },
    blaze: {
      primary: '#EF4444',
      secondary: '#F97316',
      highlight: '#FDE047',
      dark: '#B91C1C',
      windshield: '#1E293B',
      accents: '#FACC15',
      glow: '#FF5A1F'
    },
    golden: {
      primary: '#EAB308',
      secondary: '#FACC15',
      highlight: '#FEF08A',
      dark: '#A16207',
      windshield: '#090D16',
      accents: '#FFFFFF',
      glow: '#FBBF24'
    },
    neon: {
      primary: '#9333EA',
      secondary: '#C084FC',
      highlight: '#F0ABFC',
      dark: '#6B21A8',
      windshield: '#180B2B',
      accents: '#38BDF8',
      glow: '#C084FC'
    },
    shadow: {
      primary: '#1F2937',
      secondary: '#374151',
      highlight: '#6B7280',
      dark: '#111827',
      windshield: '#030712',
      accents: '#EF4444',
      glow: '#DC2626'
    },
    ice: {
      primary: '#06B6D4',
      secondary: '#67E8F9',
      highlight: '#CFFAFE',
      dark: '#0E7490',
      windshield: '#082F49',
      accents: '#FFFFFF',
      glow: '#22D3EE'
    },
    forest: {
      primary: '#16A34A',
      secondary: '#4ADE80',
      highlight: '#BBF7D0',
      dark: '#15803D',
      windshield: '#052E16',
      accents: '#FACC15',
      glow: '#4ADE80'
    },
    rose: {
      primary: '#DB2777',
      secondary: '#F472B6',
      highlight: '#FBCFE8',
      dark: '#9D174D',
      windshield: '#1F0A18',
      accents: '#FFFFFF',
      glow: '#F472B6'
    },
    retro: {
      primary: '#EA580C',
      secondary: '#FB923C',
      highlight: '#FED7AA',
      dark: '#9A3412',
      windshield: '#27170E',
      accents: '#FEF08A',
      glow: '#F97316'
    },
    jeep: {
      primary: '#2563EB',
      secondary: '#60A5FA',
      highlight: '#BFDBFE',
      dark: '#1D4ED8',
      windshield: '#1E293B',
      accents: '#F59E0B',
      glow: '#3B82F6'
    }
  };

  const p = palettes[id] || palettes.starter;

  return (
    <svg 
      width={w} 
      height={h} 
      viewBox="0 0 220 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-car ${className}`}
      style={{ overflow: 'visible', filter: `drop-shadow(0 6px 12px rgba(0,0,0,0.15))` }}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id={`grad-body-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p.secondary} />
          <stop offset="60%" stopColor={p.primary} />
          <stop offset="100%" stopColor={p.dark} />
        </linearGradient>

        <linearGradient id={`grad-windshield-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p.windshield} />
          <stop offset="100%" stopColor="#0B132B" />
        </linearGradient>

        <linearGradient id="wheel-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        {/* Shadow */}
        <filter id="car-shadow" x="-10%" y="80%" width="120%" height="40%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="110" cy="106" rx="85" ry="10" fill="rgba(0, 0, 0, 0.22)" filter="url(#car-shadow)" />

      {/* Nitro Flame if animated */}
      {animatedNitro && (
        <g className="nitro-flame">
          <path 
            d="M 12 76 C -15 76, -30 78, -45 74 C -30 82, -20 86, 12 84 Z" 
            fill="#38BDF8" 
            opacity="0.9"
          />
          <path 
            d="M 10 77 C -8 77, -20 78, -30 75 C -15 80, -5 83, 10 82 Z" 
            fill="#FFFFFF" 
          />
        </g>
      )}

      {/* Rear Spoiler */}
      <path 
        d="M 22 42 L 14 26 L 40 26 L 36 42 Z" 
        fill={p.dark} 
      />
      <rect x="8" y="24" width="38" height="6" rx="3" fill={p.secondary} stroke={p.highlight} strokeWidth="1" />

      {/* Main Car Chassis / Aerodynamic Body */}
      <path 
        d="M 24 82 
           C 22 72, 28 62, 42 56 
           C 54 52, 68 40, 85 36 
           C 115 30, 142 34, 160 52 
           C 178 56, 196 66, 204 76 
           C 208 82, 208 88, 202 92 
           C 194 96, 185 96, 175 96 
           C 170 82, 150 82, 142 96 
           C 115 96, 95 96, 75 96 
           C 70 82, 50 82, 42 96 
           C 30 96, 24 90, 24 82 Z" 
        fill={`url(#grad-body-${id})`} 
        stroke={p.dark} 
        strokeWidth="2.5" 
      />

      {/* Roof & Windshield */}
      <path 
        d="M 72 52 
           C 82 42, 94 38, 122 38 
           C 138 38, 150 44, 155 52 
           C 142 54, 88 54, 72 52 Z" 
        fill={`url(#grad-windshield-${id})`} 
        stroke="#475569" 
        strokeWidth="1.5"
      />
      {/* Windshield Reflection */}
      <path 
        d="M 82 48 L 105 40 L 118 40 L 90 49 Z" 
        fill="#FFFFFF" 
        opacity="0.45" 
      />

      {/* Side Windows */}
      <path 
        d="M 124 40 C 136 40, 146 44, 150 50 C 135 52, 125 52, 124 40 Z" 
        fill={`url(#grad-windshield-${id})`} 
        opacity="0.9"
      />

      {/* Racing Stripe / Accents */}
      <path 
        d="M 60 70 Q 110 68 185 75 L 180 80 Q 108 73 58 75 Z" 
        fill={p.accents} 
        opacity="0.9"
      />
      
      {/* Headlight */}
      <ellipse cx="198" cy="74" rx="7" ry="5" fill="#FEF08A" />
      <ellipse cx="199" cy="74" rx="4" ry="3" fill="#FFFFFF" />

      {/* Taillight */}
      <rect x="22" y="68" width="5" height="10" rx="2" fill="#EF4444" />

      {/* Door Handle & Body Seam */}
      <rect x="105" y="62" width="12" height="3" rx="1.5" fill={p.dark} />
      <path d="M 85 54 L 80 90" stroke={p.dark} strokeWidth="1.5" opacity="0.4" />
      <path d="M 132 54 L 138 90" stroke={p.dark} strokeWidth="1.5" opacity="0.4" />

      {/* Front Wheel (Right) */}
      <g transform="translate(156, 92)">
        <circle cx="0" cy="0" r="18" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
        <circle cx="0" cy="0" r="11" fill="url(#wheel-rim)" />
        <circle cx="0" cy="0" r="6" fill="#334155" />
        <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
        {/* Spokes */}
        <line x1="-9" y1="0" x2="9" y2="0" stroke="#64748B" strokeWidth="2" />
        <line x1="0" y1="-9" x2="0" y2="9" stroke="#64748B" strokeWidth="2" />
      </g>

      {/* Rear Wheel (Left) */}
      <g transform="translate(56, 92)">
        <circle cx="0" cy="0" r="18" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
        <circle cx="0" cy="0" r="11" fill="url(#wheel-rim)" />
        <circle cx="0" cy="0" r="6" fill="#334155" />
        <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
        {/* Spokes */}
        <line x1="-9" y1="0" x2="9" y2="0" stroke="#64748B" strokeWidth="2" />
        <line x1="0" y1="-9" x2="0" y2="9" stroke="#64748B" strokeWidth="2" />
      </g>

      {/* Car Number Badge (optional) */}
      <g transform="translate(108, 76)">
        <circle cx="0" cy="0" r="9" fill="#FFFFFF" stroke={p.dark} strokeWidth="1.5" />
        <text 
          x="0" 
          y="4" 
          textAnchor="middle" 
          fontSize="10" 
          fontFamily="Plus Jakarta Sans, sans-serif" 
          fontWeight="800" 
          fill="#111827"
        >
          {id === 'starter' ? '1' : id === 'blaze' ? '7' : id === 'golden' ? '9' : '3'}
        </text>
      </g>
    </svg>
  );
};
