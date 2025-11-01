const { supabase } = require('./supabaseClient.js');

async function readEvents() {
  console.log('Reading all events...');
  
  try {
    // Read all events
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error reading events:', error);
    } else {
      console.log('✅ Events retrieved successfully!');
      console.log(`Found ${data.length} event(s):`);
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('❌ Caught exception:', err);
  }
}

// Run the function
readEvents(); 