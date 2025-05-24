import accommodationService from "../services/accommodation.service.js";
import favouriteService from "../services/favourite.service.js";

/**
 * Search and Discovery Facade - Provides intelligent search and recommendation features
 * This facade combines search functionality with smart filtering and personalized recommendations
 */
class SearchDiscoveryFacade {
	/**
	 * Intelligent accommodation search with filters and smart suggestions
	 * @param {Object} searchParams - Search parameters
	 * @param {string} searchParams.query - General search query (optional)
	 * @param {string} searchParams.city - City name
	 * @param {string} searchParams.state - State/province
	 * @param {string} searchParams.postalCode - Postal code
	 * @param {string} searchParams.startDate - Check-in date
	 * @param {string} searchParams.endDate - Check-out date
	 * @param {number} searchParams.roomCount - Number of rooms
	 * @param {number} searchParams.adultCount - Number of adults
	 * @param {number} searchParams.priceMin - Minimum price
	 * @param {number} searchParams.priceMax - Maximum price
	 * @param {Array} searchParams.amenities - Preferred amenities
	 * @param {number} searchParams.minRating - Minimum rating
	 * @param {string} searchParams.sortBy - Sort criteria
	 * @param {number} searchParams.userId - User ID for personalization (optional)
	 * @returns {Object} Enhanced search results with metadata and suggestions
	 */
	async intelligentSearch(searchParams) {
		try {
			const { query, city, state, postalCode, startDate, endDate, roomCount = 1, adultCount = 1, priceMin, priceMax, amenities = [], minRating, sortBy = "relevance", userId } = searchParams;

			// Perform basic search
			const searchResults = await accommodationService.search({
				city,
				state,
				postalCode,
				startDate,
				endDate,
				roomCount,
				adultCount,
				priceMin,
				priceMax,
			});

			// Apply additional filters
			let filteredResults = this._applyAdvancedFilters(searchResults, {
				amenities,
				minRating,
				query,
			});

			// Apply sorting
			filteredResults = this._applySorting(filteredResults, sortBy);

			// Get user preferences for personalization
			let userPreferences = null;
			if (userId) {
				userPreferences = await this._getUserPreferences(userId);
				filteredResults = this._personalizeResults(filteredResults, userPreferences);
			}

			// Generate search metadata
			const searchMetadata = this._generateSearchMetadata(searchParams, filteredResults, searchResults.length);

			// Get related suggestions
			const suggestions = await this._getSearchSuggestions(searchParams, filteredResults);

			// Group results for better presentation
			const groupedResults = this._groupSearchResults(filteredResults);

			return {
				results: filteredResults,
				originalResultCount: searchResults.length,
				filteredResultCount: filteredResults.length,
				metadata: searchMetadata,
				suggestions,
				groupedResults,
				userPreferences,
				pagination: this._generatePagination(filteredResults, searchParams.page, searchParams.limit),
			};
		} catch (error) {
			console.error("Error in intelligentSearch:", error);
			throw error;
		}
	}

	/**
	 * Get personalized recommendations for a user
	 * @param {number} userId - User ID
	 * @param {Object} preferences - Additional preference context
	 * @returns {Object} Personalized recommendations
	 */
	async getPersonalizedRecommendations(userId, preferences = {}) {
		try {
			// Get user's favorite accommodations to understand preferences
			const userFavorites = await favouriteService.findByUserId(userId);

			// Get popular accommodations as base recommendations
			const popularAccommodations = await accommodationService.findPopular();

			// Analyze user preferences from favorites
			const userPreferences = this._analyzeUserPreferences(userFavorites);

			// Generate different types of recommendations
			const recommendations = {
				trending: await this._getTrendingRecommendations(),
				basedOnFavorites: this._getRecommendationsBasedOnFavorites(popularAccommodations, userFavorites),
				priceBasedSuggestions: this._getPriceBasedSuggestions(popularAccommodations, userPreferences),
				locationBasedSuggestions: this._getLocationBasedSuggestions(popularAccommodations, userPreferences),
				newListings: await this._getNewListings(),
				seasonalPicks: this._getSeasonalRecommendations(popularAccommodations),
			};

			return {
				recommendations,
				userPreferences,
				totalRecommendations: Object.values(recommendations).reduce((total, category) => total + category.length, 0),
			};
		} catch (error) {
			console.error("Error in getPersonalizedRecommendations:", error);
			throw error;
		}
	}

	/**
	 * Get autocomplete suggestions for search
	 * @param {string} query - Partial search query
	 * @param {string} type - Type of suggestion ('location', 'accommodation', 'amenity')
	 * @returns {Array} Autocomplete suggestions
	 */
	async getAutocompleteSuggestions(query, type = "location") {
		try {
			if (!query || query.length < 2) {
				return [];
			}

			// This would typically query a dedicated search index
			// For now, we'll provide mock suggestions based on the type
			const suggestions = await this._generateAutocompleteSuggestions(query, type);

			return {
				suggestions,
				query,
				type,
			};
		} catch (error) {
			console.error("Error in getAutocompleteSuggestions:", error);
			return [];
		}
	}

