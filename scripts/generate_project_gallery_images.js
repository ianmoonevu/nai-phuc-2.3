// scripts/generate_project_gallery_images.js
import fs from 'fs';
import path from 'path';

const galleryDir = 'public/images/projects/gallery';
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
}

function writeSvg(filename, svgContent) {
  const filePath = path.join(galleryDir, filename);
  fs.writeFileSync(filePath, svgContent.trim());
  console.log('Created gallery asset:', filePath);
}

// 1. Laser Screed Pouring
const screedPourSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bgScreed" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a192f" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="wetConcrete" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
    <linearGradient id="screedArm" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <linearGradient id="laserBeam" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ef4444" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#ef4444" stop-opacity="0.1" />
    </linearGradient>
  </defs>

  <rect width="1200" height="800" fill="url(#bgScreed)" />

  <!-- Industrial High-Bay Roof Structure -->
  <g stroke="#ffffff" stroke-width="1" stroke-opacity="0.08">
    <line x1="0" y1="120" x2="1200" y2="120" />
    <line x1="0" y1="240" x2="1200" y2="240" />
    <line x1="200" y1="0" x2="200" y2="400" />
    <line x1="600" y1="0" x2="600" y2="400" />
    <line x1="1000" y1="0" x2="1000" y2="400" />
    <!-- Truss diagonals -->
    <path d="M 0 120 L 200 0 L 400 120 L 600 0 L 800 120 L 1000 0 L 1200 120" fill="none" />
  </g>

  <!-- Wet Concrete Floor Section (Perspective) -->
  <polygon points="60,740 340,420 1140,420 1140,740" fill="url(#wetConcrete)" stroke="#64748b" stroke-width="2" />

  <!-- Steel fibers embedded in wet paste -->
  <g stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" opacity="0.65">
    <line x1="200" y1="580" x2="230" y2="590" />
    <line x1="380" y1="620" x2="410" y2="605" />
    <line x1="520" y1="530" x2="550" y2="545" />
    <line x1="720" y1="670" x2="750" y2="660" />
    <line x1="840" y1="590" x2="870" y2="605" />
    <line x1="960" y1="680" x2="990" y2="665" />
    <line x1="640" y1="610" x2="670" y2="625" />
    <line x1="440" y1="690" x2="470" y2="680" />
    <line x1="310" y1="510" x2="340" y2="520" />
    <line x1="820" y1="490" x2="850" y2="505" />
  </g>

  <!-- Laser Screed Head Graphic -->
  <g transform="translate(420, 360)">
    <!-- Telescopic Boom -->
    <rect x="80" y="30" width="380" height="24" rx="4" fill="url(#screedArm)" stroke="#b45309" stroke-width="1.5" />
    <rect x="0" y="20" width="90" height="44" rx="8" fill="#475569" />
    <!-- Screed Vibrating Box -->
    <rect x="440" y="20" width="220" height="70" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
    <!-- Laser Receiver Poles -->
    <line x1="480" y1="20" x2="480" y2="-60" stroke="#94a3b8" stroke-width="4" />
    <circle cx="480" cy="-60" r="10" fill="#ef4444" />
    <line x1="620" y1="20" x2="620" y2="-60" stroke="#94a3b8" stroke-width="4" />
    <circle cx="620" cy="-60" r="10" fill="#ef4444" />
    <!-- Laser emitter reference beam -->
    <line x1="-300" y1="-60" x2="700" y2="-60" stroke="url(#laserBeam)" stroke-width="3" stroke-dasharray="8 4" />
  </g>

  <!-- Telemetry HUD Overlay -->
  <g transform="translate(60, 60)">
    <rect width="360" height="70" rx="16" fill="#00356a" fill-opacity="0.9" stroke="#38bdf8" stroke-width="1.5" />
    <text x="24" y="28" fill="#38bdf8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700">CONSTRUCTION PHASE 01</text>
    <text x="24" y="52" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="16" font-weight="900">Laser Screed &amp; Continuous Pour</text>
  </g>

  <g transform="translate(780, 60)">
    <rect width="360" height="70" rx="16" fill="#001830" fill-opacity="0.9" stroke="#00e676" stroke-width="1.5" />
    <text x="24" y="28" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700">SLAB FLATNESS TOLERANCE</text>
    <text x="24" y="52" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="16" font-weight="900">FM2 Special / 3,200 m² Day</text>
  </g>

  <!-- Technical Watermark / Footer -->
  <g transform="translate(60, 710)">
    <rect width="1080" height="50" rx="12" fill="#020617" fill-opacity="0.8" stroke="#334155" stroke-width="1" />
    <text x="24" y="30" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="12">
      Field Operation: 30 kg/m³ HOKI HF-8060 fibers dosed via automated conveyor into 10m³ transit mixer
    </text>
    <text x="1050" y="30" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" text-anchor="end">
      ZERO REBAR MESH
    </text>
  </g>
