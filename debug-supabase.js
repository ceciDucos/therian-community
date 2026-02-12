
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wjoxqfgpqlojgehjzxyp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpY3MiOiJzdXBhYmFzZSIsInJlZ2lvbiI6Indqb3hxbmdwcWxvamdlaGp6eXAiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczOTI1NzQwMCwiZXhwIjoyMDU0ODMzNDAwfQ.w1V86hQ7uW2_L6n6A035T-_OunS_I64fX8h-h-F-F-F';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing Supabase Connection...');

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) {
            console.error('Error fetching products:', error);
        } else {
            console.log('Products fetched successfully:', data);
            console.log('Count:', data.length);
        }

        const { data: videos, error: vError } = await supabase
            .from('embedded_videos')
            .select('*');

        if (vError) {
            console.error('Error fetching videos:', vError);
        } else {
            console.log('Videos count:', videos.length);
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
