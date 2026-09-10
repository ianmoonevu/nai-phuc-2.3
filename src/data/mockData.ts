import {
  ProjectCaseStudy,
  JournalArticle,
  FiberProduct,
  LeadershipHead,
  AdvisoryMember,
  GlobalOffice,
  TimelineMilestone,
  StrategicPartner,
  EpcSectionConfig,
  AboutPageInfo
} from '../types';

export const FIBER_PRODUCTS: FiberProduct[] = [
  {
    id: 'hf-8060',
    name: 'HF-8060 Series',
    series: 'Heavy Duty Industrial & Structural',
    subtitle: 'Hooked-End Cold-Drawn Steel Fiber for Maximum Dynamic Load Transfer & Jointless Slabs',
    tensileStrength: '1,200 – 1,500 MPa',
    tensileClasses: ['1200 MPa', '1300 MPa', '1400 MPa', '1500 MPa'],
    codes: ['TN', 'TM', 'TH', 'TU', 'QN', 'QM', 'QH', 'QU'],
    standardCodes: ['HK-8060-TN', 'HK-8060-TM', 'HK-8060-TH', 'HK-8060-TU'],
    aspectRatio: '80',
    keyMetric1: { label: 'Fiber Count', value: '4,220 / kg' },
    keyMetric2: { label: 'Aspect Ratio', value: '80 (L/D)' },
    description: 'Engineered specifically for heavy-duty industrial ground-supported slabs, port container stacking yards, automated logistics hubs, and deep underground tunnel linings. The hooked-end anchorage engages the cementitious matrix at micro-crack inception to deliver exceptional post-cracking flexural toughness and fatigue endurance.',
    primaryApplication: 'Heavy-Duty Industrial Slabs, Logistics Facilities, Ports & Intermodal Yards, Tunnel Segments',
    applications: [
      'Heavy-Duty Industrial Ground-Supported Slabs',
      'Port Container Stacking Yards & Intermodal Terminals',
      'Automated Logistics Centers & High-Bay Warehousing',
      'Precast Tunnel Segments & Deep Mining Shaft Linings'
    ],
    fiberCountPerKg: '4,220 fibers/kg',
    geometry: 'Hooked-end 3D with bi-directional mechanical crimp',
    diameter: '0.75 mm',
    length: '60 mm',
    coating: 'Bright low-carbon cold-drawn high-tensile alloy with proprietary ITZ micro-roughness',
    image: '/images/products/product-hf-8060.svg',
    standards: ['ASTM A820 Type I', 'EN 14889-1 System 1', 'TR34 4th Edition', 'fib Model Code 2020 Class 4a']
  },
  {
    id: 'hf-6535',
    name: 'HF-6535 Series',
    series: 'Multi-Purpose Crack Control',
    subtitle: 'High Fiber Network Density for Crack Elimination, Precast Elements & Commercial Floors',
    tensileStrength: '1,100 – 1,500 MPa',
    tensileClasses: ['1100 MPa', '1300 MPa', '1400 MPa', '1500 MPa'],
    codes: ['TN', 'TM', 'TH', 'TU', 'QN', 'QM', 'QH', 'QU'],
    standardCodes: ['HK-6535-TN', 'HK-6535-TM', 'HK-6535-TH', 'HK-6535-TU'],
    aspectRatio: '65',
    keyMetric1: { label: 'Fiber Count', value: '10,970 / kg' },
    keyMetric2: { label: 'Crack Width', value: '< 0.15 mm' },
    description: 'With nearly 11,000 fibers per kilogram, the HF-6535 creates an ultra-dense spatial reinforcement network throughout the concrete paste. Ideal for controlling early-age plastic shrinkage cracking, thermal curl, and surface abrasion in multi-bay warehouses, commercial hardstands, and modular precast elements.',
    primaryApplication: 'Industrial Floors, Distribution Warehouses, Parking Hardstands, Precast Modular Elements',
    applications: [
      'Warehouse & Commercial Flooring Slabs',
      'External Hardstands & Truck Maneuvering Aprons',
      'Modular Precast Elements & Thin-Walled Structures',
      'Early-Age Plastic Shrinkage & Thermal Crack Control'
    ],
    fiberCountPerKg: '10,970 fibers/kg',
    geometry: 'Hooked-end collated strips for rapid, clump-free dispersion',
    diameter: '0.55 mm',
    length: '35 mm',
    coating: 'Bright low-carbon cold-drawn wire / Galvanized corrosion-inhibited options',
    image: '/images/products/product-hf-6535.svg',
    standards: ['EN 14889-1 System 1', 'ASTM A820 Type I', 'ACI 544.4R', 'ISO 9001:2015']
  },
  {
    id: 'hf-10020',
    name: 'HF-10020 Series',
    series: 'Ultra-High Tensile Reinforcement',
    subtitle: 'Ultra-High Tensile Micro-Steel Fibers for High-Performance Concrete (UHPC) & Critical Precast',
    tensileStrength: '≥ 2,000 MPa',
    tensileClasses: ['2000 MPa', '2200 MPa', '2400 MPa'],
    codes: ['HF-10020MU'],
    standardCodes: ['HK-10020-MU', 'HK-10020-UHPC'],
    aspectRatio: '100',
    keyMetric1: { label: 'Fiber Count', value: '90,110 / kg' },
    keyMetric2: { label: 'Tensile Strength', value: '≥ 2,000 MPa' },
    description: 'Designed for Ultra-High Performance Concrete (UHPC), thin architectural panels, security vaults, seismic damping joints, and demanding precast infrastructure. With over 90,000 micro-fibers per kg and extreme 2,000+ MPa tensile strength, it prevents micro-cracks before they propagate into macroscopic shear bands.',
    primaryApplication: 'High-Performance Precast, UHPC Bridges & Facades, Specialized Structural Elements',
    applications: [
      'Ultra-High Performance Concrete (UHPC) Infrastructure',
      'Thin Architectural Facades & Security Panels',
      'Bridge Expansion Joints & Seismic Resilient Connections',
      'High-Toughness Blast & Impact Resistant Enclosures'
    ],
    fiberCountPerKg: '90,110 fibers/kg',
    geometry: 'Straight micro-fibers with brass/copper coating for superior interfacial bonding',
    diameter: '0.20 mm',
    length: '20 mm',
    coating: 'Electrolytic copper/brass alloy for optimal ITZ chemical bond',
    image: '/images/products/product-hf-10020.svg',
    standards: ['ASTM A820 Type I', 'EN 14889-1 System 1', 'NF P 18-470 (UHPC)', 'fib Model Code']
  }
];