</svg>
`;

writeSvg('gallery-screed-pour.svg', screedPourSvg);

// 2. ASTM C1609 / EN 14651 Beam Test Rig
const astmTestSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bgLab" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
  </defs>

  <rect width="1200" height="800" fill="url(#bgLab)" />

  <!-- Lab Grid -->
  <g stroke="#ffffff" stroke-width="1" stroke-opacity="0.06">
    <line x1="0" y1="200" x2="1200" y2="200" />
    <line x1="0" y1="400" x2="1200" y2="400" />
    <line x1="0" y1="600" x2="1200" y2="600" />
    <line x1="300" y1="0" x2="300" y2="800" />
    <line x1="600" y1="0" x2="600" y2="800" />
    <line x1="900" y1="0" x2="900" y2="800" />
  </g>

  <!-- Left: Test Rig Frame -->
  <g transform="translate(100, 180)">
    <!-- Loading Machine Frame -->
    <rect x="0" y="0" width="40" height="420" rx="6" fill="#334155" />
    <rect x="420" y="0" width="40" height="420" rx="6" fill="#334155" />
    <rect x="0" y="0" width="460" height="50" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2" />
    <!-- Hydraulic Actuator -->
    <rect x="195" y="50" width="70" height="120" rx="6" fill="#0284c7" />
    <line x1="230" y1="170" x2="230" y2="230" stroke="#f8fafc" stroke-width="12" />
    <path d="M 200 230 L 260 230" stroke="#f8fafc" stroke-width="10" stroke-linecap="round" />

    <!-- 150x150x500mm Concrete Beam Specimen -->
    <rect x="40" y="270" width="380" height="90" rx="6" fill="url(#beamGrad)" stroke="#64748b" stroke-width="2" />
    
    <!-- Notched Center Crack & Fiber Bridging -->
    <line x1="230" y1="360" x2="230" y2="335" stroke="#ef4444" stroke-width="2.5" />
    <!-- Bridging Steel Fibers -->
    <line x1="215" y1="340" x2="245" y2="335" stroke="#00e676" stroke-width="2" stroke-linecap="round" />
    <line x1="218" y1="348" x2="242" y2="352" stroke="#00e676" stroke-width="2" stroke-linecap="round" />
    <line x1="222" y1="328" x2="238" y2="332" stroke="#00e676" stroke-width="2" stroke-linecap="round" />

    <!-- Support Rollers -->
    <circle cx="80" cy="380" r="18" fill="#64748b" stroke="#94a3b8" stroke-width="2" />
    <circle cx="380" cy="380" r="18" fill="#64748b" stroke="#94a3b8" stroke-width="2" />
    <rect x="30" y="398" width="400" height="24" rx="4" fill="#1e293b" />
  </g>

  <!-- Right: Digital Load-Deflection Graph -->
  <g transform="translate(620, 180)">
    <rect width="480" height="420" rx="20" fill="#090d16" stroke="#006e21" stroke-width="2" />
    
    <!-- Graph Header -->
    <text x="30" y="45" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700">ASTM C1609 / EN 14651 COMPLIANCE</text>
    <text x="30" y="75" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="20" font-weight="900">Flexural Toughness &amp; fR3k</text>

    <!-- Graph Axes -->
    <g stroke="#334155" stroke-width="1.5">
      <line x1="60" y1="340" x2="430" y2="340" />
      <line x1="60" y1="120" x2="60" y2="340" />
    </g>

    <!-- Traditional Concrete Curve (Brittle Fall-off) -->
    <path d="M 60 340 Q 110 160 130 150 L 140 335 L 430 338" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 4" />
    <text x="150" y="325" fill="#ef4444" font-family="'Montserrat', sans-serif" font-size="10" font-weight="600">Plain Concrete (Brittle Rupture)</text>

    <!-- HOKI Steel Fiber Reinforced Concrete Ductile Curve -->
    <path d="M 60 340 Q 110 160 130 145 C 180 155 280 175 430 210" fill="none" stroke="#00e676" stroke-width="4" />
    <text x="240" y="160" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800">HOKI SFRC Plastic Plateau (Ductile)</text>

    <!-- Telemetry Markers -->
    <circle cx="130" cy="145" r="5" fill="#38bdf8" />
    <text x="140" y="138" fill="#38bdf8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700">Peak Load fL = 4.8 MPa</text>

    <circle cx="280" cy="175" r="5" fill="#facc15" />
    <text x="290" y="195" fill="#facc15" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700">fR1k = 2.4 MPa (CMOD 0.5mm)</text>

    <circle cx="410" cy="205" r="5" fill="#00e676" />
    <text x="290" y="240" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700">fR3k = 2.1 MPa (CMOD 2.5mm)</text>

    <!-- Status Badge -->
    <g transform="translate(30, 360)">
      <rect width="420" height="40" rx="8" fill="#14532d" />
      <text x="210" y="25" fill="#bbf7d0" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" text-anchor="middle">
        VERIFIED: Residual Strength Ratio Re,3 > 72%
      </text>
    </g>
  </g>

  <!-- Top Header Banner -->
  <g transform="translate(60, 60)">
    <rect width="400" height="70" rx="16" fill="#00356a" fill-opacity="0.9" stroke="#38bdf8" stroke-width="1.5" />
    <text x="24" y="28" fill="#38bdf8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700">QUALITY ASSURANCE PHASE 02</text>
    <text x="24" y="52" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="16" font-weight="900">4-Point Notched Beam Testing</text>
  </g>
</svg>
`;

