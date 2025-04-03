import * as React from "react";
import { Paper, Grid, Typography, Box, IconButton, Button, List, ListItemText, ImageListItemBar, Modal, Divider } from "@mui/material";
import * as Icon from "@mui/icons-material";
import convertPrice from "../../../utils/convertPrice.js";

function RoomCard({ room }) {
	// After implementing Booking page, change _id -> id
	const { _id, name, maxCapacity, size, description, price, amenities, images } = room;
	const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
	const [modalOpen, setModalOpen] = React.useState(false);

	const handlePrevious = React.useCallback(() => {
		setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
	}, []);

	const handleNext = React.useCallback(() => {
		setCurrentImageIndex((prev) => Math.min(prev + 1, images.length - 1));
	}, [images.length]);

	const handleOpenModal = () => setModalOpen(true);
	const handleCloseModal = () => setModalOpen(false);

	const handleChooseRoom = () => {
		alert("Choose room, this should navigate to booking page");
	};

	// Modal style
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

	return (
		<>
			{/* Room Card (Preview) */}
			<Paper elevation={3} sx={{ mb: 4, padding: 3, borderRadius: 2, width: "75%" }}>
				{/* Room Title */}
				<Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
					{name}
				</Typography>

				{/* Room Content */}
				<Grid container spacing={3}>
					{/* Image Section */}
					<Grid size={4}>
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
							{images.length > 0 ? (
								<img
									srcSet={`${images[0].img}?w=600&h=400&fit=cover&auto=format&dpr=2 2x`}
									src={`${images[0].img}?w=600&h=400&fit=cover&auto=format`}
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
										{images.length} {images.length === 1 ? "photo" : "photos"} - Click to view
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
								<Grid>
									<Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Icon.SquareFoot fontSize="small" />
										<b>Size:</b> {size}m²
									</Typography>
								</Grid>

								<Grid>
									<Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Icon.People fontSize="small" />
										<b>Capacity:</b> {maxCapacity}
									</Typography>
								</Grid>

								<Grid>
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
									{Object.values(amenities)
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
												{amenity}
											</Typography>
										))}
									{Object.values(amenities).flat().length > 5 && (
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

						{/* Action Button */}
						<Box sx={{ textAlign: "right", mt: 2 }}>
							<Button variant="outlined" color="primary" onClick={handleOpenModal} startIcon={<Icon.Info />}>
								See details
							</Button>
							<Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={handleChooseRoom}>
								Choose Room
							</Button>
						</Box>
					</Grid>
				</Grid>
			</Paper>

			{/* Detailed Modal */}
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
						<Grid md={6}>
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
								{images.length > 0 ? (
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
								{images.length > 1 && (
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

										{/* Image counter */}
										<Box
											sx={{
												position: "absolute",
												bottom: 16,
												left: "50%",
												transform: "translateX(-50%)",
												backgroundColor: "rgba(0, 0, 0, 0.5)",
												color: "white",
												px: 2,
												py: 0.5,
												borderRadius: 10,
											}}
										>
											{currentImageIndex + 1} / {images.length}
										</Box>
									</>
								)}
							</Box>

							{/* Thumbnail Strip */}
							{images.length > 1 && (
								<Box
									sx={{
										position: "relative",
										height: "72px", // Fixed height including margin
										mt: 2,
									}}
								>
									{/* Visible thumbnails in a controlled container */}
									<Box
										sx={{
											display: "flex",
											justifyContent: "center",
											gap: 1,
											overflow: "hidden", // Hidden overflow instead of auto
											height: "60px",
											// Only show pagination arrows if we have more than 5 images
											width: images.length > 5 ? "calc(100% - 60px)" : "100%",
											mx: images.length > 5 ? "30px" : 0,
										}}
									>
										{/* Calculate visible thumbnails - if we should center around current image */}
										{images.map((image, index) => {
											// Logic to limit visible thumbnails and keep them centered around current
											const maxVisible = 5; // Maximum number of thumbnails to show at once
											const halfVisible = Math.floor(maxVisible / 2);

											// Only show thumbnails in range around current
											const startIndex = Math.max(0, currentImageIndex - halfVisible);
											const endIndex = Math.min(images.length - 1, startIndex + maxVisible - 1);

											// Adjust start if we're near the end to always show maxVisible if possible
											const finalStartIndex = images.length > maxVisible && endIndex === images.length - 1 ? Math.max(0, images.length - maxVisible) : startIndex;

											// Only render if in visible range
											const isVisible = index >= finalStartIndex && index <= endIndex;

											if (!isVisible && images.length > maxVisible) return null;

											return (
												<Box
													key={index}
													onClick={() => setCurrentImageIndex(index)}
													sx={{
														width: 80,
														height: 60,
														borderRadius: 1,
														overflow: "hidden",
														cursor: "pointer",
														border: currentImageIndex === index ? "2px solid #1976d2" : "none",
														flexShrink: 0, // Prevent thumbnails from shrinking
													}}
												>
													<img
														src={`${image.img}?w=100&h=80&fit=cover&auto=format`}
														alt={`Thumbnail ${index + 1}`}
														style={{
															width: "100%",
															height: "100%",
															objectFit: "cover",
														}}
													/>
												</Box>
											);
										})}
									</Box>

									{/* Pagination indicators for thumbnails if more than we can display */}
									{images.length > 5 && (
										<>
											<IconButton
												onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
												disabled={currentImageIndex === 0}
												sx={{
													position: "absolute",
													top: "50%",
													left: -5,
													transform: "translateY(-50%)",
													p: 0.5,
													bgcolor: "background.paper",
													border: "1px solid",
													borderColor: "divider",
													boxShadow: 1,
													"&:hover": { bgcolor: "action.hover" },
													zIndex: 1,
												}}
											>
												<Icon.ChevronLeft fontSize="small" />
											</IconButton>
											<IconButton
												onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
												disabled={currentImageIndex === images.length - 1}
												sx={{
													position: "absolute",
													top: "50%",
													right: -5,
													transform: "translateY(-50%)",
													p: 0.5,
													bgcolor: "background.paper",
													border: "1px solid",
													borderColor: "divider",
													boxShadow: 1,
													"&:hover": { bgcolor: "action.hover" },
													zIndex: 1,
												}}
											>
												<Icon.ChevronRight fontSize="small" />
											</IconButton>
										</>
									)}
								</Box>
							)}
						</Grid>

						{/* Full Room Details Section */}
						<Grid md={6}>
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
								{amenities.basic && (
									<Grid sm={4}>
										<Typography variant="subtitle2" fontWeight="bold">
											Basic
										</Typography>
										<List dense>
											{amenities.basic.map((amenity, index) => (
												<ListItemText key={index}>
													<Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
														<Icon.Check fontSize="small" color="success" />
														{amenity}
													</Typography>
												</ListItemText>
											))}
										</List>
									</Grid>
								)}
								{amenities.bathroom && (
									<Grid sm={4}>
										<Typography variant="subtitle2" fontWeight="bold">
											Bathroom
										</Typography>
										<List dense>
											{amenities.bathroom.map((amenity, index) => (
												<ListItemText key={index}>
													<Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
														<Icon.Check fontSize="small" color="success" />
														{amenity}
													</Typography>
												</ListItemText>
											))}
										</List>
									</Grid>
								)}
								{amenities.facility && (
									<Grid sm={4}>
										<Typography variant="subtitle2" fontWeight="bold">
											Facilities
										</Typography>
										<List dense>
											{amenities.facility.map((amenity, index) => (
												<ListItemText key={index}>
													<Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
														<Icon.Check fontSize="small" color="success" />
														{amenity}
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
						<Button variant="contained" color="primary">
							Choose Room
						</Button>
					</Box>
				</Box>
			</Modal>
		</>
	);
}

export default RoomCard;