export const PROJECT_CASES: ProjectCaseStudy[] = [
  {
    id: 'case-geely-auto',
    slug: 'geely-automobile-plant',
    code: 'HK-PRJ-GL01',
    title: 'Geely Automobile Chengdu Plant',
    facilityType: 'Mega Automotive Manufacturing Facility',
    sector: 'industrial',
    sectorLabel: 'Industrial Floors',
    location: 'Chengdu Automotive Mega-Hub',
    area: '250,000 m²',
    description: 'Complete industrial slab engineering for Geely Automotive pressing, stamping, robotic welding, and final assembly lines subjected to heavy dynamic vibration and 160 kN automated guided vehicle (AGV) wheel loads.',
    image: '/images/projects/project-geely.svg',
    gallery: [
      {
        url: '/images/projects/project-geely.svg',
        title: 'Geely Mega Complex Overview',
        caption: '250,000 m² heavy-duty industrial floor slab supporting automated stamping presses and robotic assembly lines.',
        phaseTag: '01 FACILITY OVERVIEW'
      },
      {
        url: '/images/projects/gallery/gallery-screed-pour.svg',
        title: 'Laser Screed & Continuous Pour',
        caption: 'Continuous daily pours of 3,200 m² with HOKI HF-8060 fibers dosed at 30 kg/m³, achieving FM2 Special flatness tolerances.',
        phaseTag: '02 LASER SCREED & POUR'
      },
      {
        url: '/images/projects/gallery/gallery-astm-test.svg',
        title: 'ASTM C1609 Flexural Testing',
        caption: 'On-site 4-point notched beam bending testing validating residual flexural strength ratio Re,3 > 72% under cyclic dynamic loading.',
        phaseTag: '03 QA VERIFICATION'
      },
      {
        url: '/images/projects/gallery/gallery-agv-traffic.svg',
        title: 'Jointless AGV Transit Corridors',
        caption: 'Commissioned production floors with 160 kN automated guided vehicles operating on jointless slabs with zero spalling.',
        phaseTag: '04 COMMISSIONED'
      }
    ],
    challenge: 'Extreme cyclic dynamic loads from stamping presses and high-frequency AGV travel required zero surface cracking, jointless large-bay pours, and strict floor flatness tolerances (FM2 Special) without traditional rebar grid labor.',
    solution: 'Engineered HOKI HF-8060 hooked-end steel fiber dosed at 30 kg/m³ into C35/45 concrete. Utilized laser screed equipment for 3,000 m² daily continuous pours without conventional saw-cut joints.',
    verification: 'On-site beam bending testing according to ASTM C1609 verified residual flexural strength ratio Re,3 > 72%. Zero shrinkage cracks detected after 18 months of full production.',
    isHighlight: true,
    metrics: [
      { label: 'Rebar Steel Replaced', value: '1,850 MT', isHighlight: true },
      { label: 'Schedule Accelerated', value: '35 Days', isHighlight: true },
      { label: 'Carbon Abatement', value: '1,420 tCO₂e' }
    ],
    specifications: {
      fiberSeries: 'HF-8060 Series (L=60mm, D=0.75mm)',
      dosage: '30 kg/m³',
      concreteGrade: 'C35/45 (fck = 35 MPa)',
      jointSpacing: '40m x 40m Jointless Armored Bays'
    },
    clientQuote: 'HOKI fiber dosing enabled our general contractor to pour 250,000 m² in record time while guaranteeing absolute flatness for our robotic AGV navigation lines.',
    quoteAuthor: 'Lin Zhang, VP of Engineering & Plant Operations, Geely Auto Group',
    drawingsAvailable: true,
    droneVideoAvailable: true
  },
  {
    id: 'case-sailun-tire',
    slug: 'sailun-tay-ninh-plant',
    code: 'HK-PRJ-SL02',
    title: 'Sailun Tay Ninh Vietnam',
    facilityType: 'Heavy-Duty Tire Manufacturing Complex',
    sector: 'industrial',
    sectorLabel: 'Industrial Floors',
    location: 'Phuoc Dong Industrial Park, Tay Ninh, Vietnam',
    area: '200,000 m²',
    description: 'Heavy-duty industrial flooring for raw rubber compounding, heavy calender machines, and vulcanization halls exposed to intense thermal cycling and high point loading from loaded tire racks.',
    image: '/images/projects/project-sailun.svg',
    gallery: [
      {
        url: '/images/projects/project-sailun.svg',
        title: 'Sailun Plant Layout & Vulcanization Bays',
        caption: '200,000 m² heavy-duty tire plant engineering resisting 80°C thermal gradients and intense wheel point pressures.',
        phaseTag: '01 FACILITY OVERVIEW'
      },
      {
        url: '/images/projects/gallery/gallery-armored-joint.svg',
        title: 'Armored Load-Transfer Joint Profiles',
        caption: 'Armored construction joints with TR34 continuous plate dowels ensuring seamless load transfer across 40m bays without curling.',
        phaseTag: '02 ARMORED JOINTS'
      },
      {
        url: '/images/projects/gallery/gallery-screed-pour.svg',
        title: 'Automated Truck Dispensing',
        caption: 'HOKI HF-8060 fibers dosed at 28 kg/m³ directly into transit mixers, accelerating placement by 28 calendar days.',
        phaseTag: '03 FIBER DISPERSION'
      },
      {
        url: '/images/projects/gallery/gallery-agv-traffic.svg',
        title: 'Heavy Mast Forklift Traffic',
        caption: 'Full-scale operation with 120 kN mast forklifts on crack-free floors achieving Class AR0.5 severe abrasion resistance.',
        phaseTag: '04 HEAVY TRAFFIC'
      }
    ],
    challenge: 'High thermal gradients up to 80°C combined with 120 kN mast forklift transit caused rapid micro-cracking and spalling on conventional mesh floors in older facility phases.',
    solution: 'Specified HOKI HF-8060 fibers at 28 kg/m³ with armored construction joints. The 3D isotropic fiber matrix arrested thermal fatigue and distributed point wheel pressures seamlessly.',
    verification: 'EN 14651 notched beam tests demonstrated fR1k = 2.1 MPa and fR3k = 1.7 MPa, surpassing TR34 4th Edition requirements for unbonded ground-supported slabs.',
    isHighlight: true,
    metrics: [
      { label: 'Pour Time Saved', value: '28 Days', isHighlight: true },
      { label: 'Concrete Section Saved', value: '18%', isHighlight: true },
      { label: 'Abrasion Resistance', value: 'Class AR0.5' }
    ],
    specifications: {
      fiberSeries: 'HF-8060 Series (L=60mm, D=0.75mm)',
      dosage: '28 kg/m³',
      concreteGrade: 'C30/37 (fck = 30 MPa)',
      jointSpacing: 'Armored Load-Transfer Joints'
    },
    clientQuote: 'The elimination of mesh fixing allowed us to commission the vulcanization plant one month ahead of schedule with zero floor defects.',
    quoteAuthor: 'Nguyen Van Ha, Chief Project Manager, Sailun Vietnam',
    drawingsAvailable: true,
    droneVideoAvailable: true
  },
  {
    id: 'case-jinyu-tires',
    slug: 'jinyu-vietnam-tires',
    code: 'HK-PRJ-JY03',
    title: 'Jinyu Vietnam Tires',
    facilityType: 'Automated Radial Tire Plant',
    sector: 'industrial',
    sectorLabel: 'Industrial Floors',
    location: 'Tay Ninh Province, Vietnam',
    area: '180,000 m²',
    description: 'State-of-the-art radial commercial tire facility requiring high-flatness, crack-free industrial flooring to support heavy automated tire curing presses and high-density warehouse storage.',
    image: '/images/projects/project-jinyu.svg',
    gallery: [
      {
        url: '/images/projects/project-jinyu.svg',
        title: 'Jinyu Radial Tire Facility',
        caption: '180,000 m² automated radial commercial tire facility with 100% elimination of welded wire mesh.',
        phaseTag: '01 FACILITY OVERVIEW'
      },
      {
        url: '/images/projects/gallery/gallery-screed-pour.svg',
        title: 'Continuous Laser Screeding',
        caption: 'Laser-guided screeding placing C30/37 mix with 25 kg/m³ HF-8060 fibers across 35m x 35m jointless bays.',
        phaseTag: '02 SCREED & FINISH'
      },
      {
        url: '/images/projects/gallery/gallery-astm-test.svg',
        title: 'Core Wash-Out Dispersion Check',
        caption: 'Comprehensive core extraction and wash-out tests confirming homogeneous 4,200 fibers/kg (±3%) 3D dispersion throughout slab depth.',
        phaseTag: '03 QUALITY ASSURANCE'
      },
      {
        url: '/images/projects/gallery/gallery-armored-joint.svg',
        title: 'Heavy Curing Press Foundations',
        caption: 'Monolithic floor slabs maintaining micro-flatness under continuous harmonic vibration of tire curing presses.',
        phaseTag: '04 LIVE PRODUCTION'
      }
    ],
    challenge: 'Strict project timeline with zero tolerance for rebar placement errors or hollow voids under continuous vibrating extrusion machinery.',
    solution: 'Full displacement of welded wire mesh using HOKI HF-8060 fibers dosed directly into transit mixer trucks via automated conveyor dispensing.',
    verification: 'Full-scale core extraction and wash-out tests confirmed homogeneous fiber dispersion of 4,200 fibers/kg ± 3% throughout the slab depth.',
    isHighlight: true,
    metrics: [
      { label: 'Mesh Steel Eliminated', value: '100%', isHighlight: true },
      { label: 'Carbon Reduction', value: '38%', isHighlight: true },
      { label: 'Floor Flatness', value: 'FM2 Special' }
    ],
    specifications: {
      fiberSeries: 'HF-8060 Series (L=60mm, D=0.75mm)',
      dosage: '25 kg/m³',
      concreteGrade: 'C30/37',
      jointSpacing: '35m x 35m Jointless Bays'
    },
    clientQuote: 'HOKI technical engineers were on site for every single pour, certifying dosing accuracy and ensuring laser screed finishes met our exacting standards.',
    quoteAuthor: 'Wang Wei, Infrastructure Director, Jinyu Tire Group',
    drawingsAvailable: true,
    droneVideoAvailable: false
  },
  {
    id: 'case-nikko-material',
    slug: 'nikko-material-logistics',
    code: 'HK-PRJ-NK04',
    title: 'Nikko Material Vietnam',
    facilityType: 'Precision Automotive Materials Facility',
    sector: 'logistics',
    sectorLabel: 'Warehouses & Logistics Centres',
    location: 'Hai Phong Industrial Park, Vietnam',
    area: '150,000 m²',
    description: 'High-precision alloy and automotive materials logistics facility requiring extreme surface durability, dust-free performance, and jointless high-tolerance floor slabs.',
    image: '/images/projects/project-datacenter.svg',
    gallery: [
      {
        url: '/images/projects/project-datacenter.svg',
        title: 'Nikko Logistics Facility Overview',
        caption: '150,000 m² high-precision materials facility with Very Narrow Aisle (VNA) racking and 160 kN post loads.',
        phaseTag: '01 LOGISTICS OVERVIEW'
      },
      {
        url: '/images/projects/gallery/gallery-screed-pour.svg',
        title: 'Unbonded SFRC Pour',
        caption: 'Placement of HF-6535 collated crack-control fibers at 28 kg/m³ combined with dry-shake metallic surface hardener.',
        phaseTag: '02 PLACEMENT & HARDENER'
      },
      {
        url: '/images/projects/gallery/gallery-armored-joint.svg',
        title: 'Continuous Jointless Design',
        caption: 'Jointless layout eliminating saw-cut joints in forklift transit paths, preventing rack instability and mast rocking.',
        phaseTag: '03 JOINTLESS SLAB'
      },
      {
        url: '/images/projects/gallery/gallery-agv-traffic.svg',
        title: 'Superflat Profilograph Certification',
        caption: 'Full compliance with DIN 18202 Table 3 Line 4 (Superflat) under continuous high-lift turret truck operation.',
        phaseTag: '04 VNA OPERATIONS'
      }
    ],
    challenge: 'Heavy double-rack leg point loads (140 kN per post) in very narrow aisle (VNA) configurations where any joint displacement or curling risks racking instability.',
    solution: 'Designed an unbonded SFRC slab utilizing HOKI HF-6535 at 28 kg/m³ combined with dry-shake metallic surface hardener.',
    verification: 'Profilograph surveying confirmed compliance with DIN 18202 Table 3 Line 4 (Superflat classification for VNA logistics).',
    metrics: [
      { label: 'Joint Spalling Risk', value: 'Eliminated', isHighlight: true },
      { label: 'Labor Hours Saved', value: '4,500 Hrs', isHighlight: true },
      { label: 'Rack Leg Capacity', value: '160 kN/leg' }
    ],
    specifications: {
      fiberSeries: 'HF-6535 Series (L=35mm, D=0.55mm)',
      dosage: '28 kg/m³',
      concreteGrade: 'C35/45',
      jointSpacing: 'Continuous Jointless'
    },
    clientQuote: 'We achieved superflat tolerances effortlessly because the concrete placed faster without mesh obstructions under the laser screed head.',
    quoteAuthor: 'Kenji Takahashi, Technical Director, Nikko Materials',
    drawingsAvailable: true,
    droneVideoAvailable: true
  },
  {
    id: 'case-hamaco-concrete',
    slug: 'hamaco-concrete-terminal',
    code: 'HK-PRJ-HM05',
    title: 'Hamaco Concrete Vietnam',
    facilityType: 'Ready-Mix Concrete Hub & Heavy Hardstand',
    sector: 'parking',
    sectorLabel: 'Parking Structures & Hardstands',
    location: 'Can Tho Port Terminal, Mekong Delta, Vietnam',
    area: '120,000 m²',
    description: 'Heavy industrial apron and logistics hardstand accommodating continuous 45-tonne bulk cement tanker trucks, aggregate haulers, and raw material transshipment.',
    image: '/images/projects/project-port.svg',
    gallery: [
      {
        url: '/images/projects/project-port.svg',
        title: 'Hamaco Terminal Apron Overview',
        caption: '120,000 m² port apron engineered for continuous 45-tonne bulk cement tankers and aggregate tippers in soft delta soil.',
        phaseTag: '01 PORT TERMINAL'
      },
      {
        url: '/images/projects/gallery/gallery-port-apron.svg',
        title: '50-Tonne Axle Proof Testing',
        caption: 'Heavy proof axle load simulation verifying load distribution cones into engineered subgrade without rutting or shear pumping.',
        phaseTag: '02 PROOF LOAD TEST'
      },
      {
        url: '/images/projects/gallery/gallery-screed-pour.svg',
        title: 'Marine C30/37 Fiber Placement',
        caption: 'HOKI HF-8060 fibers dosed at 32 kg/m³ providing superior chloride resistance and crack bridging in high water table environment.',
        phaseTag: '03 MARINE CONCRETE'
      },
      {
        url: '/images/projects/gallery/gallery-astm-test.svg',
        title: 'Plate Load Subgrade Modulus',
        caption: 'Field plate load testing verifying subgrade modulus k > 85 MPa/m and zero settlement under 50-tonne proof rollers.',
        phaseTag: '04 MODULUS VERIFIED'
      }
    ],
    challenge: 'Soft delta subgrade with high water table subjected to extreme repetitive axle loads causing rutting, shear pumping, and joint failure in traditional paved aprons.',
    solution: 'Engineered a fiber-reinforced concrete composite pavement using HOKI HF-8060 fibers at 32 kg/m³ over engineered crushed stone base.',
    verification: 'Plate load testing demonstrated modulus of subgrade reaction k > 85 MPa/m with zero residual settlement under 50-tonne proof rollers.',
    metrics: [
      { label: 'Pavement Thickness', value: '-22%', isHighlight: true },
      { label: 'Rutting Resistance', value: '+300%', isHighlight: true },
      { label: 'Maintenance Cost', value: '-65%' }
    ],
    specifications: {
      fiberSeries: 'HF-8060 Series (L=60mm, D=0.75mm)',
      dosage: '32 kg/m³',
      concreteGrade: 'C30/37 Marine Mix',
      jointSpacing: '6m x 6m Controlled Joints'
    },
    clientQuote: 'The heavy aggregate trucks have not generated a single crack or spalled joint after two monsoon seasons of round-the-clock operations.',
    quoteAuthor: 'Tran Quang Sang, Production General Manager, Hamaco Ready-Mix',
    drawingsAvailable: true,
    droneVideoAvailable: false
  },
  {
    id: 'case-polytech-vietnam',
    slug: 'polytech-vietnam-precast',
    code: 'HK-PRJ-PT06',
    title: 'Polytech Vietnam',
    facilityType: 'Precision Polymer & Precast Element Hub',
    sector: 'precast',
    sectorLabel: 'Precast Concrete',
    location: 'Binh Duong Pro-Trade Industrial Park, Vietnam',
    area: '30,000 m²',
    description: 'Precast structural elements and precision manufacturing shop floors requiring crack-free surfaces and high resistance to chemical and oil penetration.',
    image: '/images/projects/project-metro.svg',
    gallery: [
      {
        url: '/images/projects/project-metro.svg',
        title: 'Polytech Precast Complex',
        caption: '30,000 m² precision precast element facility utilizing hybrid micro-fiber reinforcement for zero rebar cages.',
        phaseTag: '01 PRECAST HUB'
      },
      {
        url: '/images/projects/gallery/gallery-precast-elements.svg',
        title: 'Precision Mould Demoulding',
        caption: 'Demoulding micro-cracks reduced from 4.2% to 0.05%, enabling mould turnaround twice per 24-hour shift cycle.',
        phaseTag: '02 DEMOULD DEFECTS 0.05%'
      },
      {
        url: '/images/projects/gallery/gallery-astm-test.svg',
        title: 'Early-Age Toughness Verification',
        caption: 'Self-compacting C45/55 mix with 35 kg/m³ hybrid fibers providing early fracture resistance during stripping.',
        phaseTag: '03 FRACTURE TOUGHNESS'
      },
      {
        url: '/images/projects/gallery/gallery-armored-joint.svg',
        title: 'Monolithic Drainage & Cable Units',
        caption: 'Durable, impact-resistant precast units with flawless edge definition and total elimination of fragile rebar mesh.',
        phaseTag: '04 FINISHED ELEMENTS'
      }
    ],
    challenge: 'Complex geometric moulds and thin precast panels suffered from demoulding micro-cracks and labor-intensive rebar tying bottlenecks.',
    solution: 'Implemented HOKI HF-6535 and HF-10020 micro-fibers at 35 kg/m³ in self-compacting concrete (SCC), eliminating rebar cages entirely.',
    verification: 'Demoulding failure dropped from 4.2% to 0.05%. Accelerated cycle time allowed mould re-use twice per 24-hour shift.',
    metrics: [
      { label: 'Demoulding Defects', value: '0.05%', isHighlight: true },
      { label: 'Mould Turnaround', value: '2x Speed', isHighlight: true },
      { label: 'Steel Savings', value: '-35%' }
    ],
    specifications: {
      fiberSeries: 'HF-6535 / HF-10020 Hybrid',
      dosage: '35 kg/m³',
      concreteGrade: 'C45/55 Self-Compacting',
      jointSpacing: 'Monolithic Precast Elements'
    },
    clientQuote: 'Replacing fragile rebar mesh in our precast drainage and cable units cut our labor costs in half and produced flawless finishes.',
    quoteAuthor: 'Doan Minh Tam, Precast Plant Supervisor, Polytech',
    drawingsAvailable: true,
    droneVideoAvailable: true
  },
  {
    id: 'case-global-hantex',
    slug: 'global-hantex-plant',
    code: 'HK-PRJ-GH07',
    title: 'Global Hantex Vietnam',
    facilityType: 'High-Tech Textile Manufacturing Plant',
    sector: 'industrial',
    sectorLabel: 'Industrial Floors',
    location: 'Bao Loc Industrial Zone, Lam Dong, Vietnam',
    area: '5,000 m²',
    description: 'High-speed spinning and automated loom weaving facility demanding completely vibration-damped, dust-free industrial concrete slabs to maintain micro-alignment of textile machinery.',
    image: '/images/projects/project-coldstorage.svg',
    gallery: [
      {
        url: '/images/projects/project-coldstorage.svg',
        title: 'Global Hantex Textile Facility',
        caption: '5,000 m² high-speed spinning facility requiring 45% enhanced vibration damping to isolate 12,000 RPM loom harmonics.',
        phaseTag: '01 TEXTILE COMPLEX'
      },
      {
        url: '/images/projects/gallery/gallery-screed-pour.svg',
        title: 'Laser Screed Slab Pour',
        caption: 'Pour completed in only 6 days with HOKI HF-8060 fibers dosed at 25 kg/m³, eliminating joint deterioration.',
        phaseTag: '02 RAPID 6-DAY POUR'
      },
      {
        url: '/images/projects/gallery/gallery-astm-test.svg',
        title: 'Vibration Damping Accelerometer Tests',
        caption: 'Floor vibration velocity amplitude verified below 0.8 mm/s across all high-speed textile machinery footings.',
        phaseTag: '03 VIBRATION DAMPING'
      },
      {
        url: '/images/projects/gallery/gallery-agv-traffic.svg',
        title: 'Dust-Free Precision Operations',
        caption: 'Zero micro-cracking and zero dusting after 12 months of round-the-clock continuous production.',
        phaseTag: '04 ZERO DUSTING'
      }
    ],
    challenge: 'High-frequency spinning machinery (12,000 RPM) induced resonant harmonics that caused joint deterioration and fine dust generation on unreinforced slabs.',
    solution: 'Designed a high-toughness SFRC ground slab using HOKI HF-8060 fibers at 25 kg/m³ with epoxy surface coating.',
    verification: 'Vibration velocity amplitude remained under 0.8 mm/s across all loom footings. Zero hairline cracks after 12 months.',
    metrics: [
      { label: 'Vibration Damping', value: '+45%', isHighlight: true },
      { label: 'Installation Time', value: '6 Days', isHighlight: true },
      { label: 'Dust Generation', value: 'Zero' }
    ],
    specifications: {
      fiberSeries: 'HF-8060 Series (L=60mm, D=0.75mm)',
      dosage: '25 kg/m³',
      concreteGrade: 'C30/37',
      jointSpacing: '25m x 25m Bays'
    },
    clientQuote: 'Our precision looms operate with zero drift thanks to the monolithic rigidity and damping performance of HOKI reinforced slabs.',
    quoteAuthor: 'Zhang Chen, Engineering Director, Global Hantex',
    drawingsAvailable: true,
    droneVideoAvailable: false
  }
];

