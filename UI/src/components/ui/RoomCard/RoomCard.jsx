import * as React from "react";
import { Paper, Grid, Typography, Box, IconButton, Button, ImageListItemBar } from "@mui/material";
import * as Icon from "@mui/icons-material";
import convertPrice from "../../../utils/convertPrice.js";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { updateRoomQuantity } from "../../../features/booking/bookingSlice";
import RoomDetailModal from "./RoomDetailModal.jsx";

function RoomCard({ room }) {
	const { id, name, maxCapacity, size, description, price, amenities, images, availableRooms = 1 } = room;
	const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
	const [modalOpen, setModalOpen] = React.useState(false);

	// Redux
	const dispatch = useDispatch();
	const currentQuantity = useSelector((state) => state.booking.selectedRooms[id]?.quantity || 0);

	const handleOpenModal = () => setModalOpen(true);
	const handleCloseModal = () => setModalOpen(false);

	// Quantity handlers
	const handleIncreaseQuantity = () => {
		if (currentQuantity < availableRooms) {
			dispatch(
				updateRoomQuantity({
					...room,
					quantity: currentQuantity + 1,
				})
			);
		}
	};

	const handleDecreaseQuantity = () => {
		if (currentQuantity > 0) {
			dispatch(
				updateRoomQuantity({
					...room,
					quantity: currentQuantity - 1,
				})
			);
		}
	};

	return (
		<>
			{/* Room Card (Preview) */}
			<Paper elevation={3} sx={{ mb: 4, padding: 3, borderRadius: 2, width: "90%" }}>
				{/* Room Title */}
				<Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
					{name}
				</Typography>

				{/* Room Content */}
				<Grid container spacing={3}>
					{/* Image Section */}
					<Grid item size={4}>
						<Box
							onClick={handleOpenModal}
							sx={{
								position: "relative",
								textAlign: "center",
								borderRadius: 2,
								overflow: "hidden",
								height: "250px",
								backgroundColor: "#f0f0f0",
								cursor: "pointer",
							}}
						>
							{/* Current Image */}
							{images?.length > 0 ? (
								<img
									srcSet={`${images[0].img}`}
									src={`${images[0].img}`}
									alt={images[0].title}
									loading="lazy"
									style={{
										width: "100%",
										height: "100%",
										objectFit: "cover",
									}}
								/>
							) : (
								<Typography>No images available</Typography>
							)}

							{/* Overlay with text */}
							<ImageListItemBar
								sx={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
								title={
									<Typography sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
										<Icon.PhotoLibrary fontSize="small" />
										{images?.length} {images?.length === 1 ? "photo" : "photos"} - Click to view
									</Typography>
								}
							/>
						</Box>
					</Grid>

					{/* Room Brief Details Section */}
					<Grid
						size={8}
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
						}}
					>
						<Box>
							{/* Brief Description - Shortened */}
							<Typography variant="body1" sx={{ mb: 2 }}>
								{description.length > 120 ? `${description.substring(0, 120)}...` : description}
							</Typography>

							{/* Key Room Info */}
							<Grid container spacing={2} sx={{ mb: 2 }}>
								<Grid item>
									<Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Icon.SquareFoot fontSize="small" />
										<b>Size:</b> {size}m²
									</Typography>
								</Grid>

								<Grid item>
									<Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Icon.People fontSize="small" />
										<b>Capacity:</b> {maxCapacity}
									</Typography>
								</Grid>

								<Grid item>
									<Typography sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
										<Icon.AttachMoney fontSize="small" />
										<b>Price:</b> {convertPrice(price)} VND
									</Typography>
								</Grid>
							</Grid>

							{/* Quick Amenities Preview */}
							<Box sx={{ mb: 2 }}>
								<Typography variant="subtitle1" sx={{ mb: 1 }}>
									<b>Key amenities:</b>
								</Typography>
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
									{amenities &&
										Object.values(amenities)
											.flat()
											.slice(0, 5)
											.map((amenity, index) => (
												<Typography
													key={index}
													variant="body2"
													sx={{
														bgcolor: "action.hover",
														px: 1,
														py: 0.5,
														borderRadius: 1,
													}}
												>
													{amenity.name}
												</Typography>
											))}
									{amenities && Object.values(amenities).flat().length > 5 && (
										<Typography
											variant="body2"
											sx={{
												bgcolor: "action.hover",
												px: 1,
												py: 0.5,
												borderRadius: 1,
											}}
										>
											+{Object.values(amenities).flat().length - 5} more
										</Typography>
									)}
								</Box>
							</Box>
						</Box>

						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, gap: 2, flexWrap: "wrap" }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
								<Button variant="outlined" color="primary" onClick={handleOpenModal} startIcon={<Icon.Info />}>
									See details
								</Button>

								{/* Available Rooms Info */}
								<Typography
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1,
										color: availableRooms <= 3 ? "error.main" : "text.primary",
										fontWeight: availableRooms <= 3 ? "bold" : "normal",
									}}
								>
									<b>{availableRooms} rooms left</b>
								</Typography>
							</Box>

							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								{/* Decrease Quantity Button */}
								<IconButton
									onClick={handleDecreaseQuantity}
									disabled={currentQuantity === 0}
									color="primary"
									sx={{
										border: "1px solid",
										borderColor: "primary.main",
										"&.Mui-disabled": {
											borderColor: "action.disabled",
										},
									}}
								>
									<Icon.Remove fontSize="small" />
								</IconButton>

								{/* Quantity Display */}
								<Typography
									variant="h6"
									sx={{
										minWidth: "40px",
										textAlign: "center",
										fontWeight: "bold",
									}}
								>
									{currentQuantity}
								</Typography>

								{/* Increase Quantity Button */}
								<IconButton
									onClick={handleIncreaseQuantity}
									color="primary"
									sx={{
										border: "1px solid",
										borderColor: "primary.main",
									}}
								>
									<Icon.Add fontSize="small" />
								</IconButton>
							</Box>
						</Box>
					</Grid>
				</Grid>
			</Paper>

			{/* Detailed Modal */}
			<RoomDetailModal room={{ ...room, currentImageIndex, setCurrentImageIndex }} handleCloseModal={handleCloseModal} modalOpen={modalOpen} />
		</>
	);
}

export default RoomCard;
