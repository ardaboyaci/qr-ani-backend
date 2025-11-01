const { supabase } = require('./supabaseClient.js');

async function insertEvent() {
  console.log('Attempting to insert event...');
  
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          title: 'My First VS Code Event',
          slug: 'my-first-vs-code-event',
          theme: 'classic',
          cover_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
          date: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
        }
      ])
      .select();

    if (error) {
      console.error('❌ Error inserting event:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Event inserted successfully!');
      console.log('Inserted data:', data);
    }
  } catch (err) {
    console.error('❌ Caught exception:', err);
  }
}

// Run the function
insertEvent(); 