export const INITIAL_STRATEGIC_PARTNERS: StrategicPartner[] = [
  { id: 'epc-1', name: 'TODA CORPORATION', subtitle: 'Global General Contractor', role: 'Global General Contractor', origin: 'Japan / Global', logoUrl: '' },
  { id: 'epc-2', name: 'COTECCONS', subtitle: 'Leading Tier-1 General Contractor', role: 'Leading Tier-1 General Contractor', origin: 'Vietnam', logoUrl: '' },
  { id: 'epc-3', name: 'NEWTECONS', subtitle: 'General Contractor & Infrastructure', role: 'General Contractor & Infrastructure', origin: 'Vietnam', logoUrl: '' },
  { id: 'epc-4', name: 'RICONS', subtitle: 'Civil & Industrial Construction', role: 'Civil & Industrial Construction', origin: 'Vietnam', logoUrl: '' },
  { id: 'epc-5', name: 'HOP LUC', subtitle: 'Mega-Factory Specialist EPC', role: 'Mega-Factory Specialist EPC', origin: 'Vietnam', logoUrl: '' },
  { id: 'epc-6', name: 'CBC CIVIL & BUILDING', subtitle: 'Industrial Construction Specialist', role: 'Industrial Construction Specialist', origin: 'Vietnam', logoUrl: '' },
  { id: 'epc-7', name: 'BAN THACH', subtitle: 'Foundation & Geotechnical Engineering', role: 'Foundation & Geotechnical Engineering', origin: 'Vietnam', logoUrl: '' },
  { id: 'epc-8', name: 'TAN PHAT LONG', subtitle: 'Engineering & Construction Corporation', role: 'Engineering & Construction Corporation', origin: 'Vietnam', logoUrl: '' },
  { id: 'epc-9', name: 'HONG HA BETON', subtitle: 'Ready-Mix Concrete & Precast Producer', role: 'Ready-Mix Concrete & Precast Producer', origin: 'Vietnam', logoUrl: '' },
  { id: 'epc-10', name: 'CHI THANH CONSTRUCTION', subtitle: 'Industrial Flooring & Laser Screed Specialist', role: 'Industrial Flooring & Laser Screed Specialist', origin: 'Vietnam', logoUrl: '' }
];

