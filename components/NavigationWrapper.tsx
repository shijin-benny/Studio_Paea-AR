'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function NavigationWrapper() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return <Navigation isHomePage={isHomePage} />;
}
