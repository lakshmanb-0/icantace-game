# API Endpoints Documentation

## 🎮 Complete CRUD Modules Implementation

This document provides an overview of all the newly implemented CRUD modules for User, Review, and UserGameList.

---

## 👤 User Module (`/users`)

### Endpoints:

- **POST** `/users` - Create a new user
  - Body: `{ username, email, password }`
  - Returns: Created user (without password)

- **GET** `/users` - Get all users (paginated)
  - Query params: `page` (default: 1), `limit` (default: 10)
  - Returns: `{ users, total, page, totalPages }`

- **GET** `/users/:id` - Get a user by ID
  - Returns: User details (without password)

- **GET** `/users/username/:username` - Get a user by username
  - Returns: User details (without password)

- **GET** `/users/:id/stats` - Get user statistics
  - Returns: User info + stats (reviews, favorites, want-to-play, viewed)

- **PATCH** `/users/:id` - Update a user
  - Body: `{ username?, email?, password? }`
  - Returns: Updated user

- **DELETE** `/users/:id` - Delete a user
  - Returns: 204 No Content

### Features:

- ✅ Username and email uniqueness validation
- ✅ Password handling (ready for bcrypt integration)
- ✅ Pagination support
- ✅ User statistics endpoint
- ✅ Proper indexes on email and username

---

## ⭐ Review Module (`/reviews`)

### Endpoints:

- **POST** `/reviews` - Create a new review
  - Body: `{ gameId, createdBy, isRecommended, content }`
  - Returns: Created review

- **GET** `/reviews` - Get all reviews (paginated & filtered)
  - Query params: `page`, `limit`, `gameId`, `userId`, `isRecommended`
  - Returns: `{ reviews, total, page, totalPages }`

- **GET** `/reviews/:id` - Get a review by ID
  - Returns: Review with populated game and user data

- **GET** `/reviews/game/:gameId` - Get all reviews for a specific game
  - Query params: `page`, `limit`
  - Returns: Paginated game reviews

- **GET** `/reviews/game/:gameId/stats` - Get review statistics for a game
  - Returns: `{ total, recommended, notRecommended, recommendationRate }`

- **GET** `/reviews/user/:userId` - Get all reviews by a specific user
  - Query params: `page`, `limit`
  - Returns: Paginated user reviews

- **PATCH** `/reviews/:id` - Update a review (only by owner)
  - Query params: `userId` (for authorization)
  - Body: `{ isRecommended?, content? }`
  - Returns: Updated review

- **POST** `/reviews/:id/helpful` - Mark review as helpful/unhelpful
  - Query params: `userId`
  - Returns: Updated review

- **DELETE** `/reviews/:id` - Delete a review (only by owner)
  - Query params: `userId` (for authorization)
  - Returns: 204 No Content

### Features:

- ✅ Prevent duplicate reviews (user can only review a game once)
- ✅ Owner-only update/delete with authorization checks
- ✅ Helpful/unhelpful toggle functionality
- ✅ Game statistics (recommendation rate)
- ✅ Proper indexes including compound unique index
- ✅ Population of related game and user data

---

## 📚 UserGameList Module (`/user-game-lists`)

Unified module for managing favorite games, want-to-play list, and viewed games.

### Endpoints:

- **POST** `/user-game-lists` - Add a game to a user list
  - Body: `{ gameId, createdBy?, type: 'favorite' | 'want_to_play' | 'viewed' }`
  - Returns: Created entry

- **GET** `/user-game-lists` - Get all entries (paginated & filtered)
  - Query params: `page`, `limit`, `type`, `userId`, `gameId`
  - Returns: `{ items, total, page, totalPages }`

- **GET** `/user-game-lists/user/:userId/favorites` - Get user's favorite games
  - Query params: `page`, `limit`
  - Returns: Paginated favorites

- **GET** `/user-game-lists/user/:userId/want-to-play` - Get user's want-to-play games
  - Query params: `page`, `limit`
  - Returns: Paginated want-to-play list

- **GET** `/user-game-lists/user/:userId/viewed` - Get user's viewed games
  - Query params: `page`, `limit`
  - Returns: Paginated viewed games

- **GET** `/user-game-lists/user/:userId/stats` - Get user statistics
  - Returns: `{ userId, favorites, wantToPlay, viewed }`

- **GET** `/user-game-lists/game/:gameId/stats` - Get game statistics
  - Returns: `{ gameId, views, favorites, wantToPlay }`

- **GET** `/user-game-lists/check/:userId/:gameId` - Check game status for a user
  - Returns: `{ isFavorite, isWantToPlay, hasViewed }`

- **GET** `/user-game-lists/:id` - Get a specific entry by ID
  - Returns: Entry with populated game and user data

- **PATCH** `/user-game-lists/:id` - Update an entry (e.g., change type)
  - Body: `{ type? }`
  - Returns: Updated entry

- **DELETE** `/user-game-lists/:id` - Remove an entry by ID
  - Returns: 204 No Content

- **DELETE** `/user-game-lists/user/:userId/game/:gameId/:type` - Remove by user, game, and type
  - Returns: 204 No Content

### Features:

- ✅ Three types in one schema: FAVORITE, WANT_TO_PLAY, VIEWED
- ✅ Optional user (supports anonymous views)
- ✅ Prevent duplicate entries (unique constraint)
- ✅ Quick status check endpoint
- ✅ Statistics for both users and games
- ✅ Proper indexes including compound unique index
- ✅ Type-specific filtering

---

## 🔧 Configuration

### Database Indexes:

**User Schema:**

- Unique index on `email`
- Unique index on `username`

**Review Schema:**

- Index on `gameId`
- Index on `createdBy`
- Index on `isRecommended`
- Index on `isHelpful`
- Index on `createdAt` (for sorting)
- Compound unique index on `gameId + createdBy` (prevent duplicates)

**UserGameList Schema:**

- Index on `gameId`
- Index on `createdBy`
- Index on `type`
- Compound unique index on `createdBy + gameId + type` (prevent duplicates)

### Validation:

All endpoints use `class-validator` for request validation:

- Email format validation
- Minimum length requirements
- Required field validation
- Enum validation for types
- MongoDB ObjectId validation

---

## 🚀 Quick Start

1. **Start the server:**

   ```bash
   cd backend
   npm run start:dev
   ```

2. **Access Swagger Documentation:**
   Open: `http://localhost:3000/api`

3. **Test the endpoints:**
   All endpoints are documented in Swagger with examples and can be tested directly from the UI.

---

## 📝 Notes

- All list endpoints support pagination (default: page=1, limit=10)
- All endpoints return properly formatted responses with appropriate status codes
- Population of related documents (Game, User) is done automatically
- Authorization is currently done via query parameters (ready for JWT integration)
- Password storage is ready for bcrypt hashing (marked with TODO comments)

---

## 🎯 Next Steps

Consider implementing:

1. JWT Authentication middleware
2. Password hashing with bcrypt
3. Rate limiting
4. Caching with Redis
5. Full-text search
6. Image upload support
7. Email notifications
8. Advanced filtering and sorting options
