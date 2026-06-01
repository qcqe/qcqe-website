import { GeoLocation } from './ipDetector';
import { RegionConfig } from '@shared/types';

export type RedirectStrategy = 'auto' | 'manual' | 'none';

export interface GeoRouterConfig {
  strategy: RedirectStrategy;
  defaultRegion: string;
  regions: RegionConfig[];
  cookieName: string;
  cookieExpiry: number;
}

export class GeoRouter {
  private config: GeoRouterConfig;

  constructor(config: GeoRouterConfig) {
    this.config = config;
  }

  async shouldRedirect(
    currentDomain: string,
    geo: GeoLocation
  ): Promise<{ shouldRedirect: boolean; targetRegion?: string; targetDomain?: string }> {
    const savedPreference = this.getSavedPreference();
    
    if (savedPreference) {
      const region = this.getRegionByCode(savedPreference);
      if (region) {
        return {
          shouldRedirect: this.config.strategy === 'auto' && currentDomain !== this.getDomainForRegion(region),
          targetRegion: region.code,
          targetDomain: this.getDomainForRegion(region)
        };
      }
    }

    if (this.config.strategy !== 'auto') {
      return { shouldRedirect: false };
    }

    const matchedRegion = this.matchRegion(geo);
    if (matchedRegion && matchedRegion.code !== this.config.defaultRegion) {
      return {
        shouldRedirect: true,
        targetRegion: matchedRegion.code,
        targetDomain: this.getDomainForRegion(matchedRegion)
      };
    }

    return { shouldRedirect: false };
  }

  private getSavedPreference(): string | null {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    const targetCookie = cookies.find(c => c.trim().startsWith(`${this.config.cookieName}=`));
    return targetCookie ? targetCookie.split('=')[1] : null;
  }

  private getRegionByCode(code: string): RegionConfig | undefined {
    return this.config.regions.find(r => r.code === code);
  }

  private matchRegion(geo: GeoLocation): RegionConfig | undefined {
    return this.config.regions.find(r => {
      if (r.code === 'CN' && (geo.countryCode === 'CN' || geo.countryCode === 'china')) {
        return true;
      }
      return r.code === geo.countryCode.toUpperCase();
    });
  }

  private getDomainForRegion(region: RegionConfig): string {
    return `${region.code.toLowerCase()}.yeslon.com`;
  }

  savePreference(regionCode: string): void {
    if (typeof document === 'undefined') return;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + this.config.cookieExpiry);
    document.cookie = `${this.config.cookieName}=${regionCode};expires=${expiry.toUTCString()};path=/`;
  }

  clearPreference(): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${this.config.cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}