	/**
	 * Get search filters and facets for the UI
	 * @param {Object} searchContext - Current search context
	 * @returns {Object} Available filters and their options
	 */
	async getSearchFilters(searchContext = {}) {
		try {
			// Get popular accommodations to analyze available filters
			const accommodations = await accommodationService.findPopular();

			// Generate filter options based on available data
			const filters = {
				priceRanges: this._generatePriceRangeFilters(accommodations),
				amenities: this._getAvailableAmenities(accommodations),
				ratings: this._generateRatingFilters(),
				accommodationTypes: this._getAccommodationTypes(accommodations),
				locations: this._getPopularLocations(accommodations),
				sortOptions: this._getSortOptions(),
			};

			return {
				filters,
				context: searchContext,
			};
		} catch (error) {
			console.error("Error in getSearchFilters:", error);
			throw error;
		}
	}

	// Private helper methods

	_applyAdvancedFilters(results, filters) {
		const { amenities, minRating, query } = filters;

		return results.filter((accommodation) => {
			// Filter by amenities
			if (amenities.length > 0) {
				const accommodationAmenities = accommodation.amenities || [];
				const hasRequiredAmenities = amenities.some((amenity) => accommodationAmenities.some((accAmenity) => accAmenity.name?.toLowerCase().includes(amenity.toLowerCase())));
				if (!hasRequiredAmenities) return false;
			}

			// Filter by minimum rating
			if (minRating && accommodation.rating < minRating) {
				return false;
			}

			// Filter by general query
			if (query) {
				const searchText = `${accommodation.name} ${accommodation.address}`.toLowerCase();
				if (!searchText.includes(query.toLowerCase())) {
					return false;
				}
			}

			return true;
		});
	}

	_applySorting(results, sortBy) {
		switch (sortBy) {
			case "price_low":
				return results.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
			case "price_high":
				return results.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
			case "rating":
				return results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
			case "name":
				return results.sort((a, b) => a.name.localeCompare(b.name));
			case "relevance":
			default:
				return results;
		}
	}

	async _getUserPreferences(userId) {
		try {
			const favorites = await favouriteService.findByUserId(userId);
			return this._analyzeUserPreferences(favorites);
		} catch (error) {
			return null;
		}
	}

	_analyzeUserPreferences(userFavorites) {
		if (!userFavorites || !userFavorites.accommodations) {
			return {
				preferredAmenities: [],
				preferredPriceRange: { min: 0, max: Infinity },
				preferredLocations: [],
				preferredRating: 0,
			};
		}

		const accommodations = userFavorites.accommodations;
		const amenityCount = {};
		const locationCount = {};
		const prices = [];
		const ratings = [];

		accommodations.forEach((acc) => {
			// Count amenities
			if (acc.amenities) {
				acc.amenities.forEach((amenity) => {
					amenityCount[amenity.name] = (amenityCount[amenity.name] || 0) + 1;
				});
			}

			// Count locations
			if (acc.address) {
				const location = acc.address.split(",")[0]?.trim();
				if (location) {
					locationCount[location] = (locationCount[location] || 0) + 1;
				}
			}

			// Collect prices and ratings
			if (acc.minPrice) prices.push(acc.minPrice);
			if (acc.rating) ratings.push(acc.rating);
		});

		return {
			preferredAmenities: Object.entries(amenityCount)
				.sort(([, a], [, b]) => b - a)
				.slice(0, 5)
				.map(([amenity]) => amenity),
			preferredPriceRange: {
				min: prices.length > 0 ? Math.min(...prices) : 0,
				max: prices.length > 0 ? Math.max(...prices) : Infinity,
			},
			preferredLocations: Object.entries(locationCount)
				.sort(([, a], [, b]) => b - a)
				.slice(0, 3)
				.map(([location]) => location),
			preferredRating: ratings.length > 0 ? ratings.reduce((a, b) => a + b) / ratings.length : 0,
		};
	}

