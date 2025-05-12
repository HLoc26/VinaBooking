import { Card, CardMedia, CardContent, CardActions, Typography, Rating, Stack, Button, Chip, Box } from "@mui/material";
import { LocationOn, Hotel } from "@mui/icons-material";
import convertPrice from "../../../utils/convertPrice";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { useNavigate } from "react-router-dom";

// Modified version of HotelCard specifically for favorites page
const FavoriteCard = ({ accommodation, onRemove }) => {
	const navigate = useNavigate();
	const { name = "Accommodation Name", rooms = [], isActive = true } = accommodation;

	// Calculate how many amenity chips to show
	const calculateVisibleChips = (amenities) => {
		const maxTotalCharLength = 30;
		let totalChars = 0;
		let visibleCount = 0;

		for (let i = 0; i < amenities.length; i++) {
			const amenityLength = amenities[i].name.length;
			if (totalChars + amenityLength <= maxTotalCharLength) {
				totalChars += amenityLength;
				visibleCount++;
			} else {
				break;
			}
		}

		return visibleCount || 1;
	};

	const amenities = accommodation.amenities;
	const maxChipsToShow = calculateVisibleChips(amenities);
	const visibleAmenities = amenities.slice(0, maxChipsToShow);
	const remainingCount = amenities.length > maxChipsToShow ? amenities.length - maxChipsToShow : 0;
	const minPrice = accommodation.minPrice;
	const location = accommodation.address;

	return (
		<Card
			sx={{
				display: "flex",
				flexDirection: { xs: "column", md: "row" },
				width: "100%",
				maxWidth: { md: 800 },
				borderRadius: 2,
				boxShadow: 3,
			}}
		>
			{/* Accommodation Image */}
			<CardMedia
				component="img"
				sx={{
					width: { xs: "100%", md: "250px" },
					height: { xs: "200px", md: "auto" },
					objectFit: "cover",
					borderRadius: { xs: "8px 8px 0 0", md: "8px 0 0 8px" },
				}}
				image="https://th.bing.com/th/id/R.286b917dbac88394a863dd814ee19bda?rik=twiYWEn5m8hQ2A&pid=ImgRaw&r=0"
				alt={`${name} Image`}
			/>

			{/* Accommodation Details */}
			<Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
				<CardContent sx={{ padding: 2 }}>
					{/* Accommodation Name */}
					<Typography variant="h6" fontWeight="bold" gutterBottom>
						{name}
					</Typography>

					{/* Status Indicator */}
					<Box mb={1}>
						<Chip size="small" color={isActive ? "success" : "error"} label={isActive ? "Active" : "Inactive"} />
					</Box>

					{/* Location */}
					<Typography variant="body2" color="text.secondary" mb={2}>
						<LocationOn sx={{ fontSize: "small", verticalAlign: "middle", marginRight: 0.5 }} />
						{location}
					</Typography>

					{/* Room Details */}
					<Box mb={1}>
						<Typography variant="body2" display="flex" alignItems="center">
							<Hotel sx={{ fontSize: "small", marginRight: 0.5 }} />
							{rooms.length} {rooms.length === 1 ? "room" : "rooms"} available
						</Typography>
					</Box>

					{/* Amenities */}
					{amenities.length > 0 && (
						<Box mb={1}>
							<Typography variant="body2" fontWeight="bold" gutterBottom>
								Amenities:
							</Typography>
							<Stack direction="row" spacing={1} sx={{ overflow: "hidden", whiteSpace: "nowrap" }}>
								{visibleAmenities.map((amenity, index) => (
									<Chip key={index} label={amenity.name} size="small" color="primary" variant="outlined" />
								))}
								{remainingCount > 0 && <Chip label={`+${remainingCount}`} size="small" color="primary" variant="outlined" />}
							</Stack>
						</Box>
					)}
				</CardContent>

				{/* Actions */}
				<CardActions
					sx={{
						justifyContent: "space-between",
						padding: 2,
						borderTop: "1px solid #e0e0e0",
						marginTop: "auto",
					}}
				>
					<Typography variant="h6" fontWeight="bold" color="primary">
						{minPrice !== "N/A" ? `${convertPrice(minPrice)} VND` : "Price unavailable"}
					</Typography>
					<Stack direction="row" spacing={1}>
						<Button
							variant="contained"
							size="small"
							color="primary"
							onClick={() => {
								navigate(`/accommodation/detail/${accommodation.id}`);
							}}
						>
							View Details
						</Button>
						<FavoriteButton accommodation={accommodation} onRemove={onRemove} size="small" />
					</Stack>
				</CardActions>
			</Box>
		</Card>
	);
};

export default FavoriteCard;