export const STRATEGIC_PARTNERS = INITIAL_STRATEGIC_PARTNERS;

export const INITIAL_EPC_CONFIG: EpcSectionConfig = {
  title: 'Trusted by Leading EPC Contractors & Tier-1 Developers',
  subtitle: 'Partnering with top general contractors across heavy industrial flooring, logistics facilities, and precast infrastructure.'
};

export const INITIAL_ABOUT_INFO: AboutPageInfo = {
  title: 'About HOKI Structural Fiber',
  tagline: 'Strength, Reliability, Solutions — Built to Perform.',
  description: 'Founded with a singular civil engineering thesis, HOKI manufactures high-performance cold-drawn hooked and collated 3D steel fibers designed to displace traditional welded wire mesh and rebar cages. We enable structural engineers to accelerate construction schedules by 40%, eliminate slab curling and joint spalling, and achieve auditable carbon abatement.',
  missionLabel: 'Mission for Sustainable Concrete Flooring',
  missionQuote: "Sustainability isn't a trend, it's how we build a better tomorrow.",
  leadershipHeading: 'Leadership & Department Heads',
  leadershipSubheading: 'Guided by veteran structural engineers, metallurgical innovators, and global supply chain directors.',
  advisoryHeading: 'Global Structural Advisory Board',
  advisorySubheading: 'Scientific Governance'
};

