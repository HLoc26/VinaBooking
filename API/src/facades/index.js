/**
 * Facades Index - Central export point for all facade implementations
 *
 * The Facade Design Pattern provides a simplified interface to complex subsystems.
 * These facades coordinate multiple services and provide high-level business operations.
 */

import HotelBookingFacade from "./HotelBookingFacade.js";
import UserManagementFacade from "./UserManagementFacade.js";
import SearchDiscoveryFacade from "./SearchDiscoveryFacade.js";

export { HotelBookingFacade, UserManagementFacade, SearchDiscoveryFacade };

/**
 * Default export for convenience when importing all facades
 */
export default {
	HotelBookingFacade,
	UserManagementFacade,
	SearchDiscoveryFacade,
};

/**
 * Facade Pattern Benefits in this implementation:
 *
 * 1. Simplified Interface: Complex operations involving multiple services
 *    are simplified into single method calls
 *
 * 2. Loose Coupling: Controllers don't need to know about multiple service
 *    dependencies, they only interact with facades
 *
 * 3. Centralized Business Logic: Complex workflows are centralized in
 *    facade methods, making them easier to maintain
 *
 * 4. Enhanced User Experience: Facades provide comprehensive operations
 *    like getting accommodation details with favorites status and recommendations
 *
 * 5. Error Handling: Facades can handle errors gracefully and provide
 *    fallback behavior when some services fail
 *
 * Usage Examples:
 *
 * // Hotel Booking Operations
 * const accommodationDetails = await HotelBookingFacade.getAccommodationDetails({
 *     accommodationId: 1,
 *     startDate: '2024-06-01',
 *     endDate: '2024-06-05',
 *     userId: 123
 * });
 *
 * // User Management Operations
 * const userProfile = await UserManagementFacade.getUserProfile(123);
 *
 * // Search and Discovery Operations
 * const searchResults = await SearchDiscoveryFacade.intelligentSearch({
 *     city: 'Ho Chi Minh City',
 *     startDate: '2024-06-01',
 *     endDate: '2024-06-05',
 *     adultCount: 2,
 *     userId: 123
 * });
 */
