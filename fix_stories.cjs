const fs = require('fs');
let code = fs.readFileSync('src/components/ui/StoriesSection.tsx', 'utf8');

// Add state for video
code = code.replace(
  "const [selectedStory, setSelectedStory] = useState<Story | null>(null);",
  "const [selectedStory, setSelectedStory] = useState<Story | null>(null);\n  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);"
);

// Replace the button onClick
code = code.replace(
  "onClick={() => window.open('https://youtube.com/shorts/R3nNU3dH2EY', '_blank')}",
  "onClick={() => setPlayingVideoUrl('https://www.youtube.com/embed/R3nNU3dH2EY?autoplay=1')}"
);

// Replace the image thumbnail onClick
code = code.replace(
  "onClick={() => window.open('https://youtube.com/shorts/R3nNU3dH2EY', '_blank')}",
  "onClick={() => setPlayingVideoUrl('https://www.youtube.com/embed/R3nNU3dH2EY?autoplay=1')}"
);

// Add the elegant play button overlay
code = code.replace(
  `referrerPolicy="no-referrer"\n                    />`,
  `referrerPolicy="no-referrer"\n                    />\n                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">\n                      <div className="w-16 h-16 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 group-hover:bg-[#722f37]/80 transition-all duration-300">\n                        <Play className="w-8 h-8 text-white fill-white ml-1" />\n                      </div>\n                    </div>`
);

// Add the Video Modal at the end, right before the Elegant Story Modal AnimatePresence
code = code.replace(
  "      {/* Elegant Story Modal */}",
  `      {/* Video Player Modal */}\n      <AnimatePresence>\n        {playingVideoUrl && (\n          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" dir="rtl">\n            <motion.div \n              initial={{ opacity: 0 }}\n              animate={{ opacity: 1 }}\n              exit={{ opacity: 0 }}\n              transition={{ duration: 0.3 }}\n              onClick={() => setPlayingVideoUrl(null)}\n              className="absolute inset-0 bg-black/80 backdrop-blur-md"\n            />\n            <motion.div \n              initial={{ opacity: 0, y: 30, scale: 0.95 }}\n              animate={{ opacity: 1, y: 0, scale: 1 }}\n              exit={{ opacity: 0, y: 20, scale: 0.95 }}\n              transition={{ type: "spring", damping: 25, stiffness: 300 }}\n              className="relative w-full max-w-[400px] aspect-[9/16] bg-black rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col"\n            >\n              <button \n                onClick={() => setPlayingVideoUrl(null)}\n                className="absolute top-4 right-4 z-20 text-white hover:text-gray-200 transition-colors bg-black/40 hover:bg-black/80 backdrop-blur-md p-2 rounded-full"\n                aria-label="إغلاق"\n              >\n                <X className="w-6 h-6" />\n              </button>\n              <iframe \n                src={playingVideoUrl} \n                className="w-full h-full border-0" \n                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" \n                allowFullScreen\n                title="تشغيل الفيديو"\n              ></iframe>\n            </motion.div>\n          </div>\n        )}\n      </AnimatePresence>\n\n      {/* Elegant Story Modal */}`
);

fs.writeFileSync('src/components/ui/StoriesSection.tsx', code);
