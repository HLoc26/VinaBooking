import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Container, Grid, Paper } from "@mui/material";
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

			const label = address.locationLabel;

			// Convert Date objects to strings for URL parameters
			const startDate = searchData.dateRange.startDate instanceof Date ? searchData.dateRange.startDate.toISOString() : searchData.dateRange.startDate;
			const endDate = searchData.dateRange.endDate instanceof Date ? searchData.dateRange.endDate.toISOString() : searchData.dateRange.endDate;

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
					position: "relative",
					backgroundImage: "url('/images/vietnam-hero-section.jpg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					height: "500px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					color: "#fff",
					textAlign: "center",
					"&::before": {
						content: '""',
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(255, 255, 255, 0.2)",
						opacity: 0.7,
						zIndex: 0,
					},
				}}
			>
				<Box
					sx={{
						zIndex: 1,
						backgroundColor: "rgba(255, 255, 255, 0.8)",
						padding: 4,
						borderRadius: 3,
						maxWidth: "80%",
					}}
				>
					<Typography
						variant="h2"
						fontWeight="bold"
						color="primary"
						sx={{
							opacity: 1.0,
							mb: 2,
							textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
						}}
					>
						Find Your Perfect Stay
					</Typography>
					<Typography variant="h6" color="text.secondary">
						Discover amazing accommodations across Vietnam
					</Typography>
				</Box>
			</Box>

			{/* Search Bar */}
			<Container sx={{ marginTop: -5, position: "relative", zIndex: 5 }}>
				<Paper
					elevation={6}
					sx={{
						borderRadius: 3,
						transition: "all 0.3s ease-in-out",
						"&:hover": {
							boxShadow: 10,
						},
						position: "relative",
						zIndex: "auto",
						overflow: "visible",
					}}
				>
					<SearchBar onSearch={handleSearch} />
				</Paper>
			</Container>

			{/* Featured Hotels */}
			<Box sx={{ marginTop: 8, marginBottom: 6 }}>
				<Container>
					<Typography
						variant="h4"
						fontWeight="bold"
						gutterBottom
						color="primary"
						sx={{
							pb: 2,
							borderBottom: "2px solid",
							borderColor: "primary.light",
							display: "inline-block",
							mb: 4,
						}}
					>
						Featured Hotels
					</Typography>
					<Grid container spacing={3} sx={{ justifyContent: "center", gap: { xs: 2, md: 4 } }}>
						{featuredHotels.map((hotel, index) => (
							<Grid
								key={index}
								sx={{
									transition: "transform 0.3s",
									"&:hover": {
										transform: "translateY(-5px)",
									},
								}}
							>
								<Paper
									elevation={3}
									sx={{
										borderRadius: 3,
										overflow: "hidden",
										height: "100%",
										transition: "all 0.3s ease-in-out",
										"&:hover": {
											boxShadow: 8,
										},
									}}
								>
									<HotelCard id={hotel.id} name={hotel.name} amenities={hotel.amenities} location={hotel.address} minPrice={hotel.minPrice} rating={hotel.rating} />
								</Paper>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>
		</MainLayout>
	);
}

export default Landing;
