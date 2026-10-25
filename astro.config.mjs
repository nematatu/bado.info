import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://bado-info.amtt.workers.dev',
  output: 'static',
  integrations: [react()],
});
