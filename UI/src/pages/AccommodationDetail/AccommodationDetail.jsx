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
import axiosInstance from "../../app/axios";

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

	const [accommodation, setAccommodation] = React.useState({});
	const images = accommodation.images;
	const [address, setAddress] = React.useState("");
	const [amenities, setAmenities] = React.useState([]);
	const [rooms, setRoom] = React.useState([]);

	React.useEffect(() => {
		try {
			axiosInstance.get(`/accommodations/${aid}`).then((response) => {
				console.log(response);
				const accomm = response.data.payload.accommodation;
				setAccommodation(accomm);
				setAddress(
					`${accomm.Address?.addressLine}, ${accomm.Address?.city} ${accomm.Address?.state ? `, ${accomm.Address.state}` : ""} ${accomm.Address?.postalCode}, ${accomm.Address?.country}`
						.replace(/\s+/g, " ")
						.trim()
				);
				setAmenities(accomm.AccommodationAmenities);
				setRoom(accomm.Rooms);
			});
		} catch (error) {
			console.error(error);
		}
	}, [aid]);

	// // Tính điểm trung bình từ reviews
	// // const averageRating = accommodation.reviews.length ? accommodation.reviews.reduce((sum, r) => sum + r.star, 0) / accommodation.reviews.length : 0;

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
	const tabLabels = ["Overview", "Rooms", "Amenities", "Policy", "Reviews"];
	return (
		<MainLayout>
			<Box sx={{ width: "100%" }}>
				{/* Tabs navigation */}
				<Box sx={{ position: "sticky", top: 60, borderBottom: 1, borderColor: "divider", backgroundColor: "white", zIndex: 10000 }}>
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
					{/* <Stack direction="row" spacing={1} mt={1} alignItems="center">
						<Rating value={averageRating} precision={0.1} readOnly />
						<Typography variant="body2" color="text.secondary">
							{averageRating} ( reviews)
						</Typography>
					</Stack> */}

					{/* Address */}
					<Typography variant="body2" color="text.secondary" mt={1}>
						Address: {address}
					</Typography>

					{/* Main + Thumbnails images*/}
					<Box mt={3}>
						{/* Main image */}
						<Box>
							<img
								src={images ? images[selectedImage].filename : "/uploads/accommodation/default.jpg"}
								alt="Accommodation"
								style={{ width: "100%", maxHeight: 500, objectFit: "cover", borderRadius: 8 }}
							/>
						</Box>

						{/* Thumbnails */}
						{/* <Stack direction="row" spacing={1} mt={1} sx={{ overflowX: "auto", py: 1 }}>
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
						</Stack> */}
					</Box>

					{/* Amenities */}
					<Box mt={3}>
						<Typography variant="h6" gutterBottom>
							Amenities
						</Typography>
						<Stack direction="row" flexWrap="wrap" gap={1} justifyContent="flex-start" alignItems="flex-start">
							{amenities.map((am) => (
								<Chip key={am.id} label={am.name} variant="outlined" />
							))}
						</Stack>
					</Box>
				</CustomTabPanel>

				{/* ========== ROOMS TAB ========== */}
				<CustomTabPanel value={activeTab} index={1}>
					<Grid container spacing={1}>
						{/* Room Cards Column - 2/3 width */}
						<Grid item size={9}>
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
						<Grid item size={3}>
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
				{/* <CustomTabPanel value={activeTab} index={4}>
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
				</CustomTabPanel> */}

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
