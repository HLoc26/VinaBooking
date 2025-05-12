// ReviewCard.jsx
import React, { useState, useCallback } from "react";
import { Card, CardHeader, Avatar, CardContent, Typography, Rating, CardActions, IconButton, Box, Modal, CircularProgress, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import * as Icon from "@mui/icons-material";
import { useSafeImageList } from "../../../hooks/useSafeImageList";
import AppImage from "../Image/Image";

const ExpandMore = styled((props) => {
	const { expand, ...other } = props;
	return <IconButton {...other} />;
})(({ theme, expand }) => ({
	transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
	marginLeft: "auto",
	transition: theme.transitions.create("transform", {
		duration: theme.transitions.duration.shortest,
	}),
}));

export default function ReviewCard({ star, comment = "", reviewer, images = [], reviewDate = new Date() }) {
	const theme = useTheme();
	const [expanded, setExpanded] = useState(false);
	const [open, setOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [loading, setLoading] = useState(true);

	const imagesList = useSafeImageList(images);

	// Lấy tên reviewer
	const reviewerName = typeof reviewer === "string" ? reviewer : reviewer?.name || "Unknown";

	const initials = reviewerName
		.split(" ")
		.map((w) => w[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	const handleExpandClick = () => setExpanded((prev) => !prev);

	// Lightbox handlers
	const handleOpen = useCallback((i) => {
		setSelectedIndex(i);
		setLoading(true);
		setOpen(true);
	}, []);
	const handleClose = useCallback(() => setOpen(false), []);
	const showPrev = useCallback(() => setSelectedIndex((i) => (i - 1 + imagesList.length) % imagesList.length), [imagesList.length]);
	const showNext = useCallback(() => setSelectedIndex((i) => (i + 1) % imagesList.length), [imagesList.length]);
	const handleImageLoad = useCallback(() => setLoading(false), []);

	// Border màu theo star
	const borderColor = star >= 4 ? theme.palette.success.main : star >= 3 ? theme.palette.warning.main : theme.palette.error.main;

	return (
		<>
			<Card
				elevation={3}
				sx={{
					with: "100%",
					borderLeft: `5px solid ${borderColor}`,
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}
			>
				<CardHeader
					avatar={<Avatar sx={{ bgcolor: theme.palette.primary.main }}>{initials}</Avatar>}
					action={<Rating value={star} readOnly size="small" precision={0.1} />}
					title={reviewerName}
					subheader={new Intl.DateTimeFormat("en-US", {
						year: "numeric",
						month: "short",
						day: "numeric",
					}).format(new Date(reviewDate))}
				/>

				<CardContent sx={{ flexGrow: 1 }}>
					<Typography
						paragraph
						sx={{
							display: "-webkit-box",
							WebkitLineClamp: expanded ? "none" : 3,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						{comment}
					</Typography>

					{imagesList.length > 0 && (
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)",
								gap: 1,
								mt: 1,
							}}
						>
							{imagesList.map((img, idx) => (
								<Box
									key={idx}
									onClick={() => handleOpen(idx)}
									sx={{
										width: "100%",
										// tạo box vuông, padding-bottom = width
										position: "relative",
										pb: "100%",
										overflow: "hidden",
										borderRadius: 1,
										cursor: "pointer",
										"&:hover img": {
											transform: "scale(1.1)",
										},
									}}
								>
									<AppImage
										filename={img.filename}
										alt=""
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											width: "100%",
											height: "100%",
											objectFit: "cover",
											transition: "transform 0.3s",
										}}
									/>
								</Box>
							))}
						</Box>
					)}
				</CardContent>

				<CardActions disableSpacing>
					{comment.length > 200 && (
						<ExpandMore expand={expanded ? 1 : 0} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
							<Icon.ExpandMore />
						</ExpandMore>
					)}
				</CardActions>
			</Card>

			{/* Modal Lightbox */}
			<Modal open={open} onClose={handleClose}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 2,
						borderRadius: 1,
						maxWidth: "90vw",
						maxHeight: "90vh",
						display: "flex",
						alignItems: "center",
					}}
				>
					<IconButton onClick={showPrev} sx={{ position: "absolute", left: 8, zIndex: 1 }}>
						<Icon.ArrowBackIosNew />
					</IconButton>

					<Box
						sx={{
							position: "relative",
							width: { xs: "80vw", sm: "60vw" },
							height: { xs: "80vh", sm: "60vh" },
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{loading && <CircularProgress />}
						<AppImage
							filename={imagesList[selectedIndex]?.filename}
							alt="Full image"
							onLoad={handleImageLoad}
							style={{
								display: loading ? "none" : "block",
								maxWidth: "100%",
								maxHeight: "100%",
								objectFit: "contain",
							}}
						/>
					</Box>

					<IconButton onClick={showNext} sx={{ position: "absolute", right: 8, zIndex: 1 }}>
						<Icon.ArrowForwardIos />
					</IconButton>
				</Box>
			</Modal>
		</>
	);
}
