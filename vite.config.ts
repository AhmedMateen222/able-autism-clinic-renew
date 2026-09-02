import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        about: path.resolve(__dirname, 'about.html'),
        services: path.resolve(__dirname, 'services.html'),
        programs: path.resolve(__dirname, 'programs.html'),
        team: path.resolve(__dirname, 'team.html'),
        resources: path.resolve(__dirname, 'resources.html'),
        faqs: path.resolve(__dirname, 'faqs.html'),
        contact: path.resolve(__dirname, 'contact.html'),
        appointment: path.resolve(__dirname, 'appointment.html'),
        privacy: path.resolve(__dirname, 'privacy.html'),
        terms: path.resolve(__dirname, 'terms.html'),
      },
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
