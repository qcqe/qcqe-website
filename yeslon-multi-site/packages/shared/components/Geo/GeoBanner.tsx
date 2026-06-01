import React, { useState } from 'react';
import { useGeo } from './GeoContext';
import { Button } from '../UI/Button';

export const GeoBanner: React.FC = () => {
  const { currentRegion, switchRegion } = useGeo();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || currentRegion !== 'auto-detected') {
    return null;
  }

  const regions = [
    { code: 'CN', name: '中国' },
    { code: 'US', name: '美国' },
    { code: 'EU', name: '欧洲' },
    { code: 'OTHER', name: '其他地区' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary-600 text-white py-3 px-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <p className="text-sm">
          我们检测到您可能在中国，是否切换到中文站点？
        </p>
        <div className="flex gap-2">
          {regions.map(region => (
            <Button
              key={region.code}
              variant="secondary"
              size="small"
              onClick={() => {
                switchRegion(region.code);
                setDismissed(true);
              }}
            >
              {region.name}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="small"
            onClick={() => setDismissed(true)}
          >
            稍后再说
          </Button>
        </div>
      </div>
    </div>
  );
};
