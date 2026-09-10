import React, { useEffect } from 'react';
import { PageRoute, FiberProduct, ProjectCaseStudy, JournalArticle } from '../types';

interface SeoHeadProps {
  currentRoute: PageRoute;
  selectedDossier?: FiberProduct | null;
  selectedCase?: ProjectCaseStudy | null;
  selectedArticle?: JournalArticle | null;
}

interface RouteMetaConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  ogType: string;
  ogImage?: string;
  breadcrumbName: string;
}

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-7ep6olpcdrgygdo5vtcz6p-39232348117.asia-southeast1.run.app';

const ROUTE_META_MAP: Record<PageRoute, RouteMetaConfig> = {
  home: {
    title: 'HOKI Green Engineering Platform — Structural Steel Fiber',
    description: 'HOKI Structural Fiber: High-performance cold-drawn hooked-end and collated 3D steel fiber concrete reinforcement systems for sustainable civil and commercial infrastructure.',
    keywords: 'HOKI steel fiber, structural fiber, steel fiber reinforced concrete, SFRC, hooked-end steel fiber, collated 3D steel fibers, TR34 4th edition, ACI 544, fib Model Code 2020, EN 14889-1, ASTM A820, industrial concrete flooring, jointless slab, shotcrete tunnel lining, low carbon concrete, concrete crack control',
    canonicalPath: '/',
    ogType: 'website',
    breadcrumbName: 'Home',
  },
  products: {
    title: 'Structural Steel Fiber Products & TR34 Dosage Engine | HOKI Structural Fiber',
    description: 'Explore HOKI HE-Series cold-drawn hooked-end steel fibers (HF-8060, HF-6535, HF-10020). Interactive TR34 slab thickness and dynamic wheel load dosage estimator for industrial slabs and tunnel precast.',
    keywords: 'HF-8060 steel fiber, HF-6535 fiber, HF-10020 ultra-high tensile, TR34 dosage calculator, fiber aspect ratio, fiber count per kg, hooked-end steel fiber specifications, steel fiber technical data sheet',
    canonicalPath: '/products',
    ogType: 'product.group',
    breadcrumbName: 'Products & Engineering Specs',
  },
  projects: {
    title: 'Civil & Industrial Engineering Case Studies | HOKI Structural Fiber',
    description: 'Over 1,000,000 m² of verified SFRC installations. Review project dossiers including Geely Automobile (250,000 m²), Sailun Tire (200,000 m²), and Metro Line precast tunnel segments.',
    keywords: 'SFRC case studies, industrial flooring projects, jointless warehouse floor, port hardstand steel fiber, tunnel segment precast, ASTM C1609 load-deflection, laser screed floor pour',
    canonicalPath: '/projects',
    ogType: 'article',
    breadcrumbName: 'Project Case Studies',
  },
  blog: {
    title: 'SFRC Knowledge Hub & Technical Monographs | HOKI Structural Fiber',
    description: 'Peer-reviewed engineering whitepapers, TR34 4th Edition design guides, ACI 544.4R flexural toughness protocols, and field batch truck wash-out testing procedures.',
    keywords: 'TR34 4th edition calculation, ACI 544.4R guide, fib Model Code 2020, concrete plastic shrinkage, batch plant fiber dosing, residual flexural strength f_R1k f_R3k, EN 14651 beam test',
    canonicalPath: '/knowledge',
    ogType: 'website',
    breadcrumbName: 'Knowledge & Standards',
  },
  knowledge: {
    title: 'Knowledge & Sustainable Engineering Hub | HOKI Structural Fiber',
    description: 'Empirical decarbonization, international design standards (ACI 544, TR34, EN 14889, fib Model Code 2020), interactive LCA carbon calculator, and peer-reviewed technical monographs.',
    keywords: 'TR34 4th edition calculation, ACI 544.4R guide, fib Model Code 2020, concrete plastic shrinkage, batch plant fiber dosing, residual flexural strength f_R1k f_R3k, EN 14651 beam test, LCA embodied carbon',
    canonicalPath: '/knowledge',
    ogType: 'website',
    breadcrumbName: 'Knowledge & Sustainability',
  },
  about: {
    title: 'About HOKI Structural Fiber — Alpha Hub Manufacturing & R&D',
    description: 'Inside HOKI Alpha Hub: High-speed automated cold-drawing lines, 0.01 mm optical machine vision inspection, and international advisory leadership pioneering sustainable concrete solutions.',
    keywords: 'HOKI manufacturing, cold-drawn wire drawing, optical fiber inspection, steel fiber factory, ISO 9001 2015, ISO 14001, structural materials science, fiber reinforcement innovation',
    canonicalPath: '/about-us',
    ogType: 'profile',
    breadcrumbName: 'About HOKI',
  },
  esg: {
    title: 'Net Zero Concrete & EPD Embodied Carbon Calculator | HOKI Structural Fiber',
    description: 'Quantify embodied carbon savings up to 40% with HOKI 3D steel fibers. Download ISO 14040 Life Cycle Assessment (LCA) data and Environmental Product Declarations (EPD).',
    keywords: 'low carbon concrete, EPD steel fiber, embodied carbon reduction, scope 3 emissions construction, green star concrete, LEED concrete points, LC3 cement fiber reinforcement',
    canonicalPath: '/knowledge',
    ogType: 'website',
    breadcrumbName: 'Sustainability & ESG',
  },
  contact: {
    title: 'Structural Engineering Consultation & Commercial RFQ | HOKI Structural Fiber',
    description: 'Connect directly with HOKI structural consulting engineers for TR34 slab yield-line analysis, trial batch sample kits, and instant project material scope calculations.',
    keywords: 'steel fiber RFQ, TR34 consultation, structural engineer support, fiber sample kit, concrete slab design calculation, HOKI regional offices, batch serial verification',
    canonicalPath: '/contact',
    ogType: 'website',
    breadcrumbName: 'Contact & Engineering Consultation',
  },
  admin: {
    title: 'HOKI Engineering Administration Portal | Content & Media Management',
    description: 'Internal HOKI technical administration console for managing technical monographs, project case dossiers, and engineering media library.',
    keywords: 'HOKI admin portal, content management system, engineering dossier manager',
    canonicalPath: '/admin',
    ogType: 'website',
    breadcrumbName: 'Engineering Admin',
  },
  'project-detail': {
    title: 'Project Engineering Case Study | HOKI Structural Steel Fiber',
    description: 'Detailed civil engineering case study and QA telemetry for HOKI 3D steel fiber reinforced concrete installations.',
    keywords: 'SFRC case study, TR34 industrial floor, steel fiber dosage, ASTM C1609 testing',
    canonicalPath: '/projects',
    ogType: 'article',
    breadcrumbName: 'Project Detail',
  },
};

