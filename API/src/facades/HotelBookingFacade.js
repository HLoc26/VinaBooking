import accommodationService from "../services/accommodation.service.js";
import bookingService from "../services/booking.service.js";
import favouriteService from "../services/favourite.service.js";
import authService from "../services/auth.service.js";
import emailService from "../services/email.service.js";

/**
 * Hotel Booking Facade - Provides a simplified interface for complex booking operations
 * This facade coordinates multiple services to perform comprehensive booking operations
 */
class HotelBookingFacade {
	/**
	 * Get comprehensive accommodation details with availability and user-specific data
	 * @param {Object} params - Parameters for accommodation details
	 * @param {number} params.accommodationId - ID of the accommodation
	 * @param {string} params.startDate - Check-in date
	 * @param {string} params.endDate - Check-out date
	 * @param {number} params.userId - User ID (optional, for favorite status)
	 * @returns {Object} Comprehensive accommodation data
	 */
	async getAccommodationDetails({ accommodationId, startDate, endDate, userId = null }) {
		try {
			// Get accommodation details
			const accommodation = await accommodationService.findById(accommodationId, startDate, endDate);

			if (!accommodation) {
				throw new Error("Accommodation not found");
			}

			// Initialize result object
			const result = {
				accommodation,
				isFavorite: false,
				recommendations: [],
			};

			// If user is provided, check if this accommodation is in their favorites
			if (userId) {
				try {
					const favouriteList = await favouriteService.findByUserId(userId);
					if (favouriteList && favouriteList.accommodations) {
						result.isFavorite = favouriteList.accommodations.some((fav) => fav.id === accommodationId);
					}
				} catch (favoriteError) {
					console.warn("Could not check favorite status:", favoriteError.message);
				}
			}

			// Get similar accommodations as recommendations
			if (accommodation.address) {
				try {
					const recommendations = await accommodationService.search({
						city: accommodation.address.split(",")[0]?.trim(),
						startDate,
						endDate,
						roomCount: 1,
						adultCount: 1,
					});

					// Filter out current accommodation and limit to 3 recommendations
					result.recommendations = recommendations.filter((rec) => rec.id !== accommodationId).slice(0, 3);
				} catch (recommendationError) {
					console.warn("Could not get recommendations:", recommendationError.message);
				}
			}

			return result;
		} catch (error) {
			console.error("Error in getAccommodationDetails:", error);
			throw error;
		}
	}

	/**
	 * Perform a comprehensive search with additional metadata
	 * @param {Object} searchCriteria - Search parameters
	 * @returns {Object} Search results with metadata
	 */
	async searchAccommodations(searchCriteria) {
		try {
			const results = await accommodationService.search(searchCriteria);

			// Add search metadata
			const searchMetadata = {
				totalResults: results.length,
				searchCriteria: {
					...searchCriteria,
					priceRange: {
						min: searchCriteria.priceMin || 0,
						max: searchCriteria.priceMax || Infinity,
					},
				},
				appliedFilters: this._getAppliedFilters(searchCriteria),
			};

			// Group results by price range for better UX
			const priceRanges = this._groupByPriceRange(results);

			return {
				results,
				metadata: searchMetadata,
				priceRanges,
				popularAccommodations: await this._getPopularInResults(results),
			};
		} catch (error) {
			console.error("Error in searchAccommodations:", error);
			throw error;
		}
	}

	/**
	 * Complete booking workflow with validation and notifications
	 * @param {Object} bookingData - Booking information
	 * @param {Object} bookingData.rooms - Room selection
	 * @param {number} bookingData.guestId - Guest user ID
	 * @param {string} bookingData.startDate - Check-in date
	 * @param {string} bookingData.endDate - Check-out date
	 * @param {number} bookingData.guestCount - Number of guests
	 * @param {string} bookingData.guestEmail - Guest email for notifications
	 * @returns {Object} Complete booking result
	 */
	async completeBooking(bookingData) {
		try {
			const { rooms, guestId, startDate, endDate, guestCount, guestEmail } = bookingData;

			// Validate user exists
			const user = await authService.findUserById(guestId);
			if (!user) {
				throw new Error("User not found");
			}

			// Perform the booking
			const booking = await bookingService.bookRoom({
				rooms,
				guestId,
				startDate,
				endDate,
				guestCount,
			});

			// Prepare booking confirmation data
			const confirmationData = {
				booking,
				guestInfo: {
					name: user.name || user.username,
					email: guestEmail || user.email,
				},
				accommodationDetails: {},
				totalAmount: this._calculateTotalAmount(booking, startDate, endDate),
			};

			// Get accommodation details for each booked room
			const accommodationIds = new Set();
			booking.bookingItems.forEach((item) => {
				if (item.room && item.room.accommodationId) {
					accommodationIds.add(item.room.accommodationId);
				}
			});

			for (const accommodationId of accommodationIds) {
				try {
					const accommodation = await accommodationService.findById(accommodationId);
					confirmationData.accommodationDetails[accommodationId] = accommodation;
				} catch (error) {
					console.warn(`Could not get accommodation details for ${accommodationId}:`, error.message);
				}
			}

			// Send confirmation email
			try {
				await this._sendBookingConfirmation(confirmationData);
			} catch (emailError) {
				console.warn("Could not send confirmation email:", emailError.message);
			}

			return {
				booking,
				confirmation: {
					bookingId: booking.id,
					status: "confirmed",
					totalAmount: confirmationData.totalAmount,
					emailSent: true,
				},
			};
		} catch (error) {
			console.error("Error in completeBooking:", error);
			throw error;
		}
	}

