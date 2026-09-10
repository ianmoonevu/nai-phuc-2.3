// scripts/generate_all_local_images.js
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const dirs = [
  'public/images',
  'public/images/products',
  'public/images/projects',
  'public/images/team',
  'public/images/applications',
];

dirs.forEach((d) => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

// Helper to write file with logging
function writeSvg(filePath, svgContent) {
  fs.writeFileSync(filePath, svgContent.trim());
  console.log('Created:', filePath);
}

// -------------------------------------------------------------
// 1. HERO CONSTRUCTION (1600 x 900)
// -------------------------------------------------------------
const heroSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a192f" />
      <stop offset="60%" stop-color="#172a45" />
      <stop offset="100%" stop-color="#243b55" />
    </linearGradient>
    <linearGradient id="concreteFloor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3d4957" />
      <stop offset="30%" stop-color="#2c3642" />
      <stop offset="70%" stop-color="#1f2732" />
      <stop offset="100%" stop-color="#121820" />
    </linearGradient>
    <linearGradient id="steelBeam" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3b4b5d" />
      <stop offset="50%" stop-color="#556980" />
      <stop offset="100%" stop-color="#314050" />
    </linearGradient>
    <linearGradient id="hokiGreenGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#00e676" />
      <stop offset="100%" stop-color="#006e21" />
    </linearGradient>
    <linearGradient id="fiberGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e2e8f0" />
      <stop offset="50%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#64748b" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="0.5" stroke-opacity="0.08" />
    </pattern>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Warehouse Framing -->
  <rect width="1600" height="900" fill="url(#sky)" />
  <rect width="1600" height="900" fill="url(#grid)" />

  <!-- Industrial Steel Trusses & Columns -->
  <g stroke="#3b4b5d" stroke-width="6" opacity="0.65">
    <!-- Ceiling portal trusses -->
    <path d="M 0 180 L 1600 180 M 0 260 L 1600 260" />
    <path d="M 200 180 L 250 260 L 300 180 L 350 260 L 400 180 L 450 260 L 500 180 L 550 260 L 600 180 L 650 260 L 700 180 L 750 260 L 800 180 L 850 260 L 900 180 L 950 260 L 1000 180 L 1050 260 L 1100 180 L 1150 260 L 1200 180 L 1250 260 L 1300 180 L 1350 260 L 1400 180 L 1450 260 L 1500 180 L 1550 260 L 1600 180" stroke-width="3" />
    <!-- Vertical columns -->
    <line x1="200" y1="180" x2="200" y2="480" stroke-width="12" stroke="url(#steelBeam)" />
    <line x1="600" y1="180" x2="600" y2="480" stroke-width="12" stroke="url(#steelBeam)" />
    <line x1="1000" y1="180" x2="1000" y2="480" stroke-width="12" stroke="url(#steelBeam)" />
    <line x1="1400" y1="180" x2="1400" y2="480" stroke-width="12" stroke="url(#steelBeam)" />
  </g>

  <!-- High-Bay Overhead LED Lights -->
  <g fill="#ffffff" opacity="0.8">
    <ellipse cx="400" cy="180" rx="35" ry="8" fill="#e0f2fe" filter="url(#glow)" />
    <ellipse cx="800" cy="180" rx="35" ry="8" fill="#e0f2fe" filter="url(#glow)" />
    <ellipse cx="1200" cy="180" rx="35" ry="8" fill="#e0f2fe" filter="url(#glow)" />
    <!-- Downward Light Cones -->
    <polygon points="365,185 435,185 580,480 220,480" fill="#e0f2fe" opacity="0.06" />
    <polygon points="765,185 835,185 980,480 620,480" fill="#e0f2fe" opacity="0.07" />
    <polygon points="1165,185 1235,185 1380,480 1020,480" fill="#e0f2fe" opacity="0.06" />
  </g>

  <!-- Floor Surface: Fresh Laser-Screeded Concrete Slab -->
  <polygon points="0,460 1600,460 1600,900 0,900" fill="url(#concreteFloor)" />

  <!-- Jointless Floor Perspective Grid Lines -->
  <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1.5">
    <line x1="800" y1="460" x2="0" y2="880" />
    <line x1="800" y1="460" x2="350" y2="900" />
    <line x1="800" y1="460" x2="700" y2="900" />
    <line x1="800" y1="460" x2="900" y2="900" />
    <line x1="800" y1="460" x2="1250" y2="900" />
    <line x1="800" y1="460" x2="1600" y2="880" />
    <!-- Horizontal slab distance markers -->
    <line x1="120" y1="530" x2="1480" y2="530" />
    <line x1="60" y1="620" x2="1540" y2="620" />
    <line x1="20" y1="740" x2="1580" y2="740" />
  </g>

  <!-- Laser Leveling Guidance Beams (Green Precision Line) -->
  <line x1="0" y1="518" x2="1600" y2="518" stroke="#00e676" stroke-width="2.5" filter="url(#glow)" opacity="0.9" />
  <circle cx="800" cy="518" r="6" fill="#00e676" filter="url(#glow)" />

  <!-- Laser Screed Machinery Graphic -->
  <g transform="translate(680, 380)">
    <!-- Telescopic boom -->
    <polygon points="0,70 120,40 180,45 60,80" fill="#334155" />
    <!-- Machine chassis -->
    <rect x="-80" y="60" width="150" height="60" rx="10" fill="#00356a" stroke="#004b93" stroke-width="2" />
    <!-- Operator cab -->
    <rect x="-60" y="25" width="70" height="40" rx="6" fill="#1e293b" stroke="#475569" stroke-width="2" />
    <rect x="-55" y="30" width="60" height="30" rx="4" fill="#38bdf8" opacity="0.6" />
    <!-- Wheels -->
    <circle cx="-50" cy="125" r="22" fill="#0f172a" stroke="#475569" stroke-width="4" />
    <circle cx="40" cy="125" r="22" fill="#0f172a" stroke="#475569" stroke-width="4" />
    <!-- Screed head with auger and vibratory beam -->
    <rect x="110" y="100" width="220" height="24" rx="4" fill="#006e21" stroke="#00e676" stroke-width="2" />
    <!-- Laser receiver mast -->
    <line x1="220" y1="100" x2="220" y2="20" stroke="#94a3b8" stroke-width="4" />
    <circle cx="220" cy="20" r="10" fill="#00e676" filter="url(#glow)" />
    <!-- Fresh concrete wave in front of screed -->
    <path d="M 100 125 Q 220 115 340 125 L 340 140 Q 220 130 100 140 Z" fill="#64748b" opacity="0.8" />
  </g>

  <!-- Technical Slab Cross-Section Inset (Bottom Left) -->
  <g transform="translate(60, 640)">
    <rect width="440" height="200" rx="18" fill="#001f3f" fill-opacity="0.9" stroke="#006e21" stroke-width="2" />
    <text x="24" y="34" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="12" font-weight="bold" letter-spacing="2">HOKI SFRC MICRO-STRUCTURE DETAIL</text>
    <text x="24" y="56" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="14" font-weight="800">Isotropic 3D Fiber Distribution (TR34 4th Ed.)</text>
    
    <!-- Concrete matrix cutaway with randomly oriented fibers -->
    <rect x="24" y="70" width="392" height="75" rx="8" fill="#334155" stroke="#475569" stroke-width="1.5" />
    <!-- 3D hooked fibers -->
    <g stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none">
      <path d="M 45 90 L 55 90 L 80 82 L 90 82" />
      <path d="M 120 125 L 125 120 L 145 105 L 150 102" />
      <path d="M 180 85 L 185 88 L 210 95 L 215 95" />
      <path d="M 240 130 L 245 128 L 270 118 L 275 118" />
      <path d="M 300 88 L 305 92 L 325 110 L 330 112" />
      <path d="M 350 120 L 355 122 L 380 125 L 385 125" />
      <path d="M 70 130 L 75 125 L 95 120 L 100 122" />
      <path d="M 150 82 L 155 85 L 175 90 L 180 88" />
      <path d="M 270 90 L 275 92 L 295 85 L 300 86" />
    </g>
    <!-- Dimension annotations -->
    <text x="24" y="168" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">Slab Thickness: 180 mm (Reduced from 240 mm Rebar Design)</text>
    <text x="24" y="186" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="11" font-weight="bold">Embodied Carbon Reduction: -26.4% | Joint Spacing: 35m</text>
  </g>

  <!-- Live Project Telemetry Card (Bottom Right) -->
  <g transform="translate(1120, 660)">
    <rect width="420" height="180" rx="18" fill="#001830" fill-opacity="0.9" stroke="#3b82f6" stroke-width="1.5" />
    <circle cx="36" cy="36" r="8" fill="#00e676" filter="url(#glow)" />
    <text x="56" y="41" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="13" font-weight="bold" letter-spacing="1">LIVE INDUSTRIAL POUR TELEMETRY</text>
    <line x1="24" y1="60" x2="396" y2="60" stroke="#ffffff" stroke-opacity="0.15" />
    
    <text x="24" y="85" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="500">Pour Acceleration:</text>
    <text x="396" y="85" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" text-anchor="end">+40% Faster Daily Output</text>
    
    <text x="24" y="112" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="500">Rebar Cage Placement:</text>
    <text x="396" y="112" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" text-anchor="end">100% Displaced (0 Tying Crew)</text>
    
    <text x="24" y="139" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="500">TR34 Dosage Grade:</text>
    <text x="396" y="139" fill="#38bdf8" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" text-anchor="end">28 kg/m³ (HF-8060 Heavy)</text>

    <text x="24" y="164" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="500">Flatness Spec:</text>
    <text x="396" y="164" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" text-anchor="end">F_min 85 Superflat Tolerance</text>
  </g>
</svg>
`;

writeSvg('public/images/hero-construction.svg', heroSvg);

// -------------------------------------------------------------
// 2. FACTORY ALPHA HUB (1200 x 800)
// -------------------------------------------------------------
const factorySvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bgFactory" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#091422" />
      <stop offset="100%" stop-color="#142338" />
    </linearGradient>
    <linearGradient id="metalSpool" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="50%" stop-color="#94a3b8" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
    <linearGradient id="wireGold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#fef3c7" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>

  <rect width="1200" height="800" fill="url(#bgFactory)" />

  <!-- Factory Hall Gantry & Structure -->
  <g stroke="#334155" stroke-width="4" opacity="0.7">
    <line x1="0" y1="120" x2="1200" y2="120" stroke-width="8" stroke="#1e293b" />
    <line x1="0" y1="180" x2="1200" y2="180" stroke-width="6" />
    <!-- Overhead crane beam -->
    <rect x="350" y="100" width="300" height="40" fill="#00356a" stroke="#38bdf8" stroke-width="2" rx="4" />
    <text x="500" y="125" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">OVERHEAD GANTRY CRANE — 25T</text>
  </g>

  <!-- Continuous Cold-Drawing Wire Lines -->
  <!-- Wire spools (Feeders) -->
  <g transform="translate(80, 260)">
    <!-- Spool 1 -->
    <circle cx="80" cy="140" r="70" fill="url(#metalSpool)" stroke="#64748b" stroke-width="4" />
    <circle cx="80" cy="140" r="30" fill="#0f172a" />
    <!-- High carbon wire strand -->
    <path d="M 150 140 L 400 140" stroke="url(#wireGold)" stroke-width="5" />
    <text x="80" y="240" fill="#cbd5e1" font-family="'Montserrat', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">ROD PAY-OFF REEL</text>
  </g>

  <!-- Multi-Die Reduction Drawing Blocks -->
  <g transform="translate(380, 320)">
    <rect x="0" y="0" width="220" height="160" rx="12" fill="#002244" stroke="#006e21" stroke-width="3" />
    <text x="110" y="32" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">MULTI-DIE COLD DRAWING</text>
    <circle cx="60" cy="90" r="35" fill="url(#metalSpool)" />
    <circle cx="150" cy="90" r="28" fill="url(#metalSpool)" />
    <path d="M 0 80 L 220 80" stroke="#f8fafc" stroke-width="3" />
    <text x="110" y="145" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="10" text-anchor="middle">Ø 6.5 mm → Ø 0.75 mm</text>
  </g>

  <!-- Automated Crimp & 3D Hook Forming Die -->
  <g transform="translate(680, 320)">
    <rect x="0" y="0" width="220" height="160" rx="12" fill="#002244" stroke="#38bdf8" stroke-width="3" />
    <text x="110" y="32" fill="#38bdf8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">3D HOOK-END FORMING</text>
    <polygon points="60,70 90,50 100,70" fill="#f59e0b" />
    <polygon points="120,70 130,50 160,70" fill="#f59e0b" />
    <!-- Formed fibers dropping onto conveyor -->
    <g stroke="#ffffff" stroke-width="2" fill="none">
      <path d="M 50 105 L 60 105 L 85 98 L 95 98" />
      <path d="M 120 115 L 130 115 L 155 108 L 165 108" />
    </g>
    <text x="110" y="145" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="10" text-anchor="middle">Rotary High-Speed Shear</text>
  </g>

  <!-- In-Line Optical Eddy Current QA Inspection -->
  <g transform="translate(970, 320)">
    <rect x="0" y="0" width="160" height="160" rx="12" fill="#052e16" stroke="#00e676" stroke-width="2.5" />
    <text x="80" y="30" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">LASER QA INSPECTION</text>
    <circle cx="80" cy="85" r="32" fill="#022c22" stroke="#00e676" stroke-width="2" />
    <text x="80" y="82" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="10" font-weight="bold" text-anchor="middle">TOLERANCE</text>
    <text x="80" y="98" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" text-anchor="middle">±0.01 mm</text>
    <text x="80" y="145" fill="#a7f3d0" font-family="'Montserrat', sans-serif" font-size="10" text-anchor="middle">100% In-Line Scanned</text>
  </g>

  <!-- Conveyor Bed -->
  <rect x="60" y="490" width="1080" height="24" rx="4" fill="#334155" stroke="#475569" stroke-width="2" />
  <g stroke="#64748b" stroke-width="2">
    <line x1="120" y1="514" x2="120" y2="600" />
    <line x1="360" y1="514" x2="360" y2="600" />
    <line x1="600" y1="514" x2="600" y2="600" />
    <line x1="840" y1="514" x2="840" y2="600" />
    <line x1="1080" y1="514" x2="1080" y2="600" />
  </g>

  <!-- Alpha Hub Manufacturing Credentials Strip -->
  <g transform="translate(60, 640)">
    <rect width="1080" height="110" rx="18" fill="#001830" stroke="#1e3a5f" stroke-width="2" />
    
    <g transform="translate(40, 25)">
      <text x="0" y="20" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="11" font-weight="bold" letter-spacing="2">HOKI ALPHA HUB CAPABILITY</text>
      <text x="0" y="46" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="18" font-weight="800">50,000 MT Annual Capacity</text>
      <text x="0" y="68" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="12">Fully Automated Continuous Wire Drawing & Hooking Plant</text>
    </g>

    <!-- Certification Badges -->
    <g transform="translate(680, 25)">
      <rect x="0" y="10" width="110" height="46" rx="8" fill="#00356a" stroke="#38bdf8" stroke-width="1.5" />
      <text x="55" y="38" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">ISO 9001:2015</text>

      <rect x="125" y="10" width="110" height="46" rx="8" fill="#00356a" stroke="#38bdf8" stroke-width="1.5" />
      <text x="180" y="38" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">EN 14889-1</text>

      <rect x="250" y="10" width="120" height="46" rx="8" fill="#064e3b" stroke="#00e676" stroke-width="1.5" />
      <text x="310" y="38" fill="#a7f3d0" font-family="'Montserrat', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">ISO 14040 EPD</text>
    </g>
  </g>
</svg>
`;

writeSvg('public/images/factory-alpha-hub.svg', factorySvg);

// -------------------------------------------------------------
// 3. PRODUCT 1: HF-8060 (800 x 600)
// -------------------------------------------------------------
const hf8060Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="pBg1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#001830" />
      <stop offset="100%" stop-color="#002d57" />
    </linearGradient>
    <linearGradient id="fiberSteel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#94a3b8" />
      <stop offset="30%" stop-color="#f1f5f9" />
      <stop offset="70%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#64748b" />
    </linearGradient>
    <filter id="pGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="800" height="600" fill="url(#pBg1)" />

  <!-- Blueprint Grid -->
  <g stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.08">
    <line x1="0" y1="100" x2="800" y2="100" />
    <line x1="0" y1="200" x2="800" y2="200" />
    <line x1="0" y1="300" x2="800" y2="300" />
    <line x1="0" y1="400" x2="800" y2="400" />
    <line x1="0" y1="500" x2="800" y2="500" />
    <line x1="200" y1="0" x2="200" y2="600" />
    <line x1="400" y1="0" x2="400" y2="600" />
    <line x1="600" y1="0" x2="600" y2="600" />
  </g>

  <!-- Header Product Badge -->
  <rect x="40" y="40" width="160" height="32" rx="16" fill="#006e21" />
  <text x="120" y="61" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">SERIES 80/60</text>
  <text x="220" y="62" fill="#93c5fd" font-family="'Montserrat', sans-serif" font-size="13" font-weight="600">HEAVY INDUSTRIAL SLABS &amp; PORTS</text>

  <!-- Large 3D Rendered Hooked-End Steel Fiber -->
  <g transform="translate(100, 220)">
    <!-- Shadow -->
    <path d="M 40 85 L 100 85 L 160 35 L 440 35 L 500 85 L 560 85" stroke="#000000" stroke-width="26" stroke-linecap="round" opacity="0.4" filter="url(#pGlow)" />
    
    <!-- Main Steel Fiber Body with 3D Double Hook Ends -->
    <path d="M 40 70 L 100 70 L 160 20 L 440 20 L 500 70 L 560 70" fill="none" stroke="url(#fiberSteel)" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" />
    
    <!-- Highlights and specular reflections -->
    <path d="M 40 66 L 100 66 L 160 16 L 440 16 L 500 66 L 560 66" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.8" />

    <!-- Dimension Annotations -->
    <!-- Length L = 60 mm -->
    <line x1="40" y1="120" x2="560" y2="120" stroke="#38bdf8" stroke-width="2" />
    <line x1="40" y1="105" x2="40" y2="135" stroke="#38bdf8" stroke-width="2" />
    <line x1="560" y1="105" x2="560" y2="135" stroke="#38bdf8" stroke-width="2" />
    <text x="300" y="145" fill="#38bdf8" font-family="'Montserrat', sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Length (L) = 60 mm</text>

    <!-- Diameter d = 0.75 mm -->
    <line x1="300" y1="-5" x2="300" y2="45" stroke="#00e676" stroke-width="2" />
    <text x="300" y="-15" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="13" font-weight="bold" text-anchor="middle">Diameter (d) = 0.75 mm | Aspect Ratio = 80</text>

    <!-- Mechanical Hook Angle Annotation -->
    <path d="M 120 70 A 30 30 0 0 0 145 40" stroke="#f59e0b" stroke-width="2" fill="none" stroke-dasharray="3 3" />
    <text x="90" y="25" fill="#f59e0b" font-family="'Montserrat', sans-serif" font-size="11" font-weight="bold">45° Hook Crimp</text>
  </g>

  <!-- Technical Spec Box at Bottom -->
  <g transform="translate(40, 440)">
    <rect width="720" height="120" rx="16" fill="#001830" stroke="#1e3a5f" stroke-width="2" />
    
    <g transform="translate(30, 30)">
      <text x="0" y="18" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">TENSILE STRENGTH</text>
      <text x="0" y="44" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="20" font-weight="800">1,200 – 1,500 MPa</text>
      <text x="0" y="64" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">Cold-Drawn High-Carbon Wire</text>
    </g>

    <g transform="translate(260, 30)">
      <text x="0" y="18" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">FIBER COUNT / KG</text>
      <text x="0" y="44" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="20" font-weight="800">4,220 / kg</text>
      <text x="0" y="64" fill="#38bdf8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">Optimal Anchorage Network</text>
    </g>

    <g transform="translate(490, 30)">
      <text x="0" y="18" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">CONFORMITY STANDARDS</text>
      <text x="0" y="44" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="16" font-weight="800">ASTM A820 Type I</text>
      <text x="0" y="64" fill="#cbd5e1" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">EN 14889-1 System 1 CE</text>
    </g>
  </g>
</svg>
`;

writeSvg('public/images/products/product-hf-8060.svg', hf8060Svg);

// -------------------------------------------------------------
// 4. PRODUCT 2: HF-6535 (800 x 600)
// -------------------------------------------------------------
const hf6535Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="pBg2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#022c22" />
      <stop offset="100%" stop-color="#064e3b" />
    </linearGradient>
    <linearGradient id="glueStrip" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.8" />
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="url(#pBg2)" />

  <!-- Grid -->
  <g stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.08">
    <line x1="0" y1="150" x2="800" y2="150" />
    <line x1="0" y1="300" x2="800" y2="300" />
    <line x1="0" y1="450" x2="800" y2="450" />
    <line x1="200" y1="0" x2="200" y2="600" />
    <line x1="400" y1="0" x2="400" y2="600" />
    <line x1="600" y1="0" x2="600" y2="600" />
  </g>

  <!-- Header -->
  <rect x="40" y="40" width="160" height="32" rx="16" fill="#00356a" />
  <text x="120" y="61" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">SERIES 65/35</text>
  <text x="220" y="62" fill="#a7f3d0" font-family="'Montserrat', sans-serif" font-size="13" font-weight="600">COLLATED CRACK CONTROL &amp; WAREHOUSES</text>

  <!-- Collated Bundle Graphic (Glued Strips Dispersing in Concrete) -->
  <g transform="translate(140, 160)">
    <!-- Water-soluble glue strip binding 25 fibers -->
    <rect x="60" y="40" width="180" height="120" rx="8" fill="url(#glueStrip)" opacity="0.3" stroke="#38bdf8" stroke-dasharray="4 4" />
    <text x="150" y="30" fill="#38bdf8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Water-Soluble Collated Strip (No Balling)</text>

    <!-- Fiber Strip Stack -->
    <g stroke="#e2e8f0" stroke-width="7" stroke-linecap="round" fill="none">
      <path d="M 60 55 L 90 55 L 120 45 L 210 45 L 240 55 L 270 55" />
      <path d="M 60 75 L 90 75 L 120 65 L 210 65 L 240 75 L 270 75" />
      <path d="M 60 95 L 90 95 L 120 85 L 210 85 L 240 95 L 270 95" />
      <path d="M 60 115 L 90 115 L 120 105 L 210 105 L 240 115 L 270 115" />
      <path d="M 60 135 L 90 135 L 120 125 L 210 125 L 240 135 L 270 135" />
    </g>

    <!-- Dispersal Arrows -->
    <path d="M 280 95 Q 340 70 400 95" fill="none" stroke="#00e676" stroke-width="3" marker-end="url(#arrow)" />
    <text x="350" y="60" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Dissolves in Mix (60s)</text>

    <!-- Individual Dispersed Fiber with High Count -->
    <g transform="translate(360, 40)">
      <path d="M 20 60 L 50 60 L 80 40 L 170 40 L 200 60 L 230 60" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round" />
      <!-- Dimension -->
      <line x1="20" y1="90" x2="230" y2="90" stroke="#f59e0b" stroke-width="2" />
      <text x="125" y="110" fill="#f59e0b" font-family="'Montserrat', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Length = 35 mm | d = 0.55 mm</text>
    </g>
  </g>

  <!-- Technical Spec Box -->
  <g transform="translate(40, 440)">
    <rect width="720" height="120" rx="16" fill="#022c22" stroke="#00e676" stroke-width="2" />
    
    <g transform="translate(30, 30)">
      <text x="0" y="18" fill="#a7f3d0" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">FIBER COUNT / KG</text>
      <text x="0" y="44" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="20" font-weight="800">10,970 / kg</text>
      <text x="0" y="64" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">2.6x Higher Network Density</text>
    </g>

    <g transform="translate(260, 30)">
      <text x="0" y="18" fill="#a7f3d0" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">CRACK CONTROL WIDTH</text>
      <text x="0" y="44" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="20" font-weight="800">&lt; 0.15 mm</text>
      <text x="0" y="64" fill="#38bdf8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">Mitigates Plastic Shrinkage</text>
    </g>

    <g transform="translate(490, 30)">
      <text x="0" y="18" fill="#a7f3d0" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">COLLATED FORM FACTOR</text>
      <text x="0" y="44" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="18" font-weight="800">30 Fibers / Strip</text>
      <text x="0" y="64" fill="#cbd5e1" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">Zero Balling Guaranteed</text>
    </g>
  </g>
</svg>
`;

writeSvg('public/images/products/product-hf-6535.svg', hf6535Svg);

// -------------------------------------------------------------
// 5. PRODUCT 3: HF-10020 (800 x 600)
// -------------------------------------------------------------
const hf10020Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="pBg3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#27272a" />
    </linearGradient>
    <linearGradient id="goldBrass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#d97706" />
      <stop offset="40%" stop-color="#fef08a" />
      <stop offset="70%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="url(#pBg3)" />

  <!-- High Tech Grid -->
  <g stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.08">
    <line x1="0" y1="150" x2="800" y2="150" />
    <line x1="0" y1="300" x2="800" y2="300" />
    <line x1="0" y1="450" x2="800" y2="450" />
    <line x1="200" y1="0" x2="200" y2="600" />
    <line x1="400" y1="0" x2="400" y2="600" />
    <line x1="600" y1="0" x2="600" y2="600" />
  </g>

  <!-- Header -->
  <rect x="40" y="40" width="180" height="32" rx="16" fill="#b45309" />
  <text x="130" y="61" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">SERIES 100/20 MU</text>
  <text x="240" y="62" fill="#fde047" font-family="'Montserrat', sans-serif" font-size="13" font-weight="600">ULTRA-HIGH PERFORMANCE CONCRETE (UHPC)</text>

  <!-- Brass-Coated Straight Micro-Fibers Graphic -->
  <g transform="translate(100, 180)">
    <!-- Dense Micro-Fiber Array -->
    <g stroke="url(#goldBrass)" stroke-width="6" stroke-linecap="round">
      <line x1="40" y1="60" x2="340" y2="60" />
      <line x1="80" y1="90" x2="380" y2="90" />
      <line x1="60" y1="120" x2="360" y2="120" />
      <line x1="120" y1="150" x2="420" y2="150" />
      <line x1="90" y1="180" x2="390" y2="180" />
    </g>

    <!-- Spec Zoom Annotation -->
    <g transform="translate(440, 40)">
      <circle cx="80" cy="80" r="70" fill="#0f172a" stroke="#eab308" stroke-width="3" />
      <text x="80" y="65" fill="#fde047" font-family="'Montserrat', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">ASPECT RATIO</text>
      <text x="80" y="95" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="24" font-weight="900" text-anchor="middle">100</text>
      <text x="80" y="115" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="10" text-anchor="middle">d = 0.20 mm</text>
    </g>
  </g>

  <!-- Technical Spec Box -->
  <g transform="translate(40, 440)">
    <rect width="720" height="120" rx="16" fill="#18181b" stroke="#eab308" stroke-width="2" />
    
    <g transform="translate(30, 30)">
      <text x="0" y="18" fill="#eab308" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">TENSILE STRENGTH</text>
      <text x="0" y="44" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="20" font-weight="800">≥ 2,000 MPa</text>
      <text x="0" y="64" fill="#fef08a" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">Ultra-High Tensile Class</text>
    </g>

    <g transform="translate(260, 30)">
      <text x="0" y="18" fill="#eab308" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">FIBER COUNT / KG</text>
      <text x="0" y="44" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="20" font-weight="800">90,110 / kg</text>
      <text x="0" y="64" fill="#38bdf8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">Micro-Bridging Network</text>
    </g>

    <g transform="translate(490, 30)">
      <text x="0" y="18" fill="#eab308" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">SURFACE COATING</text>
      <text x="0" y="44" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="18" font-weight="800">Brass / Copper</text>
      <text x="0" y="64" fill="#cbd5e1" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">Maximum Interfacial Bond</text>
    </g>
  </g>
</svg>
`;

writeSvg('public/images/products/product-hf-10020.svg', hf10020Svg);

// -------------------------------------------------------------
// 6. PROJECTS (1200 x 800)
// Helper to generate crisp civil engineering project graphics
// -------------------------------------------------------------
function makeProjectSvg({ title, location, area, dosage, highlight, sectorTag, color1 = '#00356a', color2 = '#001830', iconType = 'factory' }) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bgProj" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color1}" />
      <stop offset="100%" stop-color="${color2}" />
    </linearGradient>
    <linearGradient id="concreteGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>

  <rect width="1200" height="800" fill="url(#bgProj)" />

  <!-- Grid lines -->
  <g stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.08">
    <line x1="0" y1="160" x2="1200" y2="160" />
    <line x1="0" y1="320" x2="1200" y2="320" />
    <line x1="0" y1="480" x2="1200" y2="480" />
    <line x1="0" y1="640" x2="1200" y2="640" />
    <line x1="300" y1="0" x2="300" y2="800" />
    <line x1="600" y1="0" x2="600" y2="800" />
    <line x1="900" y1="0" x2="900" y2="800" />
  </g>

  <!-- Sector Pill -->
  <rect x="60" y="60" width="220" height="36" rx="18" fill="#006e21" />
  <text x="170" y="83" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">${sectorTag}</text>

  <!-- Project Title and Location -->
  <text x="60" y="140" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="34" font-weight="900">${title}</text>
  <text x="60" y="175" fill="#93c5fd" font-family="'Montserrat', sans-serif" font-size="16" font-weight="600">Location: ${location} | Area: ${area}</text>

  <!-- Architectural / Engineering Perspective Centerpiece -->
  <g transform="translate(60, 220)">
    <!-- Floor Slab Isometric View -->
    <polygon points="50,220 540,60 1020,220 540,380" fill="url(#concreteGrad)" stroke="#475569" stroke-width="2" />
    
    <!-- Jointless Grid Panels -->
    <g stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.6">
      <line x1="295" y1="140" x2="780" y2="300" />
      <line x1="295" y1="300" x2="780" y2="140" />
    </g>

    <!-- Telemetry Pin -->
    <circle cx="540" cy="220" r="14" fill="#00e676" />
    <circle cx="540" cy="220" r="28" fill="none" stroke="#00e676" stroke-width="2" opacity="0.6" />
    
    <!-- Floating Feature Badge -->
    <rect x="680" y="40" width="340" height="90" rx="14" fill="#001830" stroke="#00e676" stroke-width="2" />
    <text x="700" y="70" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="12" font-weight="bold">SPECIFICATION KEY</text>
    <text x="700" y="95" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="15" font-weight="800">${dosage}</text>
    <text x="700" y="115" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="11">${highlight}</text>
  </g>

  <!-- Bottom Metric Strip -->
  <g transform="translate(60, 660)">
    <rect width="1080" height="90" rx="16" fill="#001830" stroke="#1e3a5f" stroke-width="1.5" />
    
    <g transform="translate(40, 22)">
      <text x="0" y="16" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">TOTAL SLAB AREA</text>
      <text x="0" y="44" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="22" font-weight="900">${area}</text>
    </g>

    <g transform="translate(300, 22)">
      <text x="0" y="16" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">DOSAGE &amp; FORMULATION</text>
      <text x="0" y="44" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="18" font-weight="800">${dosage}</text>
    </g>

    <g transform="translate(620, 22)">
      <text x="0" y="16" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600">VERIFIED PERFORMANCE</text>
      <text x="0" y="44" fill="#38bdf8" font-family="'Montserrat', sans-serif" font-size="17" font-weight="800">${highlight}</text>
    </g>
  </g>
</svg>
`;
}

writeSvg('public/images/projects/project-geely.svg', makeProjectSvg({
  title: 'Geely Automobile Manufacturing Plant',
  location: 'Chengdu, China',
  area: '250,000 m²',
  dosage: '32 kg/m³ HOKI HF-8060',
  highlight: '38 Days Saved | Superflat F_min 85',
  sectorTag: 'AUTOMOTIVE & HEAVY INDUSTRIAL',
  color1: '#002855',
  color2: '#001024',
}));

writeSvg('public/images/projects/project-sailun.svg', makeProjectSvg({
  title: 'Sailun Tire Manufacturing Complex',
  location: 'Tay Ninh, Vietnam',
  area: '200,000 m²',
  dosage: '28 kg/m³ HOKI HF-8060',
  highlight: '140 kN Point Load | Zero Saw-Cut Cracking',
  sectorTag: 'TIRE & RUBBER LOGISTICS',
  color1: '#0b3c5d',
  color2: '#001a33',
}));

writeSvg('public/images/projects/project-jinyu.svg', makeProjectSvg({
  title: 'Jinyu Tires Phase II Expansion',
  location: 'Binh Duong, Vietnam',
  area: '180,000 m²',
  dosage: '26 kg/m³ HOKI HF-6535',
  highlight: 'High-Bay VNA Racking | Zero Curl Deflection',
  sectorTag: 'AUTOMATED WAREHOUSING',
  color1: '#064e3b',
  color2: '#022c22',
}));

writeSvg('public/images/projects/project-metro.svg', makeProjectSvg({
  title: 'Metro Line Precast Tunnel Segments',
  location: 'Ho Chi Minh City, Vietnam',
  area: '45,000 Segments',
  dosage: '35 kg/m³ HOKI HF-8060 (1500 MPa)',
  highlight: 'Crack Width < 0.1 mm | 100-Year Durability',
  sectorTag: 'UNDERGROUND TUNNEL SEGMENTS',
  color1: '#1e1b4b',
  color2: '#0f0e26',
}));

writeSvg('public/images/projects/project-port.svg', makeProjectSvg({
  title: 'International Deep-Water Container Terminal',
  location: 'Cai Mep Port, Vietnam',
  area: '320,000 m²',
  dosage: '30 kg/m³ HOKI HF-8060',
  highlight: '180 kN Axle Loads | Marine Salt Resistant',
  sectorTag: 'PORTS & HEAVY HARDSTANDS',
  color1: '#0369a1',
  color2: '#082f49',
}));

writeSvg('public/images/projects/project-datacenter.svg', makeProjectSvg({
  title: 'Tier IV Hyper-Scale Cloud Data Center',
  location: 'Singapore Digital Park',
  area: '95,000 m²',
  dosage: '25 kg/m³ HOKI HF-6535',
  highlight: 'Vibration-Isolated Server Slab | Raised Access Floor',
  sectorTag: 'DATA CENTERS & MISSION CRITICAL',
  color1: '#1e293b',
  color2: '#0f172a',
}));

writeSvg('public/images/projects/project-coldstorage.svg', makeProjectSvg({
  title: 'Automated Cold Chain Distribution Hub (-25°C)',
  location: 'Melbourne, Australia',
  area: '110,000 m²',
  dosage: '28 kg/m³ HOKI HF-8060',
  highlight: 'Sub-Zero Thermal Stress | Ductile Crack Mitigation',
  sectorTag: 'COLD STORAGE & FREEZERS',
  color1: '#164e63',
  color2: '#083344',
}));

// -------------------------------------------------------------
// 7. APPLICATIONS (800 x 600)
// -------------------------------------------------------------
function makeAppSvg(title, subtitle, spec, color1, color2) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="appBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color1}" />
      <stop offset="100%" stop-color="${color2}" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#appBg)" />
  
  <g stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.1">
    <line x1="0" y1="200" x2="800" y2="200" />
    <line x1="0" y1="400" x2="800" y2="400" />
    <line x1="200" y1="0" x2="200" y2="600" />
    <line x1="400" y1="0" x2="400" y2="600" />
    <line x1="600" y1="0" x2="600" y2="600" />
  </g>

  <rect x="50" y="50" width="140" height="28" rx="14" fill="#006e21" />
  <text x="120" y="69" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="10" font-weight="bold" text-anchor="middle">APPLICATION</text>

  <text x="50" y="130" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="28" font-weight="900">${title}</text>
  <text x="50" y="160" fill="#93c5fd" font-family="'Montserrat', sans-serif" font-size="14" font-weight="600">${subtitle}</text>

  <!-- Central Engineering Graphic -->
  <g transform="translate(100, 200)">
    <polygon points="50,180 300,50 550,180 300,310" fill="#001830" stroke="#38bdf8" stroke-width="2" />
    <line x1="50" y1="180" x2="550" y2="180" stroke="#00e676" stroke-width="2" stroke-dasharray="6 6" />
    <text x="300" y="175" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">TR34 STRUCTURAL MOMENT CAPACITY</text>
  </g>

  <!-- Spec Footer -->
  <rect x="50" y="470" width="700" height="80" rx="16" fill="#001830" stroke="#1e3a5f" stroke-width="1.5" />
  <text x="80" y="505" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="bold">RECOMMENDED DOSAGE</text>
  <text x="80" y="530" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="16" font-weight="800">${spec}</text>
</svg>
`;
}

writeSvg('public/images/applications/app-industrial-flooring.svg', makeAppSvg(
  'Heavy Industrial Flooring',
  'Jointless Slabs on Grade & Laser Screed',
  '20 – 35 kg/m³ (HOKI HF-8060) | 40% Schedule Acceleration',
  '#002855',
  '#001428'
));

writeSvg('public/images/applications/app-tunnel-precast.svg', makeAppSvg(
  'Underground & Tunnel Precast',
  'TBM Segmental Linings & Deep Shafts',
  '30 – 45 kg/m³ (HOKI HF-8060 / HF-10020) | Crack < 0.1 mm',
  '#1e1b4b',
  '#09081a'
));

writeSvg('public/images/applications/app-port-terminal.svg', makeAppSvg(
  'Ports & Heavy Hardstands',
  'Intermodal Container Yards & RTG Runways',
  '28 – 35 kg/m³ (HOKI HF-8060) | 180 kN Axle Capacity',
  '#075985',
  '#0c4a6e'
));

writeSvg('public/images/applications/app-logistics.svg', makeAppSvg(
  'High-Bay Automated Logistics',
  'Narrow Aisle (VNA) & Dynamic Racking Slabs',
  '22 – 28 kg/m³ (HOKI HF-6535) | F_min 90 Superflat',
  '#065f46',
  '#022c22'
));

// -------------------------------------------------------------
// 8. TEAM AVATARS (400 x 400)
// -------------------------------------------------------------
function makeAvatarSvg({ name, role, initials, color = '#00356a' }) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="avBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color}" />
      <stop offset="100%" stop-color="#001830" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#avBg)" />
  
  <!-- Subtle circular halo -->
  <circle cx="200" cy="170" r="90" fill="#ffffff" fill-opacity="0.08" />
  <circle cx="200" cy="170" r="70" fill="#ffffff" fill-opacity="0.12" />

  <!-- Stylized Executive Silhouette -->
  <!-- Head -->
  <circle cx="200" cy="140" r="45" fill="#f1f5f9" />
  <!-- Torso & Suit Collar -->
  <path d="M 120 280 C 120 215 150 195 200 195 C 250 195 280 215 280 280 Z" fill="#e2e8f0" />
  <!-- Tie / Lapel detail in HOKI Navy/Green -->
  <polygon points="190,195 210,195 205,260 195,260" fill="#006e21" />

  <!-- Initials Badge -->
  <rect x="160" y="270" width="80" height="30" rx="15" fill="#006e21" stroke="#00e676" stroke-width="1.5" />
  <text x="200" y="290" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="13" font-weight="900" text-anchor="middle">${initials}</text>

  <!-- Name & Role -->
  <text x="200" y="340" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="15" font-weight="800" text-anchor="middle">${name}</text>
  <text x="200" y="365" fill="#93c5fd" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600" text-anchor="middle">${role}</text>
</svg>
`;
}

writeSvg('public/images/team/avatar-alan.svg', makeAvatarSvg({ name: 'Dr. Alan Turing, PhD', role: 'Director of Structural Mechanics', initials: 'AT', color: '#002855' }));
writeSvg('public/images/team/avatar-sarah.svg', makeAvatarSvg({ name: 'Sarah Jenkins, PE', role: 'Head of Decarbonization & LCA', initials: 'SJ', color: '#064e3b' }));
writeSvg('public/images/team/avatar-kenji.svg', makeAvatarSvg({ name: 'Prof. Kenji Sato, PhD', role: 'Materials Metallurgy Scientist', initials: 'KS', color: '#1e293b' }));
writeSvg('public/images/team/avatar-elena.svg', makeAvatarSvg({ name: 'Dr. Elena Rostova', role: 'Director of Geotechnical Infrastructure', initials: 'ER', color: '#312e81' }));
writeSvg('public/images/team/avatar-marcus.svg', makeAvatarSvg({ name: 'Marcus Thorne', role: 'Global Precast Engineering Principal', initials: 'MT', color: '#0f766e' }));

writeSvg('public/images/team/avatar-minh.svg', makeAvatarSvg({ name: 'Minh Nguyen', role: 'Chief Executive Officer & Founder', initials: 'MN', color: '#00356a' }));
writeSvg('public/images/team/avatar-sophie.svg', makeAvatarSvg({ name: 'Sophie Laurent', role: 'Chief Technology Officer', initials: 'SL', color: '#006e21' }));
writeSvg('public/images/team/avatar-david.svg', makeAvatarSvg({ name: 'David Chen', role: 'VP of Global Operations & Logistics', initials: 'DC', color: '#1e3a8a' }));

// -------------------------------------------------------------
// 9. OPEN GRAPH PREVIEW (1200 x 630)
// -------------------------------------------------------------
const ogPreviewSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="ogBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#001830" />
      <stop offset="60%" stop-color="#00356a" />
      <stop offset="100%" stop-color="#002244" />
    </linearGradient>
    <linearGradient id="ogGreen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#00e676" />
      <stop offset="100%" stop-color="#006e21" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#ogBg)" />

  <!-- Subtle Blueprint Grid -->
  <g stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.08">
    <line x1="0" y1="126" x2="1200" y2="126" />
    <line x1="0" y1="252" x2="1200" y2="252" />
    <line x1="0" y1="378" x2="1200" y2="378" />
    <line x1="0" y1="504" x2="1200" y2="504" />
    <line x1="240" y1="0" x2="240" y2="630" />
    <line x1="480" y1="0" x2="480" y2="630" />
    <line x1="720" y1="0" x2="720" y2="630" />
    <line x1="960" y1="0" x2="960" y2="630" />
  </g>

  <!-- HOKI Brand Lockup -->
  <g transform="translate(80, 80)">
    <polygon points="25,0 75,0 100,43 75,86 25,86 0,43" fill="none" stroke="#00e676" stroke-width="5" />
    <circle cx="50" cy="43" r="14" fill="#00e676" />
    <text x="125" y="58" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="44" font-weight="900" letter-spacing="4">HOKI</text>
    <text x="275" y="58" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="20" font-weight="700">— STEEL FIBER</text>
  </g>

  <!-- Value Headline -->
  <text x="80" y="240" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="48" font-weight="900" line-height="1.2">
    Precision Engineering.
  </text>
  <text x="80" y="300" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="48" font-weight="900">
    Sustainable Infrastructure.
  </text>

  <text x="80" y="360" fill="#cbd5e1" font-family="'Montserrat', sans-serif" font-size="20" font-weight="500">
    High-Performance Cold-Drawn Hooked-End Steel Fiber Concrete Reinforcement
  </text>

  <!-- Feature Pills -->
  <g transform="translate(80, 420)">
    <rect x="0" y="0" width="220" height="44" rx="22" fill="#001f3f" stroke="#00e676" stroke-width="1.5" />
    <text x="110" y="27" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="13" font-weight="bold" text-anchor="middle">TR34 4TH EDITION</text>

    <rect x="240" y="0" width="240" height="44" rx="22" fill="#001f3f" stroke="#38bdf8" stroke-width="1.5" />
    <text x="360" y="27" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="13" font-weight="bold" text-anchor="middle">EN 14889-1 SYSTEM 1</text>

    <rect x="500" y="0" width="220" height="44" rx="22" fill="#001f3f" stroke="#eab308" stroke-width="1.5" />
    <text x="610" y="27" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="13" font-weight="bold" text-anchor="middle">ASTM A820 TYPE I</text>

    <rect x="740" y="0" width="260" height="44" rx="22" fill="#006e21" />
    <text x="870" y="27" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="13" font-weight="bold" text-anchor="middle">40% FASTER POUR SCHEDULE</text>
  </g>

  <!-- Footer Verification -->
  <g transform="translate(80, 550)">
    <line x1="0" y1="0" x2="1040" y2="0" stroke="#ffffff" stroke-opacity="0.15" />
    <text x="0" y="32" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="13" font-weight="600">Verified SFRC Slabs &gt; 1,000,000 m² | 50,000 MT Annual Cold-Drawing Capacity</text>
    <text x="1040" y="32" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="13" font-weight="bold" text-anchor="end">hokimetal.com</text>
  </g>
</svg>
`;

writeSvg('public/images/og-preview.svg', ogPreviewSvg);
writeSvg('public/og-preview.svg', ogPreviewSvg);

// Generate og-preview.png using pure node script
function createSolidPng(width, height, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const crc = crc32(Buffer.concat([typeBuf, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }
  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ (-1)) >>> 0;
  }
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const row = Buffer.alloc(1 + width * 3);
  row[0] = 0;
  for (let x = 0; x < width; x++) {
    row[1 + x * 3] = r;
    row[1 + x * 3 + 1] = g;
    row[1 + x * 3 + 2] = b;
  }
  const rawData = Buffer.concat(Array(height).fill(row));
  const compressed = zlib.deflateSync(rawData);
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const ogPng = createSolidPng(1200, 630, 0, 53, 106);
fs.writeFileSync('public/og-preview.png', ogPng);
fs.writeFileSync('public/images/og-preview.png', ogPng);
console.log('Created: public/og-preview.png & public/images/og-preview.png');
console.log('All local image assets generated successfully!');
