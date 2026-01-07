export interface BrandingConfig {
  name: string;
  shortName: string;
  description: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  theme: 'light' | 'dark' | 'auto';
  useCase: string;
  domain: string;
}

// Default branding configuration
export const defaultBranding: BrandingConfig = {
  name: 'DataCat',
  shortName: 'DataCat',
  description: 'AI-powered Data Capture System – Forms and Photo-based Inventory',
  logo: '/logo.svg',
  favicon: '/favicon.ico',
  primaryColor: '#3B82F6', // Blue
  secondaryColor: '#1F2937', // Gray
  accentColor: '#10B981', // Green
  theme: 'light',
  useCase: 'Erfassung & Inventar',
  domain: 'datacat.ch'
};

// Environment-based branding overrides
export const getBrandingConfig = (): BrandingConfig => {
  const envBranding = {
    name: process.env.NEXT_PUBLIC_BRAND_NAME,
    shortName: process.env.NEXT_PUBLIC_BRAND_SHORT_NAME,
    description: process.env.NEXT_PUBLIC_BRAND_DESCRIPTION,
    logo: process.env.NEXT_PUBLIC_BRAND_LOGO,
    favicon: process.env.NEXT_PUBLIC_BRAND_FAVICON,
    primaryColor: process.env.NEXT_PUBLIC_BRAND_PRIMARY_COLOR,
    secondaryColor: process.env.NEXT_PUBLIC_BRAND_SECONDARY_COLOR,
    accentColor: process.env.NEXT_PUBLIC_BRAND_ACCENT_COLOR,
    theme: process.env.NEXT_PUBLIC_BRAND_THEME as 'light' | 'dark' | 'auto',
    useCase: process.env.NEXT_PUBLIC_BRAND_USE_CASE,
    domain: process.env.NEXT_PUBLIC_BRAND_DOMAIN
  };

  return {
    ...defaultBranding,
    ...Object.fromEntries(
      Object.entries(envBranding).filter(([_, value]) => value !== undefined)
    )
  };
};

// Export the current branding config
export const branding = getBrandingConfig(); 