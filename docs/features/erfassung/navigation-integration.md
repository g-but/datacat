# Erfassung Navigation Integration Plan

## Overview
Integration of "Erfassung" as a new solution in the existing Formular platform navigation system.

## Navigation Updates Required

### 1. TopNavigation.tsx Modifications

#### Add Erfassung to Lösungen Dropdown
```typescript
// Add new icon for Erfassung
const CameraIcon = (props: { className?: string }) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89L8.93 4.89A2 2 0 0110.593 4h2.814a2 2 0 011.664.89L16.407 6.11A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Update primaryLinks array
const primaryLinks: NavItem[] = [
  { name: 'Formular Builder', href: '/builder', description: 'Erstellen und bearbeiten Sie Ihre Formulare.', icon: DocumentChartBarIcon },
  { name: 'Erfassung', href: '/erfassung', description: 'KI-gestützte Produktkatalogisierung aus Fotos.', icon: CameraIcon, badge: 'Neu' },
  { name: 'Vorlagen-Bibliothek', href: '/templates', description: 'Starten Sie mit einer vorgefertigten Vorlage.', icon: DocumentDuplicateIcon },
  { name: 'Gespeicherte Formulare', href: '/forms', description: 'Verwalten Sie Ihre gespeicherten Formulare.', icon: FolderIcon },
];
```

#### Add Badge Component for "Neu" Label
```typescript
// Badge component for highlighting new features
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
    {children}
  </span>
);

// Update link rendering to include badge
{item.badge && <Badge>{item.badge}</Badge>}
```

### 2. GlobalNavigation.tsx Updates

#### Extend Route Mapping
```typescript
function mapPathToView(path: string): 'builder' | 'templates' | 'saved-forms' | 'about' | 'erfassung' {
  if (path.startsWith('/templates')) return 'templates';
  if (path.startsWith('/forms')) return 'saved-forms';
  if (path.startsWith('/about')) return 'about';
  if (path.startsWith('/erfassung')) return 'erfassung';
  return 'builder';
}

// Update router navigation
const handleViewNavigation = (view: string) => {
  const routeMap = {
    'saved-forms': '/forms',
    'erfassung': '/erfassung'
  };
  const target = routeMap[view] || `/${view}`;
  router.push(target);
};
```

### 3. Mobile Navigation Updates

#### Add Erfassung to Mobile Menu
```typescript
const navigation = [
  { name: 'Builder', href: '/builder' },
  { name: 'Erfassung', href: '/erfassung', badge: 'Neu' },
  { name: 'Forms', href: '/forms' },
  { name: 'Templates', href: '/templates' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
];
```

## Erfassung Internal Navigation Structure

### Primary Navigation Tabs
```typescript
const erfassungTabs = [
  { name: 'Dashboard', href: '/erfassung', icon: HomeIcon },
  { name: 'Neue Erfassung', href: '/erfassung/new', icon: PlusIcon },
  { name: 'Produktkatalog', href: '/erfassung/products', icon: CubeIcon },
  { name: 'Export Verlauf', href: '/erfassung/exports', icon: DocumentArrowDownIcon },
  { name: 'Einstellungen', href: '/erfassung/settings', icon: CogIcon },
];
```

### Breadcrumb System
```typescript
// Breadcrumb component for Erfassung sections
const ErfassungBreadcrumb = ({ currentPath }: { currentPath: string }) => {
  const breadcrumbMap = {
    '/erfassung': ['Formular', 'Lösungen', 'Erfassung'],
    '/erfassung/new': ['Formular', 'Lösungen', 'Erfassung', 'Neue Erfassung'],
    '/erfassung/products': ['Formular', 'Lösungen', 'Erfassung', 'Produktkatalog'],
    '/erfassung/products/[id]': ['Formular', 'Lösungen', 'Erfassung', 'Produktkatalog', 'Produkt Details'],
  };
  
  return (
    <nav className="flex" aria-label="Breadcrumb">
      {/* Breadcrumb implementation */}
    </nav>
  );
};
```

## Page Structure Creation

### Required Page Files
1. `/erfassung/page.tsx` - Dashboard/Overview
2. `/erfassung/new/page.tsx` - New Product Capture Workflow
3. `/erfassung/products/page.tsx` - Product Inventory Management
4. `/erfassung/products/[id]/page.tsx` - Individual Product Details
5. `/erfassung/exports/page.tsx` - Export History
6. `/erfassung/settings/page.tsx` - Configuration Settings

### Layout Structure
```typescript
// /erfassung/layout.tsx
export default function ErfassungLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ErfassungHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErfassungNavTabs />
        {children}
      </div>
    </div>
  );
}
```

## Implementation Priority

### Phase 1: Navigation Integration
1. Update TopNavigation.tsx with Erfassung link
2. Add mobile menu support
3. Create basic page structure
4. Implement breadcrumb system

### Phase 2: Workflow Pages
1. Dashboard overview page
2. New product capture workflow
3. Product inventory management
4. Export functionality

### Phase 3: Advanced Features
1. Settings and configuration
2. Advanced filtering and search
3. Batch operations
4. Integration with existing auth system

## TypeScript Updates Required

### Navigation Type Extensions
```typescript
type AppView = 'builder' | 'templates' | 'saved-forms' | 'about' | 'erfassung';

interface NavItem {
  name: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string; // New property for badges
}

interface ErfassungProduct {
  id: string;
  title: string;
  description: string;
  photos: string[];
  status: 'draft' | 'analyzed' | 'exported' | 'published';
  createdAt: Date;
  updatedAt: Date;
  // ... additional product fields
}
```

## Styling Considerations

### Badge Styling
- Green badge for "Neu" to indicate new feature
- Consistent with existing Tailwind CSS design system
- Dark mode support

### Erfassung Branding
- Camera/photo-related iconography
- Consistent color scheme with main Formular brand
- Professional appearance suitable for business users

## Accessibility

### Screen Reader Support
- Proper ARIA labels for new navigation items
- Semantic HTML structure for breadcrumbs
- Keyboard navigation support

### Mobile Responsiveness
- Touch-friendly interface for photo capture
- Responsive grid layouts for product catalogs
- Optimized for tablet usage in warehouse environments

## Next Steps

1. Implement navigation changes in TopNavigation.tsx
2. Create basic page structure with routing
3. Set up Erfassung-specific components
4. Integrate with existing authentication system
5. Plan database schema for product data