export const LEADERSHIP_HEADS: LeadershipHead[] = [
  {
    id: 'lead-1',
    name: 'Dr. Henry Tran',
    department: 'Executive Board & Managing Directorate',
    title: 'Managing Director & Chief Executive Officer',
    credentials: 'PhD in Civil & Structural Engineering (Univ. of Tokyo)',
    focus: 'Strategic growth, international expansion, and scaling green metallurgy for global infrastructure.',
    avatar: '/images/team/avatar-minh.svg'
  },
  {
    id: 'lead-2',
    name: 'Dr. Henrik Lindqvist',
    department: 'Structural Engineering & R&D',
    title: 'Head of Structural Engineering & Advanced Research',
    credentials: 'PhD, FICE, Member of ACI 544 & fib Task Group 4.1',
    focus: 'Non-linear fracture mechanics, TR34 yield-line algorithms, and low-carbon cementitious matrix optimization.',
    avatar: '/images/team/avatar-alan.svg'
  },
  {
    id: 'lead-3',
    name: 'Kenji Takahashi',
    department: 'Manufacturing & Quality Assurance',
    title: 'Head of Manufacturing & Quality Assurance',
    credentials: 'BSc Metallurgical Engineering (Kyoto Institute of Technology)',
    focus: 'Alpha Hub automated cold-drawing lines, inline optical inspection (AOI), and ISO 9001:2015 process compliance.',
    avatar: '/images/team/avatar-kenji.svg'
  },
  {
    id: 'lead-4',
    name: 'Elena Rostova',
    department: 'Global Supply Chain & Logistics',
    title: 'Head of Global Supply Chain & Logistics',
    credentials: 'MSCM, APICS Certified Supply Chain Professional',
    focus: 'International export containerization, raw rod procurement hedging, and fast regional fulfillment.',
    avatar: '/images/team/avatar-elena.svg'
  },
  {
    id: 'lead-5',
    name: 'Marcus Vance',
    department: 'International Business & Commercial',
    title: 'Head of International Commercial Operations',
    credentials: 'MBA, BSc Industrial Engineering (Melbourne Univ.)',
    focus: 'Major EPC contractor alliances, regional distribution hubs, and client engineering partnerships across APAC & EMEA.',
    avatar: '/images/team/avatar-marcus.svg'
  }
];

