const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://zldebmtgmzlwetyxxovf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZGVibXRnbXpsd2V0eXh4b3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MzU5MzcsImV4cCI6MjA2NTMxMTkzN30.-PKnStvkzvLyYKAK8XxElFcQyNnRmpmF3L7rMVtveOE'
);

// Available tables in your database
const AVAILABLE_TABLES = [
  'tools',
  'methods',
  'collections',
  'frameworks',
  'metrics',
  'users',
  'votes',
  'app_feedback',
  'contact_messages',
  'tools_leaderboard',
  'tool_pros_and_cons'
];

// Helper function to format table data
function formatTableData(tableName, data) {
  console.log(`\n=== ${tableName.toUpperCase()} TABLE ===`);
  console.log(`Found ${data.length} records:\n`);

  if (data.length === 0) {
    console.log('No records found.\n');
    return;
  }

  // Get column names from first record
  const columns = Object.keys(data[0]);
  
  data.forEach((record, index) => {
    console.log(`${index + 1}. Record ID: ${record.id || record.entity_id || 'N/A'}`);
    
    columns.forEach(column => {
      let value = record[column];
      
      // Format different data types
      if (value === null || value === undefined) {
        value = 'NULL';
      } else if (typeof value === 'object') {
        value = JSON.stringify(value);
      } else if (typeof value === 'string' && value.length > 100) {
        value = value.substring(0, 100) + '...';
      }
      
      console.log(`   ${column}: ${value}`);
    });
    console.log('   ---');
  });
}

// Function to get table summary stats
function getTableSummary(tableName, data) {
  const summary = {
    total_records: data.length,
    columns: data.length > 0 ? Object.keys(data[0]).length : 0,
    column_names: data.length > 0 ? Object.keys(data[0]) : []
  };

  // Table-specific insights
  switch (tableName) {
    case 'tools':
      summary.with_descriptions = data.filter(t => t.description).length;
      summary.with_websites = data.filter(t => t.website_url).length;
      summary.with_logos = data.filter(t => t.logo_url).length;
      break;
    case 'methods':
      summary.with_upvotes = data.filter(m => m.current_upvotes > 0).length;
      summary.total_upvotes = data.reduce((sum, m) => sum + (m.current_upvotes || 0), 0);
      summary.total_downvotes = data.reduce((sum, m) => sum + (m.current_downvotes || 0), 0);
      break;
    case 'votes':
      summary.upvotes = data.filter(v => v.sentiment === 'UPVOTE').length;
      summary.downvotes = data.filter(v => v.sentiment === 'DOWNVOTE').length;
      summary.unique_devices = [...new Set(data.map(v => v.device_id))].length;
      break;
    case 'users':
      summary.with_email = data.filter(u => u.email).length;
      summary.unique_countries = [...new Set(data.map(u => u.country).filter(Boolean))].length;
      summary.unique_devices = [...new Set(data.map(u => u.device_id).filter(Boolean))].length;
      break;
    case 'frameworks':
      summary.total_upvotes = data.reduce((sum, f) => sum + (f.current_upvotes || 0), 0);
      summary.total_downvotes = data.reduce((sum, f) => sum + (f.current_downvotes || 0), 0);
      break;
  }

  return summary;
}

// Main function to view tables
async function viewTable(tableName, options = {}) {
  try {
    const { limit = 50, offset = 0, orderBy = null, showSummary = true, showData = true } = options;

    if (!AVAILABLE_TABLES.includes(tableName)) {
      console.log(`❌ Table "${tableName}" not found.`);
      console.log(`Available tables: ${AVAILABLE_TABLES.join(', ')}`);
      return;
    }

    console.log(`\n🔍 Fetching data from "${tableName}" table...`);

    let query = supabase.from(tableName).select('*');
    
    if (orderBy) {
      query = query.order(orderBy);
    } else {
      // Default ordering based on table structure
      if (['tools', 'methods', 'frameworks', 'metrics', 'collections'].includes(tableName)) {
        query = query.order('name');
      } else if (['tools_leaderboard', 'tool_pros_and_cons'].includes(tableName)) {
        query = query.order('id');
      } else {
        // Tables with created_at: users, votes, app_feedback, contact_messages
        query = query.order('created_at', { ascending: false });
      }
    }

    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching data:', error);
      return;
    }

    if (showSummary) {
      const summary = getTableSummary(tableName, data);
      console.log('\n📊 SUMMARY:');
      Object.entries(summary).forEach(([key, value]) => {
        console.log(`   ${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
      });
    }

    if (showData) {
      formatTableData(tableName, data);
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

// Function to list all available tables
function listTables() {
  console.log('\n📋 AVAILABLE TABLES:');
  AVAILABLE_TABLES.forEach((table, index) => {
    console.log(`   ${index + 1}. ${table}`);
  });
  console.log('\nUsage examples:');
  console.log('   node view-database.js tools');
  console.log('   node view-database.js users --limit=10');
  console.log('   node view-database.js votes --summary-only');
  console.log('   node view-database.js methods --order-by=name');
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    listTables();
    return null;
  }

  const tableName = args[0];
  const options = {};

  // Parse additional options
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--limit=')) {
      options.limit = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--offset=')) {
      options.offset = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--order-by=')) {
      options.orderBy = arg.split('=')[1];
    } else if (arg === '--summary-only') {
      options.showData = false;
    } else if (arg === '--data-only') {
      options.showSummary = false;
    }
  }

  return { tableName, options };
}

// Run the script
const parsed = parseArgs();
if (parsed) {
  viewTable(parsed.tableName, parsed.options);
}
