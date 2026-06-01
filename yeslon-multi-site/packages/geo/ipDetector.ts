export interface GeoLocation {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  currency: string;
}

export interface GeoDetectorConfig {
  apiEndpoint: string;
  timeout: number;
  fallback: GeoLocation;
}

export class GeoDetector {
  private config: GeoDetectorConfig;

  constructor(config: GeoDetectorConfig) {
    this.config = config;
  }

  async detect(): Promise<GeoLocation> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(this.config.apiEndpoint, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Geo API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseResponse(data);
    } catch (error) {
      console.warn('Geo detection failed, using fallback:', error);
      return this.config.fallback;
    }
  }

  private parseResponse(data: any): GeoLocation {
    return {
      ip: data.ip,
      country: data.country_name,
      countryCode: data.country_code,
      region: data.region,
      regionCode: data.region_code,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      currency: data.currency
    };
  }

  isChina(geo: GeoLocation): boolean {
    return geo.countryCode === 'CN' || geo.countryCode === 'china';
  }
}
