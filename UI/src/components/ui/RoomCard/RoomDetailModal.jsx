import React, { useMemo } from "react";
import { Modal, Box, Typography, Divider, Grid, IconButton, List, ListItemText, Button } from "@mui/material";
import * as Icon from "@mui/icons-material";
import convertPrice from "../../../utils/convertPrice";

function RoomDetailModal({ room, modalOpen, handleCloseModal }) {
	const { name, size, maxCapacity, price, description, amenities, images, availableRooms, currentImageIndex, setCurrentImageIndex } = room;

	const modalStyle = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: "80%",
		maxWidth: 1200,
		maxHeight: "90vh",
		bgcolor: "background.paper",
		boxShadow: 24,
		p: 4,
		borderRadius: 2,
		overflow: "auto",
	};

	const handlePrevious = () => setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
	const handleNext = () => setCurrentImageIndex((prev) => Math.min(prev + 1, images?.length - 1));

	// Group RoomAmenities by type
	const groupedAmenities = useMemo(() => {
		if (!amenities) return {};
		return amenities.reduce((acc, amenity) => {
			if (!acc[amenity.type]) acc[amenity.type] = [];
			acc[amenity.type].push(amenity);
			return acc;
		}, {});
	}, [amenities]);

	return (
		<Modal open={modalOpen} onClose={handleCloseModal} aria-labelledby="room-detail-modal">
			<Box sx={modalStyle}>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
					<Typography variant="h4" fontWeight="bold" id="room-detail-modal">
						{name}
					</Typography>
					<IconButton onClick={handleCloseModal}>
						<Icon.Close />
					</IconButton>
				</Box>

				<Divider sx={{ mb: 3 }} />

				<Grid container spacing={3}>
					{/* Image Gallery Section */}
					<Grid item md={6}>
						<Box
							sx={{
								position: "relative",
								textAlign: "center",
								borderRadius: 2,
								overflow: "hidden",
								height: "400px",
								backgroundColor: "#f0f0f0",
								aspectRatio: "4 / 3",
								objectFit: "cover",
							}}
						>
							{/* Current Image */}
							{images?.length > 0 ? (
								<img
									srcSet={`${images[currentImageIndex].img}?w=800&h=600&fit=cover&auto=format&dpr=2 2x`}
									src={`${images[currentImageIndex].img}?w=800&h=600&fit=cover&auto=format`}
									alt={images[currentImageIndex].title}
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

							{/* Navigation Buttons */}
							{images?.length > 1 && (
								<>
									<IconButton
										onClick={handlePrevious}
										sx={{
											position: "absolute",
											top: "50%",
											left: 8,
											transform: "translateY(-50%)",
											backgroundColor: "rgba(0, 0, 0, 0.5)",
											color: "white",
											"&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
										}}
									>
										<Icon.ArrowBackIosNew />
									</IconButton>
									<IconButton
										onClick={handleNext}
										sx={{
											position: "absolute",
											top: "50%",
											right: 8,
											transform: "translateY(-50%)",
											backgroundColor: "rgba(0, 0, 0, 0.5)",
											color: "white",
											"&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
										}}
									>
										<Icon.ArrowForwardIos />
									</IconButton>
								</>
							)}
						</Box>
					</Grid>

					{/* Full Room Details Section */}
					<Grid item xs={12} md={6}>
						<Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
							Room Details
						</Typography>

						<Typography sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
							<Icon.SquareFoot fontSize="small" />
							<b>Room size:</b> {size}m²
						</Typography>
						<Typography sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
							<Icon.People fontSize="small" />
							<b>Max capacity:</b> {maxCapacity} people
						</Typography>
						<Typography sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
							<Icon.AttachMoney fontSize="small" />
							<b>Price:</b> {convertPrice(price)} VND
						</Typography>

						{/* Available Rooms Info in Modal*/}
						<Typography
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								mb: 2,
								color: availableRooms <= 3 ? "error.main" : "text.primary",
								fontWeight: availableRooms <= 3 ? "bold" : "normal",
							}}
						>
							<b>{availableRooms} rooms remaining</b>
						</Typography>

						<Typography variant="h6" fontWeight="bold" sx={{ mb: 1, mt: 3 }}>
							Description
						</Typography>
						<Typography variant="body1" sx={{ mb: 3 }}>
							{description}
						</Typography>

						<Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
							Amenities
						</Typography>
						<Grid container spacing={2}>
							{groupedAmenities.base && (
								<Grid item sm={4}>
									<Typography variant="subtitle2" fontWeight="bold">
										Basic
									</Typography>
									<List dense>
										{groupedAmenities.base.map((amenity) => (
											<ListItemText key={amenity.id}>
												<Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
													<Icon.Check fontSize="small" color="success" />
													{amenity.name}
												</Typography>
											</ListItemText>
										))}
									</List>
								</Grid>
							)}
							{groupedAmenities.bathroom && (
								<Grid item sm={4}>
									<Typography variant="subtitle2" fontWeight="bold">
										Bathroom
									</Typography>
									<List dense>
										{groupedAmenities.bathroom.map((amenity) => (
											<ListItemText key={amenity.id}>
												<Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
													<Icon.Check fontSize="small" color="success" />
													{amenity.name}
												</Typography>
											</ListItemText>
										))}
									</List>
								</Grid>
							)}
							{groupedAmenities.facility && (
								<Grid item sm={4}>
									<Typography variant="subtitle2" fontWeight="bold">
										Facilities
									</Typography>
									<List dense>
										{groupedAmenities.facility.map((amenity) => (
											<ListItemText key={amenity.id}>
												<Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
													<Icon.Check fontSize="small" color="success" />
													{amenity.name}
												</Typography>
											</ListItemText>
										))}
									</List>
								</Grid>
							)}
						</Grid>
					</Grid>
				</Grid>

				<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
					<Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 2 }}>
						Close
					</Button>
				</Box>
			</Box>
		</Modal>
	);
}

export default RoomDetailModal;