	/**
	 * Get user's complete booking and favorites dashboard
	 * @param {number} userId - User ID
	 * @returns {Object} User dashboard data
	 */
	async getUserDashboard(userId) {
		try {
			// Get user's favorite accommodations
			const favouriteList = await favouriteService.findByUserId(userId);

			// Get popular accommodations for recommendations
			const popularAccommodations = await accommodationService.findPopular();

			// Prepare dashboard data
			const dashboard = {
				favorites: favouriteList || { accommodations: [] },
				recommendations: popularAccommodations.slice(0, 6),
				stats: {
					totalFavorites: favouriteList?.accommodations?.length || 0,
					hasBookings: false, // This would require a booking history service
				},
			};

			return dashboard;
		} catch (error) {
			console.error("Error in getUserDashboard:", error);
			throw error;
		}
	}

	/**
	 * Manage user favorites with validation and recommendations
	 * @param {number} userId - User ID
	 * @param {number} accommodationId - Accommodation ID
	 * @param {string} action - 'add' or 'remove'
	 * @returns {Object} Updated favorites data
	 */
	async manageFavorites(userId, accommodationId, action) {
		try {
			let result;

			if (action === "add") {
				result = await favouriteService.add(userId, accommodationId);
			} else if (action === "remove") {
				result = await favouriteService.remove(userId, accommodationId);
			} else {
				throw new Error("Invalid action. Use 'add' or 'remove'");
			}

			// Get updated favorites list
			const updatedFavorites = await favouriteService.findByUserId(userId);

			// Get recommendations based on current favorites
			const recommendations = await this._getRecommendationsBasedOnFavorites(updatedFavorites);

			return {
				success: result,
				favorites: updatedFavorites,
				recommendations,
			};
		} catch (error) {
			console.error("Error in manageFavorites:", error);
			throw error;
		}
	}

	// Private helper methods

	_getAppliedFilters(criteria) {
		const filters = [];
		if (criteria.city) filters.push(`City: ${criteria.city}`);
		if (criteria.state) filters.push(`State: ${criteria.state}`);
		if (criteria.priceMin) filters.push(`Min Price: ${criteria.priceMin}`);
		if (criteria.priceMax) filters.push(`Max Price: ${criteria.priceMax}`);
		if (criteria.roomCount) filters.push(`Rooms: ${criteria.roomCount}`);
		if (criteria.adultCount) filters.push(`Adults: ${criteria.adultCount}`);
		return filters;
	}

	_groupByPriceRange(results) {
		const ranges = {
			budget: { min: 0, max: 1000000, count: 0 },
			midRange: { min: 1000000, max: 3000000, count: 0 },
			luxury: { min: 3000000, max: Infinity, count: 0 },
		};

		results.forEach((accommodation) => {
			const price = accommodation.minPrice || 0;
			if (price <= ranges.budget.max) {
				ranges.budget.count++;
			} else if (price <= ranges.midRange.max) {
				ranges.midRange.count++;
			} else {
				ranges.luxury.count++;
			}
		});

		return ranges;
	}

	async _getPopularInResults(results) {
		try {
			const popular = await accommodationService.findPopular();
			const resultIds = new Set(results.map((r) => r.id));
			return popular.filter((p) => resultIds.has(p.id)).slice(0, 3);
		} catch (error) {
			console.warn("Could not get popular accommodations:", error.message);
			return [];
		}
	}

	_calculateTotalAmount(booking, startDate, endDate) {
		const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
		let total = 0;

		booking.bookingItems.forEach((item) => {
			if (item.room && item.room.price) {
				total += item.room.price * item.count * days;
			}
		});

		return total;
	}

	async _sendBookingConfirmation(confirmationData) {
		const { guestInfo, booking, totalAmount } = confirmationData;

		// This would integrate with the email service
		// For now, we'll just log the action
		console.log(`Sending booking confirmation to ${guestInfo.email} for booking ${booking.id}`);

		// In a real implementation, this would call:
		// await emailService.sendBookingConfirmation({
		//     to: guestInfo.email,
		//     booking,
		//     totalAmount,
		//     guestName: guestInfo.name
		// });
	}

	async _getRecommendationsBasedOnFavorites(favouriteList) {
		if (!favouriteList || !favouriteList.accommodations || favouriteList.accommodations.length === 0) {
			return await accommodationService.findPopular().then((popular) => popular.slice(0, 3));
		}

		// Get popular accommodations as recommendations
		const popular = await accommodationService.findPopular();
		const favoriteIds = new Set(favouriteList.accommodations.map((fav) => fav.id));

		return popular.filter((acc) => !favoriteIds.has(acc.id)).slice(0, 3);
	}
}

export default new HotelBookingFacade();
