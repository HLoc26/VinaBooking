import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Container, Grid } from "@mui/material";
import MainLayout from "../../components/layout/MainLayout/MainLayout";
import SearchBar from "../../components/ui/SearchBar/SearchBar";
import HotelCard from "../../components/ui/HotelCard/HotelCard";
import Footer from "../../components/layout/Footer/Footer";
import axiosInstance from "../../app/axios";

function Landing() {
	const navigate = useNavigate();

	const [featuredHotels, setFeaturedHotels] = React.useState([]);

	React.useEffect(() => {
		axiosInstance.get("/accommodations/popular").then((response) => {
			if (response.data.success) {
				setFeaturedHotels(response.data.payload);
			}
		});
	}, []);

	const handleSearch = React.useCallback(
		(searchData) => {
			const address = searchData.location;

			const location = {
				city: address.city || address.town || address.village || null,
				state: address.state || null,
				country: address.country || null,
				postalCode: address.postcode || null,
			};

			console.log("Search data", searchData);
			const label = address.display_name;

			const startDate = new Date(searchData.dateRange.startDate).toISOString().split("T")[0];
			const endDate = new Date(searchData.dateRange.endDate).toISOString().split("T")[0];

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
		<MainLayout>
			{/* Hero Section */}
			<Box
				sx={{
					backgroundImage: "url('https://via.placeholder.com/1920x600')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					height: "400px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					color: "#fff",
					textAlign: "center",
				}}
			>
				<Typography variant="h2" fontWeight="bold" color="black">
					Find Your Perfect Stay
				</Typography>
			</Box>

			{/* Search Bar */}
			<Container sx={{ marginTop: 4 }}>
				<SearchBar onSearch={handleSearch} />
			</Container>

			{/* Featured Hotels */}
			<Box sx={{ marginTop: 6 }}>
				<Container>
					<Typography variant="h4" fontWeight="bold" gutterBottom>
						Featured Hotels
					</Typography>
					<Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
						{featuredHotels.map((hotel, index) => (
							<Grid key={index} sx={{ width: { xs: "100%", md: "48%" } }}>
								<HotelCard name={hotel.name} amenities={hotel.amenities} location={hotel.address} minPrice={hotel.minPrice} rating={hotel.rating} />
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>
		</MainLayout>
	);
}

export default Landing;
