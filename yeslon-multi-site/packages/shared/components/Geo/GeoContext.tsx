import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GeoLocation } from '@geo/ipDetector';
import { GeoRouter, GeoRouterConfig } from '@geo/geoRouter';

interface GeoContextValue {
  location: GeoLocation | null;
  currentRegion: string;
  isLoading: boolean;
  error: Error | null;
  switchRegion: (regionCode: string) => void;
  clearRegion: () => void;
}

const GeoContext = createContext<GeoContextValue | undefined>(undefined);

export const GeoProvider: React.FC<{
  children: ReactNode;
  config: GeoRouterConfig
}> = ({ children, config }) => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [currentRegion, setCurrentRegion] = useState<string>(config.defaultRegion);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const geoRouter = new GeoRouter(config);

  useEffect(() => {
    const initGeo = async () => {
      try {
        setIsLoading(true);

        const savedPreference = localStorage.getItem(config.cookieName);
        if (savedPreference) {
          setCurrentRegion(savedPreference);
        } else {
          const { GeoDetector } = await import('@geo/ipDetector');
          const geoDetector = new GeoDetector({
            apiEndpoint: 'https://ipapi.co/json/',
            timeout: 5000,
            fallback: {
              ip: '127.0.0.1',
              country: 'Unknown',
              countryCode: 'XX',
              region: 'Unknown',
              regionCode: 'XX',
              city: 'Unknown',
              latitude: 0,
              longitude: 0,
              timezone: 'UTC',
              currency: 'USD'
            }
          });

          const geo = await geoDetector.detect();
          setLocation(geo);

          const matchedRegion = config.regions.find(r =>
            r.code === geo.countryCode.toUpperCase()
          );
          if (matchedRegion) {
            setCurrentRegion(matchedRegion.code);
          }
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initGeo();
  }, []);

  const switchRegion = (regionCode: string) => {
    geoRouter.savePreference(regionCode);
    setCurrentRegion(regionCode);
  };

  const clearRegion = () => {
    geoRouter.clearPreference();
    setCurrentRegion(config.defaultRegion);
  };

  return (
    <GeoContext.Provider value={{
      location,
      currentRegion,
      isLoading,
      error,
      switchRegion,
      clearRegion
    }}>
      {children}
    </GeoContext.Provider>
  );
};

export const useGeo = (): GeoContextValue => {
  const context = useContext(GeoContext);
  if (!context) {
    throw new Error('useGeo must be used within GeoProvider');
  }
  return context;
};
