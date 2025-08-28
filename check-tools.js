const tools = ['UserTesting', 'Maze', 'UXTweak', 'Lookback', 'Optimal Workshop', 'Hotjar', 'Userlytics', 'UsabilityHub', 'Loop11', 'Crazy Egg', 'Userfeel', 'UserZoom', 'Userbrain', 'Useberry', 'Trymata', 'Contentsquare', 'User Interviews', 'Dovetail', 'UX Metrics', 'PlaybookUX'];

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://zldebmtgmzlwetyxxovf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZGVibXRnbXpsd2V0eXh4b3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MzU5MzcsImV4cCI6MjA2NTMxMTkzN30.-PKnStvkzvLyYKAK8XxElFcQyNnRmpmF3L7rMVtveOE');

supabase.from('tools').select('name').then(({data, error}) => {
  if(error) console.error(error);
  else {
    const existing = data.map(t => t.name);
    const missing = tools.filter(tool => !existing.includes(tool));
    console.log('=== MISSING TOOLS (need to INSERT) ===');
    missing.forEach(tool => console.log(`- ${tool}`));
    console.log('\n=== EXISTING TOOLS (update leaderboard only) ===');
    tools.filter(tool => existing.includes(tool)).forEach(tool => console.log(`- ${tool}`));
  }
});
