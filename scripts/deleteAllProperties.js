const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function deleteAllProperties() {
  try {
    console.log('🔐 Authenticating with admin account...');

    // Login as admin
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });

    const { token } = await loginResponse.json();
    console.log('✓ Admin logged in successfully\n');

    // Get all properties
    console.log('📋 Fetching all properties...');
    const propsResponse = await fetch(`${API_URL}/property/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const propsData = await propsResponse.json();
    const properties = propsData.properties || [];

    console.log(`Found ${properties.length} properties\n`);

    if (properties.length === 0) {
      console.log('No properties to delete.');
      return;
    }

    // Delete each property
    console.log('🗑️  Deleting properties...\n');
    let deleted = 0;
    let failed = 0;

    for (const property of properties) {
      try {
        const deleteResponse = await fetch(`${API_URL}/property/${property._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (deleteResponse.ok) {
          console.log(`✓ Deleted: ${property.propertyName || property.title || property._id}`);
          deleted++;
        } else {
          console.log(`✗ Failed to delete: ${property._id}`);
          failed++;
        }
      } catch (error) {
        console.log(`✗ Error deleting ${property._id}: ${error.message}`);
        failed++;
      }

      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n✅ Deletion complete!`);
    console.log(`   Total deleted: ${deleted}`);
    console.log(`   Total failed: ${failed}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

deleteAllProperties();
