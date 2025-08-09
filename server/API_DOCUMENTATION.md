# NexiCart API Documentation - Product Categories

## Overview
This API supports comprehensive product management with category-based filtering and organization. The system includes the following product categories:

- Electronics
- Clothing
- Fashion
- Furniture
- Books
- Home & Garden
- Sports
- Beauty
- Toys
- Automotive
- Health
- Food
- Other

## API Endpoints

### 1. Get All Products
```
GET /api/products
```
**Description**: Retrieve all products with pagination and filtering support

**Query Parameters**:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 25)
- `category` - Filter by category
- `sort` - Sort criteria
- `search` - Search term

**Response**:
```json
{
  "success": true,
  "count": 25,
  "pagination": {
    "next": {
      "page": 2,
      "limit": 25
    }
  },
  "data": [...]
}
```

### 2. Get All Categories
```
GET /api/products/categories
```
**Description**: Get all available product categories with product counts

**Response**:
```json
{
  "success": true,
  "count": 13,
  "data": [
    {
      "category": "Electronics",
      "count": 15
    },
    {
      "category": "Fashion",
      "count": 6
    },
    {
      "category": "Furniture",
      "count": 6
    }
  ]
}
```

### 3. Get Products by Category
```
GET /api/products/category/:category
```
**Description**: Get all active products in a specific category

**Parameters**:
- `category` - Category name (case-sensitive)

**Examples**:
- `/api/products/category/Electronics`
- `/api/products/category/Furniture`
- `/api/products/category/Fashion`

**Response**:
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

### 4. Search Products
```
GET /api/products/search/:searchterm
```
**Description**: Search products across name, description, brand, and tags

**Parameters**:
- `searchterm` - Search query string

**Response**:
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

### 5. Create Product (Admin Only)
```
POST /api/products
```
**Description**: Create a new product (requires admin authentication)

**Headers**:
- `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Modern Sectional Sofa",
  "description": "Comfortable L-shaped sectional sofa...",
  "price": 1299.99,
  "discountPrice": 1099.99,
  "category": "Furniture",
  "brand": "ComfortLiving",
  "stock": 15,
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "alt": "Sectional Sofa"
    }
  ],
  "features": ["L-shaped design", "Premium fabric"],
  "specifications": {
    "Dimensions": "110\" x 85\" x 35\"",
    "Material": "Fabric upholstery"
  },
  "tags": ["sofa", "sectional", "living room"],
  "isFeatured": true
}
```

### 6. Get Homepage Sections
```
GET /api/products/homepage/hero
GET /api/products/homepage/featured
GET /api/products/homepage/new-arrivals
```
**Description**: Get products configured for homepage display sections

## Category-Specific Examples

### Furniture Products
```javascript
// Get all furniture
fetch('/api/products/category/Furniture')

// Search for specific furniture
fetch('/api/products/search/sofa')
```

### Fashion Products
```javascript
// Get all fashion items
fetch('/api/products/category/Fashion')

// Search for accessories
fetch('/api/products/search/handbag')
```

### Electronics
```javascript
// Get electronics with pagination
fetch('/api/products?category=Electronics&page=1&limit=10')
```

## Authentication

Admin-only endpoints require a Bearer token:
```javascript
fetch('/api/products', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(productData)
})
```

## Error Responses

All endpoints return standardized error responses:
```json
{
  "success": false,
  "error": "Error message description"
}
```

## Database Seeding

To populate the database with sample products across all categories:

```bash
# Seed database with sample data
npm run seed

# Clear all data
npm run seed:destroy
```

This will create:
- 3 users (1 admin, 2 regular users)
- 50+ products across all categories
- Proper category distribution
- Realistic product data with images, specifications, and ratings
