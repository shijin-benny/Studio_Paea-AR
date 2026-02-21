import { notFound } from 'next/navigation';
import WorkGallery from '@/components/WorkGallery';
import { getProjectsByCategory } from '@/lib/projects';
import type { ProjectCategory } from '@/lib/projects';

const CATEGORIES: ProjectCategory[] = ['architecture', 'interiors', 'landscape'];

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function WorkCategoryPage({ params }: PageProps) {
  const { category } = await params;
  if (!CATEGORIES.includes(category as ProjectCategory)) notFound();
  const projects = getProjectsByCategory(category as ProjectCategory);

  if (!projects.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-neutral-500 font-light tracking-wide">No projects in this category.</p>
      </div>
    );
  }

  return <WorkGallery projects={projects} />;
}
