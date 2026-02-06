export type ProjectCategory = 'architecture' | 'interiors' | 'landscape';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  images: string[];
  location: string;
  year: number;
  description: string;
}

// AT = Architecture, IN = Interiors, LN = Landscape (from public/images folders)
export const projects: Project[] = [
  // Architecture (AT)
  { id: 'at-1', title: 'Project AR 02', category: 'architecture', images: ['/images/AT/AR 02.png'], location: '', year: 2024, description: '' },
  { id: 'at-2', title: 'Project AR 03', category: 'architecture', images: ['/images/AT/AR 03.png'], location: '', year: 2024, description: '' },
  { id: 'at-3', title: 'Project AR 04', category: 'architecture', images: ['/images/AT/AR 04.png'], location: '', year: 2024, description: '' },
  { id: 'at-4', title: 'Project AR 05', category: 'architecture', images: ['/images/AT/AR 05 2.png'], location: '', year: 2024, description: '' },
  { id: 'at-5', title: 'Project ARC 1', category: 'architecture', images: ['/images/AT/ARC 1.png'], location: '', year: 2024, description: '' },
  { id: 'at-6', title: 'Project ARC 3', category: 'architecture', images: ['/images/AT/ARC 3.png'], location: '', year: 2024, description: '' },
  { id: 'at-7', title: 'Project ARC 4', category: 'architecture', images: ['/images/AT/ARC 4.png'], location: '', year: 2024, description: '' },
  { id: 'at-8', title: 'Project ARC 5', category: 'architecture', images: ['/images/AT/ARC 5.png'], location: '', year: 2024, description: '' },
  { id: 'at-9', title: 'Project ARC 6', category: 'architecture', images: ['/images/AT/ARC 6.png'], location: '', year: 2024, description: '' },
  { id: 'at-10', title: 'Project ARC 7', category: 'architecture', images: ['/images/AT/ARC 7.png'], location: '', year: 2024, description: '' },
  { id: 'at-11', title: 'Project ARC 8', category: 'architecture', images: ['/images/AT/ARC 8.png'], location: '', year: 2024, description: '' },
  { id: 'at-12', title: 'Project ARC 9', category: 'architecture', images: ['/images/AT/ARC 9.png'], location: '', year: 2024, description: '' },
  { id: 'at-13', title: 'Project ARC 10', category: 'architecture', images: ['/images/AT/ARC 10.png'], location: '', year: 2024, description: '' },
  { id: 'at-14', title: 'Project ARC 11', category: 'architecture', images: ['/images/AT/ARC 11.png'], location: '', year: 2024, description: '' },
  { id: 'at-15', title: 'Project ARC 12', category: 'architecture', images: ['/images/AT/ARC 12.png'], location: '', year: 2024, description: '' },
  // Interiors (IN)
  { id: 'in-1', title: 'Interior 01', category: 'interiors', images: ['/images/IN/01 INT AB.png', '/images/IN/01 INT.png'], location: '', year: 2024, description: '' },
  { id: 'in-2', title: 'Interior 02', category: 'interiors', images: ['/images/IN/02 INT AB.png'], location: '', year: 2024, description: '' },
  { id: 'in-3', title: 'Interior 03', category: 'interiors', images: ['/images/IN/03 INT AB.png', '/images/IN/03 INT.png'], location: '', year: 2024, description: '' },
  { id: 'in-4', title: 'Interior 04', category: 'interiors', images: ['/images/IN/04 INT AB.png', '/images/IN/04 INT.png'], location: '', year: 2024, description: '' },
  { id: 'in-5', title: 'Interior 056', category: 'interiors', images: ['/images/IN/056 INT AB.png'], location: '', year: 2024, description: '' },
  { id: 'in-6', title: 'Interior 08', category: 'interiors', images: ['/images/IN/08 INT AB.png'], location: '', year: 2024, description: '' },
  { id: 'in-7', title: 'Interior 09', category: 'interiors', images: ['/images/IN/09 INT AB.png'], location: '', year: 2024, description: '' },
  { id: 'in-8', title: 'Interior 10', category: 'interiors', images: ['/images/IN/10 INT AB.png'], location: '', year: 2024, description: '' },
  { id: 'in-9', title: 'Interior 11', category: 'interiors', images: ['/images/IN/11 INT AB.png'], location: '', year: 2024, description: '' },
  { id: 'in-10', title: 'Interior AR 07', category: 'interiors', images: ['/images/IN/AR 07.png'], location: '', year: 2024, description: '' },
  { id: 'in-11', title: 'Interior AR 08', category: 'interiors', images: ['/images/IN/AR 08.png'], location: '', year: 2024, description: '' },
  { id: 'in-12', title: 'Interior Image', category: 'interiors', images: ['/images/IN/Image.png'], location: '', year: 2024, description: '' },
  { id: 'in-13', title: 'Scene 5', category: 'interiors', images: ['/images/IN/Scene 5.png'], location: '', year: 2024, description: '' },
  { id: 'in-14', title: 'Scene 6', category: 'interiors', images: ['/images/IN/Scene 6.png'], location: '', year: 2024, description: '' },
  { id: 'in-15', title: 'Scene 7', category: 'interiors', images: ['/images/IN/Scene 7.png'], location: '', year: 2024, description: '' },
  { id: 'in-16', title: 'Scene 8', category: 'interiors', images: ['/images/IN/Scene 8.png'], location: '', year: 2024, description: '' },
  { id: 'in-17', title: 'Scene 9', category: 'interiors', images: ['/images/IN/Scene 9.png'], location: '', year: 2024, description: '' },
  { id: 'in-18', title: 'Scene 10', category: 'interiors', images: ['/images/IN/Scene 10.png'], location: '', year: 2024, description: '' },
  // Landscape (LN)
  { id: 'ln-1', title: 'Landscape 01', category: 'landscape', images: ['/images/LN/01 AT.png'], location: '', year: 2024, description: '' },
  { id: 'ln-2', title: 'Landscape 02', category: 'landscape', images: ['/images/LN/02 AT.png'], location: '', year: 2024, description: '' },
  { id: 'ln-3', title: 'Landscape 03', category: 'landscape', images: ['/images/LN/03 AT.png'], location: '', year: 2024, description: '' },
  { id: 'ln-4', title: 'Landscape 04', category: 'landscape', images: ['/images/LN/04 AT.png'], location: '', year: 2024, description: '' },
  { id: 'ln-5', title: 'Landscape 05', category: 'landscape', images: ['/images/LN/05 AT.png'], location: '', year: 2024, description: '' },
];

export function getProjectsByCategory(category?: ProjectCategory): Project[] {
  if (!category) return projects;
  return projects.filter(project => project.category === category);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find(project => project.id === id);
}

export function getAllCategories(): ProjectCategory[] {
  return ['architecture', 'interiors', 'landscape'];
}
