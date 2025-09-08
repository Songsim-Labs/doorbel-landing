"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function AdminBreadcrumb() {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    type Crumb = {
      name: string;
      href: string;
      icon?: React.ComponentType<{ className?: string }>;
    };
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: Crumb[] = [
      {
        name: 'Admin',
        href: '/admin',
        icon: Home,
      }
    ];

    let currentPath = '/admin';
    
    segments.forEach((segment, index) => {
      if (segment === 'admin') return;
      
      currentPath += `/${segment}`;
      
      // Capitalize and format segment names
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        name,
        href: currentPath,
        icon: undefined,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            )}
            
            {index === breadcrumbs.length - 1 ? (
              <span className="text-sm font-medium text-gray-900 flex items-center">
                {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4 mr-1" />}
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center transition-colors"
              >
                {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4 mr-1" />}
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
