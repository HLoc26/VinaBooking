## FACADE 101

### Before

```
Controller → Service1 + Service2 + Service3 + Service4
```

### After

```
Controller → Facade → Service1 + Service2 + Service3 + Service4
```

### 1. Facades Created

#### `HotelBookingFacade`

**Purpose**: Provides a simplified interface for complex booking operations, accommodation details, and comprehensive search results.

**Key Methods**:

-   `getAccommodationDetails({ accommodationId, startDate, endDate, userId })` - Gets comprehensive accommodation details with availability and user-specific data
-   `searchAccommodations(searchCriteria)` - Performs comprehensive search with additional metadata
-   `completeBooking(bookingData)` - Complete booking workflow with validation and notifications
-   `getUserDashboard(userId)` - Gets user's complete booking and favorites dashboard
-   `manageFavorites(userId, accommodationId, action)` - Manages user favorites with validation and recommendations

#### `UserManagementFacade`

**Purpose**: Handles user registration, login, profile management, password changes, and account deletion with email notifications.

**Key Methods**:

-   `registerUser(userData)` - Complete user registration with validation and verification
-   `loginUser({ email, password, rememberMe })` - Enhanced login with session management
-   `getUserProfile(userId)` - Gets comprehensive user profile with preferences
-   `updateUserProfile(userId, updateData)` - Updates user profile with validation
-   `changePassword(userId, currentPassword, newPassword)` - Changes password with security checks
-   `deleteAccount(userId, password)` - Deletes user account with data cleanup and confirmation

#### `SearchDiscoveryFacade`

**Purpose**: Implements intelligent search with filtering, personalized recommendations, autocomplete suggestions, and search metadata.

**Key Methods**:

-   `intelligentSearch(searchCriteria)` - Enhanced search with smart filtering and recommendations
-   `getPersonalizedRecommendations(userId)` - Gets personalized recommendations based on user preferences
-   `getAutocompleteSuggestions(query, type)` - Provides autocomplete suggestions for search
-   `getSearchFilters(accommodations)` - Generates dynamic search filters

### 2. Controllers Updated

#### `accommodation.controller.js`

-   **Modified methods**: `getAccommodationDetails`, `searchAccommodations`
-   **Benefits**: Enhanced search capabilities with personalized recommendations and comprehensive accommodation details

#### `booking.controller.js`

-   **Modified methods**: `bookRoom`
-   **Benefits**: Complete booking workflow with email notifications and enhanced validation

#### `favourite.controller.js`

-   **Modified methods**: `getFavouriteList`, `addToFavourite`, `removeFromFavourite`
-   **Benefits**: Comprehensive dashboard data and enhanced favorite management with recommendations

#### `auth.controller.js`

-   **Modified methods**: `login`, `initiateRegistration`, `getCurrentUser`
-   **Benefits**: Enhanced authentication with user preferences and comprehensive profile management

## Usage Examples

### Hotel Booking Operations

```javascript
// Get comprehensive accommodation details
const accommodationDetails = await HotelBookingFacade.getAccommodationDetails({
	accommodationId: 1,
	startDate: "2024-06-01",
	endDate: "2024-06-05",
	userId: 123,
});

// Complete booking with notifications
const booking = await HotelBookingFacade.completeBooking({
	rooms: [{ roomId: 1, count: 2 }],
	guestId: 123,
	startDate: "2024-06-01",
	endDate: "2024-06-05",
	guestCount: 4,
	guestEmail: "guest@example.com",
});

// Manage favorites
const result = await HotelBookingFacade.manageFavorites(123, 1, "add");
```

### User Management Operations

```javascript
// Enhanced user registration
const registration = await UserManagementFacade.registerUser({
	name: "John Doe",
	email: "john@example.com",
	password: "password123",
	phone: "+1234567890",
});

// Enhanced login with preferences
const login = await UserManagementFacade.loginUser({
	email: "john@example.com",
	password: "password123",
	rememberMe: true,
});

// Get comprehensive user profile
const profile = await UserManagementFacade.getUserProfile(123);
```

### Search and Discovery Operations

```javascript
// Intelligent search with recommendations
const searchResults = await SearchDiscoveryFacade.intelligentSearch({
	city: "Ho Chi Minh City",
	startDate: "2024-06-01",
	endDate: "2024-06-05",
	adultCount: 2,
	userId: 123,
});

// Get personalized recommendations
const recommendations = await SearchDiscoveryFacade.getPersonalizedRecommendations(123);

// Get autocomplete suggestions
const suggestions = await SearchDiscoveryFacade.getAutocompleteSuggestions("Ho Chi", "city");
```
