import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wjoxqfgpqlojgehjzxyp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM2ODUwNjk1LCJleHAiOjIwNTI0MjY2OTV9.mV4cCl6MjA4NjM1MTA2OX0.S3gfCDqFYB6TqtmdNSi-AdrSn6qXA4mFFg7zQRyZEto';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing Supabase connection with corrected key...');
    console.log('URL:', supabaseUrl);
    console.log('Key (first 50 chars):', supabaseKey.substring(0, 50) + '...');

    // Test products
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

    if (productsError) {
        console.error('❌ Products fetch FAILED:', productsError);
    } else {
        console.log('✅ Products fetch SUCCESS:', products?.length, 'products found');
        if (products && products.length > 0) {
            console.log('Sample product:', products[0]);
        }
    }

    // Test videos
    const { data: videos, error: videosError } = await supabase
        .from('embedded_videos')
        .select('*');

    if (videosError) {
        console.error('❌ Videos fetch FAILED:', videosError);
    } else {
        console.log('✅ Videos fetch SUCCESS:', videos?.length, 'videos found');
        if (videos && videos.length > 0) {
            console.log('Sample video:', videos[0]);
        }
    }
}

testConnection();
