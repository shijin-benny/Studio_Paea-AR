import WorkGallery from '@/components/WorkGallery';
import { getProjectsByCategory } from '@/lib/projects';

export default function WorkPage() {
  const projects = getProjectsByCategory();
  return <WorkGallery projects={projects} />;
}