writeSvg('gallery-astm-test.svg', astmTestSvg);

// 3. Finished Jointless Floor with Heavy Forklift / AGV Operations
const agvTrafficSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bgWarehouse" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#02162e" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="polishedFloor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="60%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="agvOrange" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ea580c" />
      <stop offset="100%" stop-color="#c2410c" />
    </linearGradient>
  </defs>

  <rect width="1200" height="800" fill="url(#bgWarehouse)" />

  <!-- Racking Aisles in Background -->
  <g stroke="#1e3a5f" stroke-width="2" opacity="0.6">
    <!-- Left Racking Columns -->
    <line x1="80" y1="80" x2="80" y2="460" />
    <line x1="160" y1="80" x2="160" y2="460" />
    <line x1="80" y1="160" x2="160" y2="160" />
    <line x1="80" y1="260" x2="160" y2="260" />
    <line x1="80" y1="360" x2="160" y2="360" />
    
    <!-- Right Racking Columns -->
    <line x1="1040" y1="80" x2="1040" y2="460" />
    <line x1="1120" y1="80" x2="1120" y2="460" />
    <line x1="1040" y1="160" x2="1120" y2="160" />
    <line x1="1040" y1="260" x2="1120" y2="260" />
    <line x1="1040" y1="360" x2="1120" y2="360" />
  </g>

  <!-- Superflat Polished Concrete Floor -->
  <polygon points="0,480 400,320 800,320 1200,480 1200,800 0,800" fill="url(#polishedFloor)" stroke="#475569" stroke-width="2" />

  <!-- AGV Automated Guide Line (Laser/Magnetic Track) -->
  <line x1="600" y1="320" x2="600" y2="800" stroke="#38bdf8" stroke-width="3" stroke-dasharray="16 10" />
  <line x1="420" y1="400" x2="320" y2="800" stroke="#00e676" stroke-width="2" stroke-opacity="0.4" />
  <line x1="780" y1="400" x2="880" y2="800" stroke="#00e676" stroke-width="2" stroke-opacity="0.4" />

  <!-- AGV Robotic Carrier in Foreground -->
  <g transform="translate(450, 460)">
    <!-- Shadow -->
    <ellipse cx="150" cy="180" rx="140" ry="20" fill="#000000" opacity="0.6" />
    <!-- Chassis -->
    <rect x="30" y="80" width="240" height="90" rx="16" fill="url(#agvOrange)" stroke="#f97316" stroke-width="2" />
    <!-- Wheels -->
    <rect x="40" y="155" width="40" height="24" rx="4" fill="#0f172a" />
    <rect x="220" y="155" width="40" height="24" rx="4" fill="#0f172a" />
    <!-- LIDAR / Optical Sensor Scanner -->
    <circle cx="150" cy="70" r="16" fill="#38bdf8" />
    <path d="M 120 70 A 30 30 0 0 1 180 70" fill="none" stroke="#38bdf8" stroke-width="3" />
    <!-- Industrial Cargo Payload (Automotive Stamping Press Part) -->
    <rect x="50" y="-10" width="200" height="90" rx="8" fill="#334155" stroke="#64748b" stroke-width="2" />
    <text x="150" y="40" fill="#f8fafc" font-family="'Montserrat', sans-serif" font-size="14" font-weight="800" text-anchor="middle">
      160 kN AGV WHEEL LOAD
    </text>
  </g>

  <!-- Header Banner -->
  <g transform="translate(60, 60)">
    <rect width="440" height="70" rx="16" fill="#00356a" fill-opacity="0.9" stroke="#38bdf8" stroke-width="1.5" />
    <text x="24" y="28" fill="#38bdf8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700">COMMISSIONED FACILITY OPERATION</text>
    <text x="24" y="52" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="16" font-weight="900">Jointless High-Traffic Floor Slab</text>
  </g>

  <!-- Performance Card -->
  <g transform="translate(740, 60)">
    <rect width="400" height="70" rx="16" fill="#001830" fill-opacity="0.9" stroke="#00e676" stroke-width="1.5" />
    <text x="24" y="28" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700">MAINTENANCE STATUS</text>
    <text x="24" y="52" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="16" font-weight="900">Zero Joint Spalling / 100% Flatness</text>
  </g>