export const ADVISORY_BOARD: AdvisoryMember[] = [
  {
    id: 'adv-1',
    name: 'Dr. Alan Turing',
    role: 'Chief Technical Advisory Lead',
    specialization: 'Structural Dynamics & Composite Fracture Mechanics',
    bio: 'Former Chair of Structural Dynamics at MIT and active member of ACI 544 Committee on Fiber Reinforced Concrete. Leads HOKI algorithmic fracture modeling.',
    avatar: '/images/team/avatar-alan.svg',
    actionText: 'View Publications'
  },
  {
    id: 'adv-2',
    name: 'Sarah Jenkins',
    role: 'Sustainability & ESG Lead',
    specialization: 'Life Cycle Assessment (LCA) & Carbon Abatement',
    bio: 'Author of "The Green Concrete Paradigm", lead technical auditor for international Environmental Product Declarations (EPD) and World GBC climate initiatives.',
    avatar: '/images/team/avatar-sarah.svg',
    actionText: 'View EPD Framework'
  },
  {
    id: 'adv-3',
    name: 'Prof. Kenji Sato',
    role: 'Materials Science Specialist',
    specialization: 'High-Tensile Cold-Drawn Alloys & ITZ Microstructure',
    bio: 'Pioneered atomic-force microscopy analysis of the Interfacial Transition Zone in steel-cement composites. Holds 14 patents in collated fiber geometries.',
    avatar: '/images/team/avatar-kenji.svg',
    actionText: 'View Research'
  }
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'art-plastic-shrinkage',
    title: 'Plastic Shrinkage & Structural Crack Control Mechanics in Industrial Concrete',
    subtitle: 'Micro-mechanical bridging analysis comparing 2D welded wire fabric with 3D hooked steel fibers during the critical initial 4 to 24-hour hydration window.',
    category: 'CRACK CONTROL MECHANICS',
    categorySlug: 'crack-control',
    date: 'Oct 28, 2024',
    readTime: '7 MIN READ',
    author: 'Dr. Henrik Lindqvist, PhD, FICE',
    standards: 'ASTM C1579 / EN 14889-1',
    image: '/images/applications/app-industrial-flooring.svg',
    isFlagship: true,
    contentSnippet: 'Conventional 2D welded wire fabric settles during early-age plastic shrinkage, failing to restrain micro-cracking within the upper 25mm of the slab. Cold-drawn 3D steel fibers provide millions of isotropic mechanical anchors per cubic meter, bridging micro-cracks before they coalesce into macroscopic fractures.',
    fullContent: [
      '1. Early-Age Hydration Stress: Within the first 2 to 6 hours after concrete placement, rapid moisture evaporation from the exposed surface induces plastic capillary pressures exceeding the tensile capacity of unhydrated cement paste. If tensile strain exceeds 0.01%, plastic shrinkage cracks inevitably form.',
      '2. The Inherent Flaw of Welded Wire Mesh: Traditional welded wire mesh inevitably settles to the lower third of the slab or gets stepped on by placing crews. Even when propped, a 150mm x 150mm wire grid has zero presence in the vast majority of the cement paste volume between wires.',
      '3. High Fiber Count Spatial Interception: Dosing 25–30 kg/m³ of HOKI HF-8060 or HF-6535 distributes over 100,000 to 300,000 individual hooked fibers per cubic meter. The mean distance between adjacent fibers is less than 12 mm. Every microscopic crack encounters a mechanical hook within fractions of a millimeter.',
      '4. Measured Crack Width Reduction: ASTM C1579 test panels reinforced with HOKI fibers exhibit greater than 90% crack reduction ratio (CRR) compared to unreinforced plain concrete, keeping crack widths strictly below 0.10 mm and preserving long-term durability.'
    ]
  },
  {
    id: 'art-jointless-slabs',
    title: 'Jointless Slab Construction & Saw-Cut Joint Elimination with TR34 4th Edition',
    subtitle: 'How cold-drawn hooked steel fibers allow mega-distribution centers to pour 50m x 50m seamless bays without saw-cut joints.',
    category: 'FLOOR DESIGN & JOINTS',
    categorySlug: 'jointless',
    date: 'Oct 15, 2024',
    readTime: '9 MIN READ',
    author: 'Marcus Vance, Senior Structural Engineer',
    standards: 'TR34 4th Edition / ACI 360R',
    image: '/images/applications/app-logistics.svg',
    contentSnippet: 'Saw-cut joints account for over 85% of ongoing warehouse floor maintenance expenses due to forklift tire impact. Utilizing TR34 plastic limit analysis, HOKI steel fibers provide high residual flexural toughness, enabling continuous jointless slab construction with armored expansion joints.',
    fullContent: [
      '1. The Cost of Saw-Cut Contraction Joints: In a standard 50,000 m² warehouse, traditional construction requires over 18,000 linear meters of saw-cut joints. Under constant small-wheel reach truck traffic, joint edges spall, destroying polyurethane wheels and creating tripping hazards.',
      '2. Yield-Line Analysis in TR34: The 4th Edition of TR34 recognizes the post-cracking residual strength of steel fiber concrete (fR1, fR2, fR3, fR4 measured under EN 14651). By redistributing negative and positive bending moments across a continuous plate, the slab behaves as an energy-dissipating ductile membrane.',
      '3. Jointless Armored Bay Detailing: By eliminating saw cuts every 6 meters and replacing them with prefabricated armored steel joints spaced 40 to 50 meters apart, curling is restrained and wheels glide seamlessly across bay boundaries without impact.',
      '4. Economic Payback: Industrial facility owners report up to 75% reduction in annual floor maintenance and zero forklift downtime over a 15-year operational lifecycle.'
    ]
  },
  {
    id: 'art-field-dosing-guide',
    title: 'Field Dosing Guidelines for Ready-Mix Concrete Trucks & Automated Dispensers',
    subtitle: 'Practical protocol for on-site and batching plant dosing of collated steel fibers without clumping or balling.',
    category: 'CONSTRUCTION & EXECUTION',
    categorySlug: 'field-dosing',
    date: 'Sep 30, 2024',
    readTime: '6 MIN READ',
    author: 'Kenji Takahashi, Production Lead',
    standards: 'EN 14889-1 / ACI 544.3R',
    image: '/images/applications/app-port-terminal.svg',
    contentSnippet: 'Ensuring homogeneous fiber dispersion without balling is essential for peak structural performance. A step-by-step field operational guide for truck mixer addition, high-speed conveyor feeding, and slump retention.',
    fullContent: [
      '1. Collated Packaging Technology: HOKI fibers are collated into compact clips using a specialized water-soluble adhesive. During dry transport, fibers remain in tight bundles that cannot tangle or interlock.',
      '2. Dosing Order & Mix Design: Fibers can be added directly onto the aggregate conveyor belt at the batching plant, or dosed into the ready-mix truck drum on site. When dosing into a truck, the drum should rotate at maximum mixing speed (12–16 RPM).',
      '3. Water-Soluble Dissolution Kinetics: As the collated clips mix with concrete water, the bio-friendly glue dissolves within 90 seconds, releasing individual fibers uniformly throughout the cement paste.',
      '4. Quality Verification via Wash-Out Test: Site engineers perform standard wash-out tests (taking 10-liter samples from the first, middle, and last third of the discharge) to verify that fiber concentration matches design specifications within ±3%.'
    ]
  },
  {
    id: 'art-carbon-abatement-sfrc',
    title: 'Comparative Life Cycle Assessment: Embodied Carbon Abatement with Steel Fiber',
    subtitle: 'ISO 14040/14044 verified carbon metrics demonstrating a 30% to 45% reduction in Global Warming Potential vs traditional welded mesh.',
    category: 'SUSTAINABILITY & LCA',
    categorySlug: 'sustainability',
    date: 'Sep 14, 2024',
    readTime: '8 MIN READ',
    author: 'Sarah Jenkins, LCA Director',
    standards: 'ISO 14040 / EN 15804+A2',
    image: '/images/applications/app-tunnel-precast.svg',
    contentSnippet: 'Replacing 12–18 kg/m² of welded wire mesh and rebar cages with 25–30 kg/m³ of high-efficiency steel fiber slashes raw steel mass by 35%, reduces concrete slab thickness by 15–25%, and cuts total project GWP significantly.',
    fullContent: [
      '1. Steel Efficiency Ratio: High-tensile cold-drawn steel fibers exhibit tensile capacities between 1,200 and 1,500 MPa—nearly triple standard rebar yield strength (400–500 MPa). This allows a much smaller mass of steel to provide superior mechanical resistance.',
      '2. Slab Section Optimization: In ground-supported slabs, the post-cracking moment redistribution allows structural engineers to reduce slab thickness from 220mm to 180mm without reducing point load capacity.',
      '3. Scope 3 Carbon Reductions: Every 1,000 m² of HOKI reinforced slab eliminates approximately 12 tonnes of steel and 40 m³ of concrete, avoiding roughly 28 to 35 tCO₂e.',
      '4. Synergies with LC3 and GGBS Cements: Combining HOKI steel fibers with low-carbon limestone calcined clay (LC3) or slag cements delivers net embodied carbon reductions exceeding 50% relative to conventional construction.'
    ]
  }
];

