import {fileURLToPath, URL} from 'node:url'
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import process from 'node:process'
import tailwindcss from 'tailwindcss'
import autoprefixer = require("autoprefixer");

// https://vitejs.dev/config/
export default ({mode}) => {

  const CI = !!process.env.CI
  /**
   * When called from vitest the mode will be 'test'. Any variables defined in .env.test will
   * supercede properties, but load the development environment variables to ensure a proper configuraton.
   */
  const processEnvironment = () => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    if(mode === 'test' && !CI) {
      process.env = {...process.env, ...loadEnv('development', process.cwd())};
    }
  };
  processEnvironment();

  const config = {
    plugins : [vue(), basicSsl(), tailwindcss, autoprefixer],
    https: true,
  };

  if(process.argv.includes('preview')) {
    config.plugins.pop();
    config.https = false;
  }

  if( mode !== 'production' && !CI) {
    config.proxy = {
      '^/stamp-webservices': {
        target: process.env.VITE_PROXY_URL,
        secure: false,
        ssl: {
          key: fs.readFileSync(process.env.VITE_SSL_KEY as string, 'utf8'),
          cert: fs.readFileSync(process.env.VITE_SSL_CERT as string, 'utf8')
        },
        changeOrigin: true,
        configure: (proxy : object, options: object) => {
          options.auth = `${process.env.VITE_PROXY_USER}:${process.env.VITE_PROXY_PASSWORD}`;
        }
      }
    }
  }

  return defineConfig({
    plugins: config.plugins,
    optimizeDeps: {
      include: [
        'nouislider',
        'wnumb',
        'trix'
      ]
    },
    server: {
      https: config.https,
      proxy: config.proxy
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  });
}
