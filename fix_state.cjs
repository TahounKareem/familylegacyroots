const fs = require('fs');
let code = fs.readFileSync('src/components/ui/StoriesSection.tsx', 'utf8');

code = code.replace(
  'const [selectedStory, setSelectedStory] = useState<{name: string; fullText: string} | null>(null);',
  'const [selectedStory, setSelectedStory] = useState<{name: string; fullText: string} | null>(null);\n  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);'
);

fs.writeFileSync('src/components/ui/StoriesSection.tsx', code);
