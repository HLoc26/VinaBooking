import React from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import MainLayout from "../../components/layout/MainLayout/MainLayout";
import SearchBar from "../../components/ui/SearchBar/SearchBar";
import HotelCard from "../../components/ui/HotelCard/HotelCard";

function Landing() {
	// Mock data for popular destinations and featured hotels
	const popularDestinations = [
		{ name: "Paris", image: "https://placehold.co/300x200", description: "The city of lights." },
		{ name: "New York", image: "https://placehold.co/300x200", description: "The city that never sleeps." },
		{ name: "Tokyo", image: "https://placehold.co/300x200", description: "A blend of tradition and technology." },
		{ name: "Ha Noi", image: "https://placehold.co/300x200", description: "Vietnamese's capital" },
	];

	const featuredHotels = [
		{
			name: "Luxury Hotel",
			location: "Paris, France",
			amenities: ["Free WiFi", "Pool", "Spa"],
			minPrice: 2000000,
			rating: 4.8,
		},
		{
			name: "Comfort Stay",
			location: "New York, USA",
			amenities: ["Breakfast Included", "Gym", "Parking"],
			minPrice: 1500000,
			rating: 4.5,
		},
		{
			name: "Modern Inn",
			location: "Tokyo, Japan",
			amenities: ["Free WiFi", "Restaurant", "Bar"],
			minPrice: 1800000,
			rating: 4.7,
		},
		{
			name: "Ocean View Resort",
			location: "Maldives",
			amenities: ["Private Beach", "Infinity Pool", "Snorkeling"],
			minPrice: 3000000,
			rating: 4.9,
		},
		{
			name: "Mountain Retreat",
			location: "Swiss Alps, Switzerland",
			amenities: ["Skiing", "Spa", "Mountain View"],
			minPrice: 2500000,
			rating: 4.6,
		},
		{
			name: "Urban Escape",
			location: "Singapore",
			amenities: ["Rooftop Pool", "City View", "Free Breakfast"],
			minPrice: 2200000,
			rating: 4.7,
		},
		{
			name: "Desert Oasis",
			location: "Dubai, UAE",
			amenities: ["Luxury Suites", "Desert Safari", "Fine Dining"],
			minPrice: 2800000,
			rating: 4.8,
		},
		{
			name: "Tropical Paradise",
			location: "Bali, Indonesia",
			amenities: ["Beachfront", "Yoga Classes", "Spa"],
			minPrice: 1700000,
			rating: 4.6,
		},
		{
			name: "Historic Charm",
			location: "Rome, Italy",
			amenities: ["Free WiFi", "Breakfast Included", "City Tours"],
			minPrice: 1900000,
			rating: 4.5,
		},
		{
			name: "Cultural Haven",
			location: "Kyoto, Japan",
			amenities: ["Traditional Rooms", "Tea Ceremony", "Garden View"],
			minPrice: 1600000,
			rating: 4.7,
		},
	];

	const handleSearch = (searchData) => {
		console.log("Search data:", searchData);
		// Implement search functionality here
	};

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

			{/* Popular Destinations */}
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
			</Box>

			{/* Featured Hotels */}
			<Box sx={{ marginTop: 6 }}>
				<Container>
					<Typography variant="h4" fontWeight="bold" gutterBottom>
						Featured Hotels
					</Typography>
					<Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
						{featuredHotels.map((hotel, index) => (
							<Grid key={index} sx={{ width: { xs: "100%", md: "48%" } }}>
								<HotelCard {...hotel} />
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>
		</MainLayout>
	);
}

export default Landing;
