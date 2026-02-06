import { Metadata } from 'next';
import { Project } from './projects';

const siteConfig = {
  name: 'Studio PAEA',
  description: 'Award-winning architecture and design studio specializing in residential, commercial, and landscape architecture.',
  url: 'https://studiopaea.com',
  ogImage: '/images/og-image.jpg',
};

export function generateSiteMetadata({
  title,
  description,
  path = '',
  image,
  type = 'website',
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const fullDescription = description || siteConfig.description;
  const fullUrl = `${siteConfig.url}${path}`;
  const fullImage = image || `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title: fullTitle,
    description: fullDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type: type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateProjectMetadata(project: Project): Metadata {
  return generateSiteMetadata({
    title: project.title,
    description: project.description,
    path: `/work/${project.category}/${project.id}`,
    image: project.images[0],
    type: 'article',
  });
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    description: siteConfig.description,
    sameAs: [
      // Add social media links here
    ],
  };
}

export function generateProjectSchema(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    dateCreated: `${project.year}`,
    creator: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    locationCreated: {
      '@type': 'Place',
      name: project.location,
    },
    image: project.images.map(img => `${siteConfig.url}${img}`),
  };
}
