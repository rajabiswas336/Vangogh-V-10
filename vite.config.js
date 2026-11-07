import { existsSync, unlinkSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
let originalHeroInBuild
let sourceLoopsInBuild = []
let conceptBoardsInBuild = []

const omitOriginalHeroFromBuild = {
  name: 'omit-original-hero-video-from-dist',
  apply: 'build',
  configResolved(config) {
    originalHeroInBuild = resolve(
      config.root,
      config.build.outDir,
      'Media',
      'Hero',
      'Brand Intro Hero video',
      'Brand Intro Hero video.mp4',
    )
    sourceLoopsInBuild = [
      'loop-abstract-flow.mp4',
      'loop-ai-creative.mp4',
      'loop-film-photography.mp4',
      'loop-website-development.mp4',
      'Untitled video.mp4',
    ].map((filename) => resolve(config.root, config.build.outDir, 'Media', 'Website-Loops', filename))
    conceptBoardsInBuild = [
      'Cinematic Creative Production Asset Board-4.png',
      'Cinematic Creative Studio Portfolio Grid-1.png',
      'Cinematic Neon Creative Studio Asset Board-3.png',
      'Cinematic Neon Creative Studio Design Board-5.png',
      'Neon Creative Studio Portfolio Board-2.png',
    ].map((filename) => resolve(config.root, config.build.outDir, 'Media', 'Website-Concepts', filename))
  },
  closeBundle() {
    for (const sourceAsset of [originalHeroInBuild, ...sourceLoopsInBuild, ...conceptBoardsInBuild]) {
      if (sourceAsset && existsSync(sourceAsset)) {
        unlinkSync(sourceAsset)
      }
    }
  },
}

export default defineConfig({
  plugins: [react(), omitOriginalHeroFromBuild],
})
