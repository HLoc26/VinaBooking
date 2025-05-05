import * as React from "react";
// MUI components
import { Box, Tabs, Tab, Typography, IconButton, Rating, Stack, Chip, Button, Grid } from "@mui/material";
// MUI icons
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// Router
import { useParams } from "react-router-dom";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite } from "../../features/accommodationDetail/favoritesSlice";

import CustomTabPanel from "../../components/ui/CustomTabPanel/CustomTabPanel";
import MainLayout from "../../components/layout/MainLayout/MainLayout";
import ReviewCard from "../../components/ui/ReviewCard/ReviewCard";
import RoomCard from "../../components/ui/RoomCard/RoomCard";
import BookingSummary from "../../components/ui/BookingSummary/BookingSummary";

function AccommodationDetail() {
	const { aid } = useParams();
	const accId = Number(aid);

	// Redux
	const dispatch = useDispatch();
	const favorites = useSelector((state) => state.favorites.ids);
	const isFavorite = favorites.includes(accId);

	const [activeTab, setActiveTab] = React.useState(0);
	const [selectedImage, setSelectedImage] = React.useState(0);

	const handleChangeTab = (e, newValue) => {
		setActiveTab(newValue);
	};

	const handleToggleFavorite = () => {
		dispatch(toggleFavorite(accId));
	};

	function a11yProps(index) {
		return {
			id: `simple-tab-${index}`,
			"aria-controls": `simple-tabpanel-${index}`,
		};
	}

	// Mock data for reviews
	const reviews = [
		{ star: 4.5, reviewDate: new Date(), reviewer: "John Doe", comment: "Great place to stay!" },
		{ star: 4.0, reviewDate: new Date(), reviewer: "Jane Smith", comment: "Very clean and comfortable." },
		{ star: 5.0, reviewDate: new Date(), reviewer: "Alice Johnson", comment: "Amazing experience!" },
		{ star: 3.5, reviewDate: new Date(), reviewer: "Bob Brown", comment: "Good, but could be better." },
		{ star: 4.8, reviewDate: new Date(), reviewer: "Charlie Davis", comment: "Highly recommend this place!" },
		{ star: 4.2, reviewDate: new Date(), reviewer: "Emily Wilson", comment: "Nice and cozy." },
		{ star: 3.0, reviewDate: new Date(), reviewer: "Frank Miller", comment: "Average experience." },
		{ star: 5.0, reviewDate: new Date(), reviewer: "Grace Lee", comment: "Perfect for a weekend getaway!" },
		{ star: 4.7, reviewDate: new Date(), reviewer: "Henry White", comment: "Loved the amenities!" },
		{ star: 4.3, reviewDate: new Date(), reviewer: "Ivy Green", comment: "Would definitely come back." },
	];
	// Mock data
	const itemData = [
		{
			img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
			title: "Breakfast",
		},
		{
			img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
			title: "Burger",
		},
		{
			img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
			title: "Camera",
		},
		{
			img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
			title: "Coffee",
		},
		{
			img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
			title: "Hats",
		},
		{
			img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
			title: "Honey",
		},
		{
			img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
			title: "Basketball",
		},
		{
			img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
			title: "Fern",
		},
		{
			img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
			title: "Mushrooms",
		},
		{
			img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
			title: "Tomato basil",
		},
		{
			img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
			title: "Sea star",
		},
		{
			img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
			title: "Bike",
		},
	];

	// Mock data for rooms
	const rooms = [
		{
			id: 1,
			name: "Deluxe Twin City View",
			maxCapacity: 2,
			size: 25,
			description: "A cozy room with a stunning city view, perfect for two guests.",
			price: 1000000,
			availableRooms: 3,
			amenities: ["City view", "No smoking", "Blackout curtains", "Free Wi-Fi"],
			images: [
				{ img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e", title: "Breakfast" },
				{ img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d", title: "Burger" },
				{ img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45", title: "Camera" },
				{ img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c", title: "Coffee" },
			],
		},
		{
			id: 2,
			name: "Luxury Suite Ocean View",
			maxCapacity: 4,
			size: 50,
			description: "A luxurious suite with breathtaking ocean views and premium amenities.",
			price: 3000000,
			availableRooms: 2,
			amenities: ["Ocean view", "King-size bed", "Private balcony", "Jacuzzi"],
			images: [
				{ img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e", title: "Breakfast" },
				{ img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d", title: "Burger" },
				{ img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45", title: "Camera" },
				{ img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c", title: "Coffee" },
			],
		},
		{
			id: 3,
			name: "Standard Single Room",
			maxCapacity: 1,
			size: 15,
			description: "A compact and affordable room for solo travelers.",
			price: 500000,
			availableRooms: 10,
			amenities: {
				basic: ["Elevator", "City view"],
				bathroom: ["Bathtub", "Toothbrush", "Towel"],
				facility: ["Balcony", "Mineral water", "Soda"],
			},
			images: [
				{ img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e", title: "Breakfast" },
				{ img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d", title: "Burger" },
				{ img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45", title: "Camera" },
				{ img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c", title: "Coffee" },
				{ img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title: "Bike" },
				{ img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title: "Bike" },
				{ img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title: "Bike" },
				{ img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title: "Bike" },
				{ img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title: "Bike" },
				{ img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title: "Bike" },
				{ img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title: "Bike" },
				{ img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title: "Bike" },
			],
		},
		{
			id: 4,
			name: "Family Room Garden View",
			maxCapacity: 6,
			size: 60,
			description: "Spacious family room with a beautiful garden view, ideal for families.",
			price: 2000000,
			availableRooms: 4,
			amenities: {
				basic: ["Elevator", "City view"],
			},
			images: [
				{ img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title: "Garden view" },
				{ img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title: "Family room" },
			],
		},
		{
			id: 5,
			name: "Penthouse Suite",
			maxCapacity: 8,
			size: 120,
			description: "An exclusive penthouse suite with panoramic views and luxurious amenities.",
			price: 8000000,
			availableRooms: 1,
			amenities: ["Panoramic view", "Private pool", "Fully equipped kitchen", "Butler service"],
			images: [
				{ img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title: "Penthouse view" },
				{ img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title: "Luxury living room" },
			],
		},
	];

	const accommodation = {
		id: accId,
		name: "Vinabooking Grand Hotel",
		address: {
			addressLine: "123 Trần Phú",
			city: "Nha Trang",
			state: "",
			postalCode: "650000",
			country: "Việt Nam",
		},
		images: itemData.map((x, i) => ({ id: i, filename: x.img })),
		amenities: [
			{ id: 1, name: "Free Wi-Fi" },
			{ id: 2, name: "Breakfast included" },
			{ id: 3, name: "Swimming Pool" },
			{ id: 4, name: "Gym" },
			{ id: 5, name: "Air conditioning" },
		],
		reviews: reviews.map((r, i) => ({ id: i, star: r.star })),
	};

	// Tính điểm trung bình từ reviews
	const averageRating = accommodation.reviews.length ? accommodation.reviews.reduce((sum, r) => sum + r.star, 0) / accommodation.reviews.length : 0;

	// Ghép chuỗi địa chỉ hiển thị
	const address = `
    ${accommodation.address.addressLine},
    ${accommodation.address.city}
    ${accommodation.address.state ? `, ${accommodation.address.state}` : ""}
    ${accommodation.address.postalCode},
    ${accommodation.address.country}
  `
		.replace(/\s+/g, " ")
		.trim();

	const tabLabels = ["Overview", "Rooms", "Amenities", "Policy", "Reviews"];

	// Hàm xử lý chuyển sang tab trước đó
	const handlePreviousTab = () => {
		if (activeTab > 0) {
			setActiveTab(activeTab - 1);
		}
	};

	// Hàm xử lý chuyển sang tab tiếp theo
	const handleNextTab = () => {
		if (activeTab < tabLabels.length - 1) {
			setActiveTab(activeTab + 1);
		}
	};

	return (
		<MainLayout>
			<Box sx={{ width: "100%" }}>
				{/* Tabs navigation */}
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<Tabs value={activeTab} onChange={handleChangeTab}>
						{tabLabels.map((label, index) => (
							<Tab key={index} label={label} {...a11yProps(index)} />
						))}
					</Tabs>
				</Box>

				{/* ========== OVERVIEW TAB ========== */}
				<CustomTabPanel value={activeTab} index={0}>
					{/* Name & Favorite button */}
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography variant="h4">{accommodation.name}</Typography>
						<IconButton onClick={handleToggleFavorite} color="error">
							{isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
						</IconButton>
					</Stack>

					{/* Rating */}
					<Stack direction="row" spacing={1} mt={1} alignItems="center">
						<Rating value={averageRating} precision={0.1} readOnly />
						<Typography variant="body2" color="text.secondary">
							{averageRating} ({accommodation.reviews.length} reviews)
						</Typography>
					</Stack>

					{/* Address */}
					<Typography variant="body2" color="text.secondary" mt={1}>
						Address: {address}
					</Typography>

					{/* Main + Thumbnails images*/}
					<Box mt={3}>
						{/* Main image */}
						<Box>
							<img src={accommodation.images[selectedImage].filename} alt="Accommodation" style={{ width: "100%", maxHeight: 500, objectFit: "cover", borderRadius: 8 }} />
						</Box>

						{/* Thumbnails */}
						<Stack direction="row" spacing={1} mt={1} sx={{ overflowX: "auto", py: 1 }}>
							{accommodation.images.map((img, idx) => (
								<Box
									key={img.id}
									onClick={() => setSelectedImage(idx)}
									sx={{
										border: selectedImage === idx ? "2px solid #1976d2" : "2px solid transparent",
										borderRadius: 1,
										cursor: "pointer",
										flex: "0 0 auto",
									}}
								>
									<img
										src={img.filename}
										alt={`Thumb ${img.id}`}
										style={{
											width: 100,
											height: 70,
											objectFit: "cover",
											borderRadius: 4,
										}}
									/>
								</Box>
							))}
						</Stack>
					</Box>

					{/* Amenities */}
					<Box mt={3}>
						<Typography variant="h6" gutterBottom>
							Amenities
						</Typography>
						<Stack direction="row" flexWrap="wrap" gap={1} justifyContent="flex-start" alignItems="flex-start">
							{accommodation.amenities.map((am) => (
								<Chip key={am.id} label={am.name} variant="outlined" />
							))}
						</Stack>
					</Box>
				</CustomTabPanel>

				{/* ========== ROOMS TAB ========== */}
				<CustomTabPanel value={activeTab} index={1}>
					<Grid container spacing={1}>
						{/* Room Cards Column - 2/3 width */}
						<Grid item xs={12} md={8}>
							<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
								{rooms && rooms.length > 0 ? (
									rooms.map((room) => <RoomCard key={room.id} room={room} />)
								) : (
									<Typography variant="body1" color="text.secondary">
										No rooms available at the moment.
									</Typography>
								)}
							</Box>
						</Grid>

						{/* Booking Summary Column - 1/3 width */}
						<Grid item xs={12} md={4}>
							<BookingSummary />
						</Grid>
					</Grid>
				</CustomTabPanel>

				{/* ========== AMENITIES TAB ========== */}
				<CustomTabPanel value={activeTab} index={2}>
					Amenities
				</CustomTabPanel>

				{/* ========== POLICY TAB ========== */}
				<CustomTabPanel value={activeTab} index={3}>
					Policy
				</CustomTabPanel>

				{/* ========== REVIEWS TAB ========== */}
				<CustomTabPanel value={activeTab} index={4}>
					{reviews.map((review, index) => (
						<ReviewCard
							key={index}
							star={review.star}
							reviewDate={review.reviewDate}
							images={itemData} // A list of images, could be empty
							reviewer={review.reviewer}
							comment={review.comment}
						/>
					))}
				</CustomTabPanel>

				{/* Previous and Next buttons */}
				<Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 4 }}>
					{/* Hiển thị nút Previous nếu không phải tab đầu tiên */}
					{activeTab > 0 ? (
						<Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handlePreviousTab}>
							{tabLabels[activeTab - 1]}
						</Button>
					) : (
						<Box />
					)}

					{/* Hiển thị nút Next nếu không phải tab cuối cùng */}
					{activeTab < tabLabels.length - 1 ? (
						<Button variant="outlined" endIcon={<ArrowForwardIcon />} onClick={handleNextTab}>
							{tabLabels[activeTab + 1]}
						</Button>
					) : (
						<Box />
					)}
				</Box>
			</Box>
		</MainLayout>
	);
}

export default AccommodationDetail;