	_personalizeResults(results, userPreferences) {
		if (!userPreferences) return results;

		return results
			.map((accommodation) => {
				let personalizedScore = 0;

				// Score based on preferred amenities
				if (userPreferences.preferredAmenities.length > 0 && accommodation.amenities) {
					const matchingAmenities = accommodation.amenities.filter((amenity) => userPreferences.preferredAmenities.includes(amenity.name));
					personalizedScore += matchingAmenities.length * 2;
				}

				// Score based on preferred price range
				if (accommodation.minPrice >= userPreferences.preferredPriceRange.min && accommodation.minPrice <= userPreferences.preferredPriceRange.max) {
					personalizedScore += 3;
				}

				// Score based on preferred locations
				if (accommodation.address && userPreferences.preferredLocations.length > 0) {
					const location = accommodation.address.split(",")[0]?.trim();
					if (userPreferences.preferredLocations.includes(location)) {
						personalizedScore += 3;
					}
				}

				return {
					...accommodation,
					personalizedScore,
				};
			})
			.sort((a, b) => (b.personalizedScore || 0) - (a.personalizedScore || 0));
	}

	_generateSearchMetadata(searchParams, results, originalCount) {
		return {
			searchQuery: {
				location: [searchParams.city, searchParams.state].filter(Boolean).join(", "),
				dates: searchParams.startDate && searchParams.endDate ? `${searchParams.startDate} to ${searchParams.endDate}` : null,
				guests: `${searchParams.adultCount || 1} adult${(searchParams.adultCount || 1) > 1 ? "s" : ""}`,
				rooms: `${searchParams.roomCount || 1} room${(searchParams.roomCount || 1) > 1 ? "s" : ""}`,
			},
			resultStats: {
				total: results.length,
				filtered: originalCount - results.length,
				priceRange:
					results.length > 0
						? {
								min: Math.min(...results.map((r) => r.minPrice || 0)),
								max: Math.max(...results.map((r) => r.minPrice || 0)),
						  }
						: null,
			},
			appliedFilters: this._getAppliedFiltersFromParams(searchParams),
		};
	}

	async _getSearchSuggestions(searchParams, results) {
		// Generate suggestions based on search results and params
		const suggestions = {
			relatedLocations: this._getRelatedLocations(searchParams, results),
			priceAdjustments: this._getPriceAdjustmentSuggestions(searchParams, results),
			dateAlternatives: this._getDateAlternatives(searchParams),
			guestCountAlternatives: this._getGuestCountAlternatives(searchParams),
		};

		return suggestions;
	}

	_groupSearchResults(results) {
		const groups = {
			luxury: results.filter((r) => (r.minPrice || 0) > 3000000),
			midRange: results.filter((r) => (r.minPrice || 0) > 1000000 && (r.minPrice || 0) <= 3000000),
			budget: results.filter((r) => (r.minPrice || 0) <= 1000000),
			highRated: results.filter((r) => (r.rating || 0) >= 4.5),
			newListings: results.slice(-5), // Assume last 5 are newest
		};

		return groups;
	}

	_generatePagination(results, page = 1, limit = 20) {
		const totalPages = Math.ceil(results.length / limit);
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;

		return {
			currentPage: page,
			totalPages,
			totalResults: results.length,
			resultsPerPage: limit,
			hasNextPage: page < totalPages,
			hasPreviousPage: page > 1,
			paginatedResults: results.slice(startIndex, endIndex),
		};
	}

	async _getTrendingRecommendations() {
		try {
			const popular = await accommodationService.findPopular();
			return popular.slice(0, 6);
		} catch (error) {
			return [];
		}
	}

	_getRecommendationsBasedOnFavorites(accommodations, userFavorites) {
		if (!userFavorites || !userFavorites.accommodations) {
			return accommodations.slice(0, 4);
		}

		const favoriteIds = new Set(userFavorites.accommodations.map((fav) => fav.id));
		return accommodations.filter((acc) => !favoriteIds.has(acc.id)).slice(0, 4);
	}

	_getPriceBasedSuggestions(accommodations, userPreferences) {
		if (!userPreferences?.preferredPriceRange) {
			return accommodations.slice(0, 4);
		}

		const { min, max } = userPreferences.preferredPriceRange;
		return accommodations.filter((acc) => acc.minPrice >= min * 0.8 && acc.minPrice <= max * 1.2).slice(0, 4);
	}

	_getLocationBasedSuggestions(accommodations, userPreferences) {
		if (!userPreferences?.preferredLocations?.length) {
			return accommodations.slice(0, 4);
		}

		return accommodations
			.filter((acc) => {
				if (!acc.address) return false;
				const location = acc.address.split(",")[0]?.trim();
				return userPreferences.preferredLocations.includes(location);
			})
			.slice(0, 4);
	}

	async _getNewListings() {
		try {
			const popular = await accommodationService.findPopular();
			// In a real implementation, this would filter by creation date
			return popular.slice(-4);
		} catch (error) {
			return [];
		}
	}

	_getSeasonalRecommendations(accommodations) {
		// This would typically consider seasonal factors
		// For now, return a random subset
		return accommodations.slice(0, 4);
	}

