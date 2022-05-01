import react from '@vitejs/plugin-react'
import { UserConfig, ConfigEnv } from 'vite'
import { join, resolve } from 'path'

const srcRoot = join(__dirname, 'src')
const resolveAlias = {
  '/@': srcRoot,
  '@components': resolve(__dirname, 'src/components'),
  '@parts': resolve(__dirname, 'src/parts'),
  '@atoms': resolve(__dirname, 'src/atoms'),
}

export default ({ command }: ConfigEnv): UserConfig => {
  // DEV
  if (command === 'serve') {
    return {
      root: srcRoot,
      base: '/',
      plugins: [react()],
      resolve: {
        alias: resolveAlias,
      },
      build: {
        outDir: join(srcRoot, '/out'),
        emptyOutDir: true,
        rollupOptions: {},
      },
      server: {
        port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
      },
      optimizeDeps: {
        exclude: ['path'],
      },
    }
  }
  // PROD
  return {
    root: srcRoot,
    base: './',
    plugins: [react()],
    resolve: {
      alias: resolveAlias,
    },
    build: {
      outDir: join(srcRoot, '/out'),
      emptyOutDir: true,
      rollupOptions: {},
    },
    server: {
      port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
    },
    optimizeDeps: {
      exclude: ['path'],
    },
  }
}
