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
			startDate: new Date(searchParams.get("startDate") || ""),
			endDate: new Date(searchParams.get("endDate") || ""),
		},
		occupancy: {
			rooms: parseInt(searchParams.get("roomCount"), 10) || 1,
			adults: parseInt(searchParams.get("adultCount"), 10) || 1,
			children: parseInt(searchParams.get("childrenCount"), 10) || 0,
		},
	};

	useEffect(() => {
		const fetchSearchResults = async () => {
			const query = searchParams.toString();
			const response = await axiosInstance.get(`/accommodations/search?${query}`);
			if (response.data.success) {
				setSearchResults(response.data.payload);
				setFilteredResults(response.data.payload); // Initialize filtered results
			} else {
				console.error(response.data.error);
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
				startDate,
				endDate,
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
						initialData={initialSearchData} // Pass initial data to the search bar
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
						Search Results ({filteredResults.length})
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
							No results found matching your filters.
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
