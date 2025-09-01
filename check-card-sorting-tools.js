const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://zldebmtgmzlwetyxxovf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZGVibXRnbXpsd2V0eXh4b3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MzU5MzcsImV4cCI6MjA2NTMxMTkzN30.-PKnStvkzvLyYKAK8XxElFcQyNnRmpmF3L7rMVtveOE'
);

const cardSortingTools = [
  'Optimal Workshop', 'Maze', 'UserZoom', 'UXTweak', 'Miro', 'kardSort', 'Lyssna', 
  'UXMetrics', 'UserTesting', 'UXArmy', 'Userlytics', 'UserBit', 'XSort', 'ClickUp', 
  'Figma', 'Useberry', 'Loop11'
];

(async () => {
  console.log('=== Checking which Card Sorting tools already exist ===');
  const { data, error } = await supabase.from('tools').select('name, id');
  if (error) console.error('Error:', error);
  else {
    const existingToolNames = data.map(t => t.name);
    const existing = cardSortingTools.filter(tool => existingToolNames.includes(tool));
    const missing = cardSortingTools.filter(tool => !existingToolNames.includes(tool));
    
    console.log('Existing tools (' + existing.length + '):', existing);
    console.log('Missing tools (' + missing.length + '):', missing);
    
    // Show IDs of existing tools
    console.log('\nExisting tool IDs:');
    existing.forEach(toolName => {
      const tool = data.find(t => t.name === toolName);
      if (tool) console.log('-', toolName, ':', tool.id);
    });
  }
})();