	async _generateAutocompleteSuggestions(query, type) {
		// Mock autocomplete suggestions
		const locationSuggestions = ["Ho Chi Minh City", "Hanoi", "Da Nang", "Hoi An", "Nha Trang", "Phu Quoc", "Dalat", "Hue"];

		const amenitySuggestions = ["WiFi", "Pool", "Gym", "Spa", "Parking", "Restaurant", "Bar", "Beach Access"];

		if (type === "location") {
			return locationSuggestions.filter((loc) => loc.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
		}

		if (type === "amenity") {
			return amenitySuggestions.filter((amenity) => amenity.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
		}

		return [];
	}

	_generatePriceRangeFilters(accommodations) {
		return [
			{ label: "Budget (Under 1M VND)", min: 0, max: 1000000 },
			{ label: "Mid-range (1M - 3M VND)", min: 1000000, max: 3000000 },
			{ label: "Luxury (3M+ VND)", min: 3000000, max: Infinity },
		];
	}

	_getAvailableAmenities(accommodations) {
		const amenitySet = new Set();
		accommodations.forEach((acc) => {
			if (acc.amenities) {
				acc.amenities.forEach((amenity) => amenitySet.add(amenity.name));
			}
		});
		return Array.from(amenitySet).slice(0, 10);
	}

	_generateRatingFilters() {
		return [
			{ label: "4.5+ Stars", value: 4.5 },
			{ label: "4.0+ Stars", value: 4.0 },
			{ label: "3.5+ Stars", value: 3.5 },
			{ label: "3.0+ Stars", value: 3.0 },
		];
	}

	_getAccommodationTypes(accommodations) {
		// This would typically come from accommodation categories
		return ["Hotel", "Resort", "Apartment", "Villa", "Hostel"];
	}

	_getPopularLocations(accommodations) {
		const locationCount = {};
		accommodations.forEach((acc) => {
			if (acc.address) {
				const location = acc.address.split(",")[0]?.trim();
				if (location) {
					locationCount[location] = (locationCount[location] || 0) + 1;
				}
			}
		});

		return Object.entries(locationCount)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 8)
			.map(([location]) => location);
	}

	_getSortOptions() {
		return [
			{ value: "relevance", label: "Most Relevant" },
			{ value: "price_low", label: "Price: Low to High" },
			{ value: "price_high", label: "Price: High to Low" },
			{ value: "rating", label: "Highest Rated" },
			{ value: "name", label: "Name A-Z" },
		];
	}

	_getAppliedFiltersFromParams(params) {
		const filters = [];
		if (params.priceMin) filters.push(`Min Price: ${params.priceMin}`);
		if (params.priceMax) filters.push(`Max Price: ${params.priceMax}`);
		if (params.minRating) filters.push(`Min Rating: ${params.minRating}`);
		if (params.amenities?.length) filters.push(`Amenities: ${params.amenities.join(", ")}`);
		return filters;
	}

	_getRelatedLocations(searchParams, results) {
		// Extract unique locations from results
		const locations = new Set();
		results.forEach((result) => {
			if (result.address) {
				const location = result.address.split(",")[0]?.trim();
				if (location && location !== searchParams.city) {
					locations.add(location);
				}
			}
		});
		return Array.from(locations).slice(0, 3);
	}

	_getPriceAdjustmentSuggestions(searchParams, results) {
		if (results.length === 0) {
			return {
				suggestion: "Try increasing your price range",
				adjustedRange: {
					min: (searchParams.priceMin || 0) * 0.8,
					max: (searchParams.priceMax || Infinity) * 1.5,
				},
			};
		}
		return null;
	}

	_getDateAlternatives(searchParams) {
		if (!searchParams.startDate || !searchParams.endDate) {
			return [];
		}

		const start = new Date(searchParams.startDate);
		const end = new Date(searchParams.endDate);
		const alternatives = [];

		// Suggest dates 1 week earlier and later
		const weekEarlier = new Date(start);
		weekEarlier.setDate(weekEarlier.getDate() - 7);
		const weekLater = new Date(start);
		weekLater.setDate(weekLater.getDate() + 7);

		alternatives.push({
			label: "One week earlier",
			startDate: weekEarlier.toISOString().split("T")[0],
			endDate: new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
		});

		alternatives.push({
			label: "One week later",
			startDate: weekLater.toISOString().split("T")[0],
			endDate: new Date(end.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
		});

		return alternatives;
	}

	_getGuestCountAlternatives(searchParams) {
		const alternatives = [];
		const currentAdults = searchParams.adultCount || 1;

		if (currentAdults > 1) {
			alternatives.push({
				label: `${currentAdults - 1} adult${currentAdults - 1 > 1 ? "s" : ""}`,
				adultCount: currentAdults - 1,
			});
		}

		alternatives.push({
			label: `${currentAdults + 1} adults`,
			adultCount: currentAdults + 1,
		});

		return alternatives;
	}
}

export default new SearchDiscoveryFacade();