export const INTERNATIONAL_STANDARDS = [
  {
    code: 'ACI 544.4R',
    title: 'Design Considerations for Steel Fiber-Reinforced Concrete',
    issuingBody: 'American Concrete Institute (ACI)',
    year: '2023 Edition',
    description: 'Comprehensive structural design code for ground-supported slabs, elevated slabs, and underground structures incorporating steel fibers.',
    downloadFile: 'ACI_544_4R_Design_Guide.pdf'
  },
  {
    code: 'TR34 4th Edition',
    title: 'Concrete Industrial Ground Floors: A Guide to Design and Construction',
    issuingBody: 'The Concrete Society (UK)',
    year: '4th Edition Revised',
    description: 'The global benchmark for industrial floor design, specifying plastic yield-line analysis, jointless slabs, and residual flexural parameters.',
    downloadFile: 'TR34_4th_Edition_Summary.pdf'
  },
  {
    code: 'EN 14889-1 System 1',
    title: 'Fibres for Concrete — Part 1: Steel Fibres — Definitions, Specifications and Conformity',
    issuingBody: 'European Committee for Standardization (CEN)',
    year: 'EN Harmonized',
    description: 'Mandatory European standard defining System 1 Attestation of Conformity for structural steel fibers used in load-bearing concrete.',
    downloadFile: 'EN_14889_1_System1_Certificate.pdf'
  },
  {
    code: 'fib Model Code 2020',
    title: 'Model Code for Concrete Structures: Fiber Reinforced Concrete Provisions',
    issuingBody: 'International Federation for Structural Concrete (fib)',
    year: '2020 / 2024',
    description: 'Constitutive stress-crack opening laws and ductility classification for non-linear finite element structural engineering.',
    downloadFile: 'fib_Model_Code_FRC_Provisions.pdf'
  },
  {
    code: 'ASTM A820 / A820M',
    title: 'Standard Specification for Steel Fibers for Fiber-Reinforced Concrete (Type I Cold-Drawn Wire)',
    issuingBody: 'ASTM International',
    year: 'ASTM A820-22',
    description: 'Defines chemical composition, tensile strength limits, aspect ratio tolerances, and bending ductility for cold-drawn wire fibers.',
    downloadFile: 'ASTM_A820_TypeI_Specification.pdf'
  }
];