export const SeoHead: React.FC<SeoHeadProps> = ({
  currentRoute,
  selectedDossier,
  selectedCase,
  selectedArticle,
}) => {
  useEffect(() => {
    // 1. Determine active metadata based on route or open modal
    let meta = ROUTE_META_MAP[currentRoute] || ROUTE_META_MAP.home;
    let canonicalUrl = `${BASE_URL}${meta.canonicalPath}`;

    if (selectedDossier) {
      meta = {
        ...meta,
        title: `${selectedDossier.name} (${selectedDossier.series}) Technical Dossier | HOKI Structural Fiber`,
        description: `Certified engineering specifications for ${selectedDossier.name}. Tensile: ${selectedDossier.tensileStrength}, Aspect Ratio: ${selectedDossier.aspectRatio}, Geometry: ${selectedDossier.geometry}. Complies with ${selectedDossier.standards.join(', ')}.`,
        keywords: `${selectedDossier.name}, ${selectedDossier.series}, ${selectedDossier.tensileStrength}, TR34 steel fiber, EN 14889-1 System 1, ASTM A820`,
        canonicalPath: `/products?id=${selectedDossier.id}`,
        ogType: 'product',
      };
      canonicalUrl = `${BASE_URL}/products?id=${selectedDossier.id}`;
    } else if (selectedCase) {
      meta = {
        ...meta,
        title: `${selectedCase.title} Case Study (${selectedCase.area}) | HOKI Structural Fiber`,
        description: `Engineering dossier: ${selectedCase.title} in ${selectedCase.location}. ${selectedCase.description} Dosed at ${selectedCase.specifications.dosage} using ${selectedCase.specifications.fiberSeries}.`,
        keywords: `${selectedCase.title}, ${selectedCase.location}, SFRC industrial floor, ${selectedCase.specifications.dosage}, ${selectedCase.specifications.concreteGrade}`,
        canonicalPath: `/projects?id=${selectedCase.id}`,
        ogType: 'article',
      };
      canonicalUrl = `${BASE_URL}/projects?id=${selectedCase.id}`;
    } else if (selectedArticle) {
      meta = {
        ...meta,
        title: `${selectedArticle.title} | HOKI Technical Research`,
        description: selectedArticle.subtitle || selectedArticle.contentSnippet,
        keywords: `${selectedArticle.category}, ${selectedArticle.standards}, TR34, SFRC technical monograph, ${selectedArticle.author}`,
        canonicalPath: `/knowledge?id=${selectedArticle.id}`,
        ogType: 'article',
      };
      canonicalUrl = `${BASE_URL}/knowledge?id=${selectedArticle.id}`;
    }

    // 2. Update Document Title
    document.title = meta.title;

    // Helper to update or create meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update or create link tag
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 3. Inject standard SEO Header meta tags
    setMetaTag('name', 'description', meta.description);
    setMetaTag('name', 'keywords', meta.keywords);
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'googlebot', 'index, follow');
    setMetaTag('name', 'author', 'HOKI Structural Fiber Research Directorate');
    setMetaTag('name', 'publisher', 'HOKI Structural Fiber');
    setMetaTag('name', 'copyright', 'HOKI Structural Fiber');
    setMetaTag('name', 'application-name', 'HOKI Green Engineering Platform');
    setMetaTag('name', 'theme-color', '#00356a');
    setMetaTag('name', 'format-detection', 'telephone=no');

    // 4. OpenGraph SEO Headers
    setMetaTag('property', 'og:title', meta.title);
    setMetaTag('property', 'og:description', meta.description);
    setMetaTag('property', 'og:type', meta.ogType);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:site_name', 'HOKI Structural Fiber');
    setMetaTag('property', 'og:locale', 'en_US');
    setMetaTag('property', 'og:image', `${BASE_URL}/og-preview.png`);
    setMetaTag('property', 'og:image:alt', 'HOKI Structural Fiber — Engineering the Future of Concrete');
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');

    // 5. Twitter Card SEO Headers
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@HokiFiber');
    setMetaTag('name', 'twitter:creator', '@HokiFiber');
    setMetaTag('name', 'twitter:title', meta.title);
    setMetaTag('name', 'twitter:description', meta.description);
    setMetaTag('name', 'twitter:image', `${BASE_URL}/og-preview.png`);

    // 6. Canonical Link
    setLinkTag('canonical', canonicalUrl);

    // 7. Inject Structured Data (Schema.org JSON-LD)
    const existingSchema = document.getElementById('hoki-dynamic-schema');
    if (existingSchema) {
      existingSchema.remove();
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#organization`,
          'name': 'HOKI Structural Fiber',
          'alternateName': 'HOKI',
          'url': BASE_URL,
          'logo': `${BASE_URL}/logo.svg`,
          'slogan': 'Engineering the Future of Concrete',
          'description': 'Advanced structural materials enterprise manufacturing cold-drawn hooked-end and collated 3D steel fibers for concrete reinforcement.',
          'contactPoint': {
            '@type': 'ContactPoint',
            'telephone': '+84-28-3829-1000',
            'contactType': 'Technical Sales and Engineering Support',
            'areaServed': ['VN', 'US', 'DE', 'AE', 'APAC', 'EMEA'],
            'availableLanguage': ['English', 'Vietnamese', 'German']
          },
          'hasCertification': [
            {
              '@type': 'Certification',
              'name': 'ISO 9001:2015 Quality Management System'
            },
            {
              '@type': 'Certification',
              'name': 'EN 14889-1:2006 System 1 CE Marking'
            },
            {
              '@type': 'Certification',
              'name': 'ISO 14040 Life Cycle Assessment & EPD'
            }
          ]
        },
        {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          'url': BASE_URL,
          'name': 'HOKI Structural Fiber Platform',
          'description': 'Engineering platform for cold-drawn hooked-end steel fiber concrete reinforcement calculations and specs.',
          'publisher': {
            '@id': `${BASE_URL}/#organization`
          }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': BASE_URL
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': meta.breadcrumbName,
              'item': canonicalUrl
            }
          ]
        },
        ...(selectedDossier ? [{
          '@type': 'Product',
          '@id': `${canonicalUrl}#product`,
          'name': selectedDossier.name,
          'model': selectedDossier.series,
          'description': selectedDossier.description,
          'category': 'Construction Material > Concrete Reinforcement > Steel Fiber',
          'brand': {
            '@type': 'Brand',
            'name': 'HOKI Structural Fiber'
          },
          'additionalProperty': [
            {
              '@type': 'PropertyValue',
              'name': 'Tensile Strength',
              'value': selectedDossier.tensileStrength
            },
            {
              '@type': 'PropertyValue',
              'name': 'Aspect Ratio (L/d)',
              'value': selectedDossier.aspectRatio
            },
            {
              '@type': 'PropertyValue',
              'name': 'Fiber Count',
              'value': selectedDossier.fiberCountPerKg
            },
            {
              '@type': 'PropertyValue',
              'name': 'Geometry',
              'value': selectedDossier.geometry
            }
          ]
        }] : []),
        ...(selectedArticle ? [{
          '@type': 'TechArticle',
          '@id': `${canonicalUrl}#article`,
          'headline': selectedArticle.title,
          'description': selectedArticle.subtitle || selectedArticle.contentSnippet,
          'author': {
            '@type': 'Person',
            'name': selectedArticle.author
          },
          'publisher': {
            '@id': `${BASE_URL}/#organization`
          },
          'datePublished': selectedArticle.date,
          'proficiencyLevel': 'Expert'
        }] : [])
      ]
    };

    const scriptElement = document.createElement('script');
    scriptElement.id = 'hoki-dynamic-schema';
    scriptElement.type = 'application/ld+json';
    scriptElement.text = JSON.stringify(structuredData);
    document.head.appendChild(scriptElement);

  }, [currentRoute, selectedDossier, selectedCase, selectedArticle]);

  // Render an accessible, semantic microdata navigation header in code for crawlers and screen readers
  const meta = ROUTE_META_MAP[currentRoute] || ROUTE_META_MAP.home;

  return (
    <nav
      id="seo-semantic-header"
      aria-label="Breadcrumb and SEO Hierarchy"
      className="sr-only"
    >
      <ol itemScope itemType="https://schema.org/BreadcrumbList">
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <a itemProp="item" href="/">
            <span itemProp="name">HOKI Structural Fiber</span>
          </a>
          <meta itemProp="position" content="1" />
        </li>
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <a itemProp="item" href={meta.canonicalPath}>
            <span itemProp="name">{meta.breadcrumbName}</span>
          </a>
          <meta itemProp="position" content="2" />
        </li>
      </ol>
      <header>
        <h1>{meta.title}</h1>
        <p>{meta.description}</p>
      </header>
    </nav>
  );
};
