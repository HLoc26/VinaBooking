import React from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import Navbar from "../../components/layout/NavBar/NavBar";
import SearchBar from "../../components/ui/SearchBar/SearchBar";
import HotelCard from "../../components/ui/HotelCard/HotelCard";
import Footer from "../../components/layout/Footer/Footer";
import axiosInstance from "../../app/axios";

function Landing() {
	// Mock data for popular destinations and featured hotels
	const popularDestinations = [
		{ name: "Paris", image: "https://placehold.co/300x200", description: "The city of lights." },
		{ name: "New York", image: "https://placehold.co/300x200", description: "The city that never sleeps." },
		{ name: "Tokyo", image: "https://placehold.co/300x200", description: "A blend of tradition and technology." },
		{ name: "Ha Noi", image: "https://placehold.co/300x200", description: "Vietnamese's capital" },
	];

	const [featuredHotels, setFeaturedHotels] = React.useState([]);

	React.useEffect(() => {
		axiosInstance.get("/accommodations/popular").then((response) => {
			if (response.data.success) {
				setFeaturedHotels(response.data.payload);
			}
		});
	}, []);

	const handleSearch = React.useCallback(async (searchData) => {
		console.log("Search data:", searchData);
		// Implement search functionality here
		const address = searchData.location.address;

		const location = {
			city: address.city || address.town || address.village || null,
			state: address.state || null,
			country: address.country || null,
			postalCode: address.postcode || null,
		};

		const startDate = new Date(searchData.dateRange.startDate).toISOString().split("T")[0];
		const endDate = new Date(searchData.dateRange.endDate).toISOString().split("T")[0];

		const roomCount = searchData.occupancy.rooms;
		const adultCount = searchData.occupancy.adults;

		const response = await axiosInstance.get(
			`/accommodations/search?city=${location.city}&state=${location.state}&postalCode=${location.postalCode}&country=${location.country}&startDate=${startDate}&endDate=${endDate}&roomCount=${roomCount}&adultCount=${adultCount}`
		);

		if (response.data.success) {
			console.log(response.data.payload);
		} else {
			console.log(response.data.payload.error);
		}
	}, []);

	return (
		<Box>
			{/* Navbar */}
			<Navbar />

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

			{/* Popular Destinations
			<Box sx={{ marginTop: 6 }}>
				<Container>
					<Typography variant="h4" fontWeight="bold" gutterBottom>
						Popular Destinations
					</Typography>
					<Grid container spacing={3} sx={{ justifyContent: "center" }}>
						{popularDestinations.slice(0, 4).map((destination, index) => (
							<Grid key={index} sx={{ width: { xs: "100%", md: "23%" } }}>
								<Box
									sx={{
										borderRadius: 2,
										overflow: "hidden",
										boxShadow: 3,
										backgroundColor: "#fff",
									}}
								>
									<img src={destination.image} alt={destination.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
									<Box sx={{ padding: 2 }}>
										<Typography variant="h6" fontWeight="bold">
											{destination.name}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{destination.description}
										</Typography>
									</Box>
								</Box>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box> */}

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

			{/* Footer */}
			<Box sx={{ marginTop: 6 }}>
				<Footer />
			</Box>
		</Box>
	);
}

export default Landing;
