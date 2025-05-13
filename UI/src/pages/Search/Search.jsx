import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Container } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../app/axios";
import HotelCard from "../../components/ui/HotelCard/HotelCard";
import SearchBar from "../../components/ui/SearchBar/SearchBar";
import FilterBox from "../../components/ui/FilterBox/FilterBox";
import Navbar from "../../components/layout/NavBar/NavBar";
import Footer from "../../components/layout/Footer/Footer";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Search() {
	const [searchResults, setSearchResults] = useState([]);
	const [filteredResults, setFilteredResults] = useState([]);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate(); // Initialize useNavigate
	// Extract query parameters to pre-fill the search bar
	const initialSearchData = {
		location: {
			city: searchParams.get("city") || "",
			state: searchParams.get("state") || "",
			country: searchParams.get("country") || "",
			postalCode: searchParams.get("postalCode") || "",
			locationLabel: searchParams.get("locationLabel") || "",
		},
		dateRange: {
			startDate: searchParams.get("startDate") ? new Date(searchParams.get("startDate")) : new Date(),
			endDate: searchParams.get("endDate") ? new Date(searchParams.get("endDate")) : new Date(),
		},
		occupancy: {
			rooms: parseInt(searchParams.get("roomCount"), 10) || 1,
			adults: parseInt(searchParams.get("adultCount"), 10) || 1,
			children: parseInt(searchParams.get("childrenCount"), 10) || 0,
		},
	};
	
	useEffect(() => {
		const fetchSearchResults = async () => {
			const params = new URLSearchParams(searchParams);
			
			// Check if any search parameters exist
			const hasSearchParams = Array.from(params.keys()).length > 0;

			// Format startDate and endDate properly
			const startDateRaw = params.get("startDate");
			const endDateRaw = params.get("endDate");

			if (startDateRaw) {
				const parsed = new Date(decodeURIComponent(startDateRaw));
				if (!isNaN(parsed.getTime())) {
					params.set("startDate", parsed.toISOString().split("T")[0]); // YYYY-MM-DD
				}
			}
			if (endDateRaw) {
				const parsed = new Date(decodeURIComponent(endDateRaw));
				if (!isNaN(parsed.getTime())) {
					params.set("endDate", parsed.toISOString().split("T")[0]); // YYYY-MM-DD
				}
			}

			const query = params.toString();
			console.log("Search query:", query);
			
			try {
				// If no search parameters, fetch all accommodations via popular endpoint
				const endpoint = hasSearchParams 
					? `/accommodations/search?${query}` 
					: '/accommodations/popular';
					
				const response = await axiosInstance.get(endpoint);
				if (response.data.success) {
					setSearchResults(response.data.payload);
					setFilteredResults(response.data.payload); // Initialize filtered results
				} else {
					console.error(response.data.error);
				}
			} catch (error) {
				console.error("Error fetching accommodations:", error);
			}
		};

		fetchSearchResults();
	}, [searchParams]);

	const handleFilterChange = (filtered) => {
		setFilteredResults(filtered);
	};
	
	const handleSearch = React.useCallback(
		(searchData) => {
			const address = searchData.location;

			const location = {
				city: address.city || address.town || address.village || null,
				state: address.state || null,
				country: address.country || null,
				postalCode: address.postcode || null,
			};

			const label = address.locationLabel;

			const startDate = searchData.dateRange.startDate;
			const endDate = searchData.dateRange.endDate;

			const roomCount = searchData.occupancy.rooms;
			const adultCount = searchData.occupancy.adults;
			const childrenCount = searchData.occupancy.children;

			const queryParams = new URLSearchParams({
				city: location.city,
				state: location.state,
				postalCode: location.postalCode,
				country: location.country,
				locationLabel: label,
				startDate: startDate instanceof Date ? startDate.toISOString() : startDate,
				endDate: endDate instanceof Date ? endDate.toISOString() : endDate,
				roomCount,
				adultCount,
				childrenCount,
			}).toString();

			navigate(`/search?${queryParams}`);
		},
		[navigate]
	);

	return (
		<Box>
			{/* Navbar */}
			<Navbar />
			
			{/* Search Bar */}
			<Box sx={{ marginTop: 10, padding: 2, backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
				<Container>
					<SearchBar
						initialData={initialSearchData}
						onSearch={handleSearch}
					/>
				</Container>
			</Box>

			{/* Main Content */}
			<Container sx={{ marginTop: 4, display: "flex", gap: 4 }}>
				{/* Filter Box */}
				<Box sx={{ flex: 1, maxWidth: "300px" }}>
					<FilterBox results={searchResults} onFilterChange={handleFilterChange} />
				</Box>

				{/* Search Results */}
				<Box sx={{ flex: 3 }}>
					<Typography variant="h4" fontWeight="bold" gutterBottom>
						{Array.from(searchParams.keys()).length > 0 
							? `Search Results (${filteredResults.length})` 
							: `All Available Accommodations (${filteredResults.length})`
						}
					</Typography>
					{filteredResults.length > 0 ? (
						<Grid container spacing={3} direction={"column"}>
							{filteredResults.map((result, index) => (
								<Grid item xs={12} key={index}>
									<HotelCard id={result.id} name={result.name} amenities={result.amenities} location={result.address} minPrice={result.minPrice} rating={result.rating} />
								</Grid>
							))}
						</Grid>
					) : (
						<Typography variant="body1" color="text.secondary">
							{Array.from(searchParams.keys()).length > 0 
								? "No results found matching your filters." 
								: "No accommodations available at the moment."}
						</Typography>
					)}
				</Box>
			</Container>

			{/* Footer */}
			<Box sx={{ marginTop: 6 }}>
				<Footer />
			</Box>
		</Box>
	);
}

export default Search;