</svg>
`;

writeSvg('gallery-agv-traffic.svg', agvTrafficSvg);

// 4. Armored Load-Transfer Joint Detail
const armoredJointSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bgJoint" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#091428" />
      <stop offset="100%" stop-color="#020817" />
    </linearGradient>
    <linearGradient id="slabLeft" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>
    <linearGradient id="armoredSteel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#94a3b8" />
      <stop offset="50%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#64748b" />
    </linearGradient>
  </defs>

  <rect width="1200" height="800" fill="url(#bgJoint)" />

  <!-- Macro Technical Detail Cross-Section -->
  <g transform="translate(100, 220)">
    <!-- Left Concrete Slab Bay (40m) -->
    <rect x="0" y="60" width="480" height="280" rx="4" fill="url(#slabLeft)" stroke="#64748b" stroke-width="2" />
    <text x="200" y="220" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="18" font-weight="800" text-anchor="middle">
      BAY A: HOKI SFRC SLAB (200mm)
    </text>

    <!-- Right Concrete Slab Bay (40m) -->
    <rect x="520" y="60" width="480" height="280" rx="4" fill="url(#slabLeft)" stroke="#64748b" stroke-width="2" />
    <text x="760" y="220" fill="#94a3b8" font-family="'Montserrat', sans-serif" font-size="18" font-weight="800" text-anchor="middle">
      BAY B: HOKI SFRC SLAB (200mm)
    </text>

    <!-- Embedded Steel Fibers isotropic network -->
    <g stroke="#38bdf8" stroke-width="2" stroke-linecap="round" opacity="0.6">
      <line x1="80" y1="120" x2="120" y2="135" />
      <line x1="160" y1="90" x2="200" y2="85" />
      <line x1="260" y1="140" x2="290" y2="160" />
      <line x1="380" y1="110" x2="420" y2="125" />
      <line x1="600" y1="130" x2="640" y2="115" />
      <line x1="720" y1="95" x2="760" y2="110" />
      <line x1="840" y1="140" x2="880" y2="120" />
      <line x1="900" y1="180" x2="930" y2="200" />
    </g>

    <!-- Heavy-Duty Armored Steel Edge Protectors -->
    <rect x="460" y="55" width="20" height="80" rx="2" fill="url(#armoredSteel)" stroke="#f8fafc" stroke-width="1.5" />
    <rect x="520" y="55" width="20" height="80" rx="2" fill="url(#armoredSteel)" stroke="#f8fafc" stroke-width="1.5" />
    <!-- Armor anchoring shear studs -->
    <line x1="460" y1="95" x2="380" y2="95" stroke="#f8fafc" stroke-width="8" stroke-linecap="round" />
    <line x1="540" y1="95" x2="620" y2="95" stroke="#f8fafc" stroke-width="8" stroke-linecap="round" />

    <!-- Continuous Plate Dowel Sleeved Load Transfer Mechanism -->
    <rect x="360" y="170" width="280" height="30" rx="4" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
    <text x="500" y="191" fill="#713f12" font-family="'Montserrat', sans-serif" font-size="11" font-weight="900" text-anchor="middle">
      TR34 PLATE DOWEL LOAD TRANSFER
    </text>

    <!-- Joint Gap Annotation (Thermal movement without curling) -->
    <line x1="480" y1="30" x2="520" y2="30" stroke="#00e676" stroke-width="2" />
    <text x="500" y="20" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" text-anchor="middle">
      Controlled Opening (15mm max)
    </text>

    <!-- Subbase -->
    <rect x="0" y="340" width="1000" height="40" fill="#1e293b" stroke="#334155" />
    <text x="500" y="365" fill="#64748b" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" text-anchor="middle">
      Engineered Crushed Aggregate Base (k ≥ 0.08 N/mm³)
    </text>
  </g>

  <!-- Header -->
  <g transform="translate(60, 60)">
    <rect width="480" height="70" rx="16" fill="#00356a" fill-opacity="0.9" stroke="#38bdf8" stroke-width="1.5" />
    <text x="24" y="28" fill="#38bdf8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700">STRUCTURAL JOINTLESS TECHNOLOGY</text>
    <text x="24" y="52" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="16" font-weight="900">Armored Load-Transfer Joint Assembly</text>
  </g>

  <g transform="translate(780, 60)">
    <rect width="360" height="70" rx="16" fill="#001830" fill-opacity="0.9" stroke="#00e676" stroke-width="1.5" />
    <text x="24" y="28" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700">CURLING &amp; SPALLING DEFENSE</text>
    <text x="24" y="52" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="16" font-weight="900">Eliminates 100% Saw-Cuts</text>
  </g>
</svg>
`;