export const GLOBAL_OFFICES: GlobalOffice[] = [
  {
    region: 'Asia Pacific (Global HQ & Alpha Hub)',
    location: 'Ho Chi Minh City & Binh Duong, Vietnam',
    function: 'Global Manufacturing Facility, R&D Labs, APAC Logistics & Regional Engineering Hub',
    contact: '+84 28 3822 9900 • apac@hoki-fiber.com',
    flag: '🇻🇳'
  },
  {
    region: 'Greater China & East Asia',
    location: 'Chengdu & Shanghai, China',
    function: 'Mega-Plant Automotive & Electronics Engineering Desk, Supply Chain Coordination',
    contact: '+86 28 8555 4321 • china@hoki-fiber.com',
    flag: '🇨🇳'
  },
  {
    region: 'Europe & UK',
    location: 'Frankfurt am Main, Germany',
    function: 'Technical Compliance Office, CE Certification, DAfStb & TR34 Engineering Services',
    contact: '+49 69 9876 5400 • europe@hoki-fiber.com',
    flag: '🇩🇪'
  },
  {
    region: 'North America',
    location: 'Chicago, Illinois & Houston, Texas, USA',
    function: 'ASTM Compliance Desk, North American Distribution Hub & Commercial Operations',
    contact: '+1 312 555 0199 • americas@hoki-fiber.com',
    flag: '🇺🇸'
  },
  {
    region: 'Middle East & Gulf',
    location: 'Dubai Logistics City, UAE',
    function: 'Heavy Infrastructure, Airport Aprons & Port Intermodal Engineering Support',
    contact: '+971 4 888 1234 • middleeast@hoki-fiber.com',
    flag: '🇦🇪'
  }
];

export const EVOLUTION_TIMELINE: TimelineMilestone[] = [
  {
    year: '2021',
    title: 'Origin & Inception',
    description: 'Founding of HOKI with a singular engineering thesis: replacing labor-heavy, error-prone 2D welded rebar with cold-drawn isotropic 3D steel fiber concrete reinforcement.',
    isHighlight: false
  },
  {
    year: '2023',
    title: '1,000,000 m² Delivered',
    description: 'Surpassed 1,000,000 square meters of high-tolerance jointless industrial floors across mega automotive and tire manufacturing plants throughout SE Asia.',
    isHighlight: false
  },
  {
    year: '2024',
    title: 'Alpha Hub Automation',
    description: 'Commissioned the Alpha Hub high-speed automated drawing and collating facility, introducing automated optical inspection (AOI) with sub-0.01mm dimensional precision.',
    isHighlight: true
  },
  {
    year: '2025',
    title: 'Green Metallurgy & Global EPD',
    description: 'Achieved ISO 14040/14044 certified Environmental Product Declarations (EPD) and launched recycled circular feedstock options for net-zero infrastructure projects.',
    isHighlight: false
  },
  {
    year: '2026+',
    title: 'Sustainable Global Horizon',
    description: 'Expanding automated dispensing robotics, real-time QA digital twins, and direct engineering hubs across North America, Europe, and the Middle East.',
    isHighlight: true
  }
];
