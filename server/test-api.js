const axios = require('axios');

// Test the new API endpoints
async function testAPI() {
  const baseURL = 'http://localhost:5000/api/products';
  
  try {
    console.log('🧪 Testing NexiCart API Endpoints...\n');
    
    // Test 1: Get all categories
    console.log('1. Testing /api/products/categories');
    try {
      const categoriesResponse = await axios.get(`${baseURL}/categories`);
      console.log('✅ Categories endpoint working!');
      console.log(`   Found ${categoriesResponse.data.count} categories:`);
      categoriesResponse.data.data.forEach(cat => {
        console.log(`   - ${cat.category}: ${cat.count} products`);
      });
    } catch (error) {
      console.log('❌ Categories endpoint failed:', error.message);
    }
    
    console.log('\n');
    
    // Test 2: Get products by specific categories
    const testCategories = ['Furniture', 'Fashion', 'Electronics'];
    
    for (const category of testCategories) {
      console.log(`2. Testing /api/products/category/${category}`);
      try {
        const categoryResponse = await axios.get(`${baseURL}/category/${category}`);
        console.log(`✅ ${category} endpoint working!`);
        console.log(`   Found ${categoryResponse.data.count} ${category.toLowerCase()} products`);
        
        if (categoryResponse.data.count > 0) {
          const firstProduct = categoryResponse.data.data[0];
          console.log(`   Sample product: "${firstProduct.name}" - $${firstProduct.price}`);
        }
      } catch (error) {
        console.log(`❌ ${category} endpoint failed:`, error.message);
      }
      console.log('');
    }
    
    // Test 3: Search functionality
    const searchTerms = ['sofa', 'handbag', 'phone'];
    
    for (const term of searchTerms) {
      console.log(`3. Testing search for "${term}"`);
      try {
        const searchResponse = await axios.get(`${baseURL}/search/${term}`);
        console.log(`✅ Search for "${term}" working!`);
        console.log(`   Found ${searchResponse.data.count} products matching "${term}"`);
        
        if (searchResponse.data.count > 0) {
          const firstResult = searchResponse.data.data[0];
          console.log(`   Top result: "${firstResult.name}" in ${firstResult.category}`);
        }
      } catch (error) {
        console.log(`❌ Search for "${term}" failed:`, error.message);
      }
      console.log('');
    }
    
    // Test 4: Get all products with pagination
    console.log('4. Testing /api/products with pagination');
    try {
      const allProductsResponse = await axios.get(`${baseURL}?limit=5`);
      console.log('✅ All products endpoint working!');
      console.log(`   Retrieved ${allProductsResponse.data.count} products (limited to 5)`);
      console.log('   Sample products:');
      allProductsResponse.data.data.slice(0, 3).forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.category}) - $${product.price}`);
      });
    } catch (error) {
      console.log('❌ All products endpoint failed:', error.message);
    }
    
    console.log('\n🎉 API Testing Complete!\n');
    
  } catch (error) {
    console.error('❌ General error during testing:', error.message);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testAPI().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Test script error:', error);
    process.exit(1);
  });
}

module.exports = testAPI;