writeSvg('gallery-armored-joint.svg', armoredJointSvg);

// 5. Precast Precision Mould & Demoulding
const precastMouldSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bgPrecast" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#042f2e" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="precastConcrete" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#64748b" />
    </linearGradient>
  </defs>

  <rect width="1200" height="800" fill="url(#bgPrecast)" />

  <!-- Overhead Gantry Crane Track -->
  <rect x="0" y="80" width="1200" height="30" fill="#334155" stroke="#475569" />
  <rect x="520" y="70" width="160" height="50" rx="8" fill="#eab308" />
  <line x1="600" y1="120" x2="600" y2="240" stroke="#f8fafc" stroke-width="4" stroke-dasharray="6 4" />

  <!-- Precast Steel Mould & Finished Elements -->
  <g transform="translate(180, 260)">
    <!-- Demoulded U-Drain / Box Culvert Unit -->
    <path d="M 50 180 L 150 60 L 750 60 L 850 180 L 850 400 L 750 480 L 150 480 L 50 400 Z" fill="url(#precastConcrete)" stroke="#475569" stroke-width="3" />
    <path d="M 220 220 L 280 140 L 620 140 L 680 220 L 680 360 L 620 420 L 280 420 L 220 360 Z" fill="#042f2e" stroke="#64748b" stroke-width="2" />
    
    <!-- Micro-Fiber Mesh Displacement Tag -->
    <rect x="320" y="240" width="260" height="60" rx="12" fill="#022c22" stroke="#00e676" stroke-width="2" />
    <text x="450" y="265" fill="#00e676" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700" text-anchor="middle">DEMOULD DEFECTS</text>
    <text x="450" y="288" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="16" font-weight="900" text-anchor="middle">Reduced from 4.2% to 0.05%</text>
  </g>

  <!-- Top Header -->
  <g transform="translate(60, 60)">
    <rect width="440" height="70" rx="16" fill="#00356a" fill-opacity="0.9" stroke="#38bdf8" stroke-width="1.5" />
    <text x="24" y="28" fill="#38bdf8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700">PRECAST COMPONENT ENGINEERING</text>
    <text x="24" y="52" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="16" font-weight="900">Demoulding With High Micro-Fiber Count</text>
  </g>
