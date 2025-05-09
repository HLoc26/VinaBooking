import React, { useState, useCallback } from "react";
import { ImageList, ImageListItem, Paper, Rating, Typography, Modal, Box, IconButton, CircularProgress } from "@mui/material";
import * as Icon from "@mui/icons-material";
import AppImage from "../Image/Image";
import { useSafeImageList } from "../../../hooks/useSafeImageList";

function ReviewCard({ star, comment, reviewer, images, reviewDate = new Date() }) {
	const [open, setOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [loading, setLoading] = useState(true); // Track loading state for the full image

	const imagesList = useSafeImageList(images);

	// Handlers
	const handleOpen = useCallback((index) => {
		setSelectedImageIndex(index);
		setLoading(true); // Set loading to true when opening the modal
		setOpen(true);
	}, []);

	const handleClose = useCallback(() => {
		setOpen(false);
	}, []);

	const handlePrevious = useCallback(() => {
		setSelectedImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length); // Loop to the last image
		setLoading(true); // Reset loading state when navigating
	}, [imagesList.length]);

	const handleNext = useCallback(() => {
		setSelectedImageIndex((prev) => (prev + 1) % imagesList.length); // Loop to the first image
		setLoading(true); // Reset loading state when navigating
	}, [imagesList.length]);

	const handleImageLoad = useCallback(() => {
		setLoading(false); // Set loading to false when the image is fully loaded
	}, []);

	return (
		<Paper elevation={2} sx={{ mb: 2, padding: 2 }}>
			<Typography>
				{reviewer} reviewed at {reviewDate.toLocaleString()}
			</Typography>
			<Rating readOnly value={star} precision={0.1} />
			<ImageList cols={imagesList.length} rowHeight={150}>
				{/* Mock images data */}
				{imagesList.map((item, index) => (
					<ImageListItem key={index} onClick={() => handleOpen(index)} sx={{ cursor: "pointer" }}>
						<AppImage filename={item.filename} />
					</ImageListItem>
				))}
			</ImageList>
			<Typography>{comment}</Typography>

			{/* Modal for full image */}
			<Modal open={open} onClose={handleClose} aria-labelledby="image-modal" aria-describedby="fullsize-review-image">
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
						borderRadius: 2,
						maxWidth: "90vw",
						maxHeight: "90vh",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						overflow: "hidden",
					}}
				>
					<Box sx={{ position: "relative", width: "100%", height: "100%" }}>
						<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
							<IconButton
								onClick={handlePrevious}
								sx={{
									position: "absolute",
									left: 10,
									zIndex: 1,
									color: "black",
									backgroundColor: "rgba(255, 255, 255, 0.7)",
									"&:hover": {
										backgroundColor: "rgba(255, 255, 255, 0.9)",
									},
								}}
							>
								<Icon.ArrowBackIosNew fontSize="medium" />
							</IconButton>

							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									width: "500px",
									height: "500px",
								}}
							>
								{/* Show spinner while loading */}
								{loading && <CircularProgress />}
								<img
									src={imagesList[selectedImageIndex]?.img}
									alt="Full view"
									style={{
										maxWidth: "100%",
										maxHeight: "70vh",
										objectFit: "contain",
										display: loading ? "none" : "block", // Hide image while loading
									}}
									onLoad={handleImageLoad} // Trigger when the image is fully loaded
								/>
							</Box>

							<IconButton
								onClick={handleNext}
								sx={{
									position: "absolute",
									right: 10,
									zIndex: 1,
									color: "black",
									backgroundColor: "rgba(255, 255, 255, 0.7)",
									"&:hover": {
										backgroundColor: "rgba(255, 255, 255, 0.9)",
									},
								}}
							>
								<Icon.ArrowForwardIos fontSize="medium" />
							</IconButton>
						</Box>

						<IconButton
							onClick={handleClose}
							sx={{
								position: "absolute",
								top: -16,
								right: -16,
								color: "black",
								backgroundColor: "rgba(255, 255, 255, 0.7)",
								"&:hover": {
									backgroundColor: "rgba(255, 255, 255, 0.9)",
								},
							}}
						>
							<Icon.Close fontSize="small" />
						</IconButton>
					</Box>
				</Box>
			</Modal>
		</Paper>
	);
}

export default ReviewCard;
