const fs = require('fs');
const path = require('path');

const VIDEO_DIR = path.join(process.cwd(), 'public', 'videos');
const OUT_FILE = path.join(process.cwd(), 'lib', 'hero-videos.generated.ts');
const EXT = ['.mp4', '.webm', '.mov'];

let list = [];
try {
  if (fs.existsSync(VIDEO_DIR)) {
    const names = fs.readdirSync(VIDEO_DIR);
    list = names
      .filter((n) => EXT.some((e) => n.toLowerCase().endsWith(e)))
      .sort()
      .map((n) => `  '/videos/${n}'`);
  }
} catch (_) {}

const content = `// Auto-generated from public/videos – do not edit
export const HERO_VIDEOS: string[] = [\n${list.join(',\n')}\n];
`;
fs.writeFileSync(OUT_FILE, content, 'utf8');
console.log('Hero videos:', list.length ? list.length + ' file(s)' : 'none (add .mp4 to public/videos)');
