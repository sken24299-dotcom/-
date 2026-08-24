import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectsDir = path.join(root, 'public', 'projects');
const widths = [768, 1536];

for (const project of ['project-01', 'project-02', 'project-03']) {
  const source = path.join(projectsDir, `${project}.png`);
  for (const width of widths) {
    const pipeline = sharp(source).resize({ width, withoutEnlargement: true });
    await Promise.all([
      pipeline.clone().webp({ quality: 84, smartSubsample: true }).toFile(path.join(projectsDir, `${project}-${width}.webp`)),
      pipeline.clone().avif({ quality: 58, effort: 5 }).toFile(path.join(projectsDir, `${project}-${width}.avif`)),
    ]);
  }
}

console.log('Responsive AVIF and WebP project assets generated.');
