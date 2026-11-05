import type { LocalImageService } from 'astro';
import sharpService from 'astro/assets/services/sharp';

/**
 * Astro's Sharp service with one difference. At quality 100, the AVIF and WebP
 * encoders keep the lossless settings from astro.config.mjs, which artwork
 * needs (#64). Any lower quality is a photograph (`PHOTO` in images.ts), so the
 * same encoders run lossy at that quality (#90). AVIF keeps 4:4:4 chroma
 * either way.
 */
const service: LocalImageService = {
  ...sharpService,
  transform(inputBuffer, transform, config, ...rest) {
    const quality = Number(transform.quality ?? 100);
    if (!(quality < 100)) return sharpService.transform(inputBuffer, transform, config, ...rest);
    const { avif, webp, ...encoders } = config.service.config;
    const lossy = {
      ...config,
      service: {
        ...config.service,
        config: {
          ...encoders,
          avif: { ...avif, lossless: false },
          webp: { ...webp, lossless: false },
        },
      },
    };
    return sharpService.transform(inputBuffer, transform, lossy, ...rest);
  },
};

export default service;