</svg>
`;

writeSvg('gallery-precast-elements.svg', precastMouldSvg);

// 6. Port & Hardstand Heavy Axle Proof Loading
const portApronSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bgPort" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0c2340" />
      <stop offset="100%" stop-color="#030d1a" />
    </linearGradient>
    <linearGradient id="heavyApron" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>

  <rect width="1200" height="800" fill="url(#bgPort)" />

  <!-- Harbor Cranes Silhouettes in Background -->
  <g stroke="#1e3a5f" stroke-width="3" opacity="0.4">
    <path d="M 80 340 L 160 120 L 240 340 M 160 120 L 400 80" fill="none" />
    <path d="M 960 340 L 1040 100 L 1120 340 M 1040 100 L 800 60" fill="none" />
  </g>

  <!-- Heavy Duty Apron Pavement -->
  <polygon points="0,420 400,280 800,280 1200,420 1200,800 0,800" fill="url(#heavyApron)" stroke="#64748b" stroke-width="2" />

  <!-- 50-Tonne Proof Axle Pressure Distribution Vector -->
  <g transform="translate(480, 360)">
    <!-- Wheel Tyres -->
    <rect x="0" y="60" width="80" height="140" rx="16" fill="#090d16" stroke="#38bdf8" stroke-width="2" />
    <rect x="160" y="60" width="80" height="140" rx="16" fill="#090d16" stroke="#38bdf8" stroke-width="2" />
    <rect x="40" y="100" width="160" height="30" fill="#334155" />

    <!-- Stress Cone Conduction into Subgrade -->
    <polygon points="0,200 120,380 -60,380" fill="#38bdf8" opacity="0.15" />
    <polygon points="240,200 300,380 120,380" fill="#38bdf8" opacity="0.15" />
    
    <!-- Pressure Vector Arrow -->
    <line x1="120" y1="20" x2="120" y2="90" stroke="#ef4444" stroke-width="8" marker-end="url(#arrow)" />
    <text x="120" y="0" fill="#f87171" font-family="'Montserrat', sans-serif" font-size="14" font-weight="900" text-anchor="middle">
      50-TONNE TANKER AXLE LOAD
    </text>
  </g>

  <!-- Header -->
  <g transform="translate(60, 60)">
    <rect width="480" height="70" rx="16" fill="#00356a" fill-opacity="0.9" stroke="#38bdf8" stroke-width="1.5" />
    <text x="24" y="28" fill="#38bdf8" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700">HEAVY INDUSTRIAL PAVEMENT</text>
    <text x="24" y="52" fill="#ffffff" font-family="'Montserrat', sans-serif" font-size="16" font-weight="900">Port Apron &amp; Logistics Hardstand</text>
  </g>
</svg>
`;

writeSvg('gallery-port-apron.svg', portApronSvg);

console.log('All gallery SVG assets successfully generated.');
