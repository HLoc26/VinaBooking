import { Card, CardMedia, CardActions, CardContent, Typography, Rating, Stack, Button, Chip, Box } from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import convertPrice from "../../../utils/convertPrice";

function HotelCard({ name = "Hotel Name", location = "Location", amenities = [], minPrice = "Price VND", rating = 4.5 }) {
	// Maximum total character length allowed for all visible chips combined
	const maxTotalCharLength = 30; // Adjust this value based on your design needs

	// Calculate how many chips can fit based on character length
	const calculateVisibleChips = (amenities) => {
		let totalChars = 0;
		let visibleCount = 0;

		for (let i = 0; i < amenities.length; i++) {
			const amenityLength = amenities[i].length;
			if (totalChars + amenityLength <= maxTotalCharLength) {
				totalChars += amenityLength;
				visibleCount++;
			} else {
				break; // Stop when we exceed the max character length
			}
		}

		return visibleCount || 1; // Ensure at least 1 chip is shown, even if it overflows
	};

	// Determine the number of visible chips dynamically
	const maxChipsToShow = calculateVisibleChips(amenities);
	const visibleAmenities = amenities.slice(0, maxChipsToShow);
	const remainingCount = amenities.length > maxChipsToShow ? amenities.length - maxChipsToShow : 0;

	return (
		<Card
			sx={{
				display: "flex",
				flexDirection: { xs: "column", md: "row" }, // Column on mobile, row on desktop
				width: "100%", // Full width on all devices
				maxWidth: { md: 800 }, // Limit width only on medium and larger devices
				borderRadius: 2,
				boxShadow: 3,
			}}
			style={{ width: "100%" }}
		>
			{/* Hotel Image */}
			<CardMedia
				component="img"
				sx={{
					width: { xs: "100%", md: "250px" }, // Full width on mobile, fixed width on desktop
					height: { xs: "200px", md: "auto" }, // Fixed height on mobile
					objectFit: "cover",
					borderRadius: { xs: "8px 8px 0 0", md: "8px 0 0 8px" }, // Rounded corners
				}}
				image="https://th.bing.com/th/id/R.286b917dbac88394a863dd814ee19bda?rik=twiYWEn5m8hQ2A&pid=ImgRaw&r=0"
				alt={`${name} Image`}
			/>

			{/* Hotel Details */}
			<Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
				<CardContent sx={{ padding: 2 }}>
					{/* Hotel Name */}
					<Typography variant="h6" fontWeight="bold" gutterBottom>
						{name}
					</Typography>

					{/* Rating */}
					<Stack direction="row" alignItems="center" spacing={1} mb={1}>
						<Rating value={rating} precision={0.5} readOnly />
						<Typography variant="body2" color="text.secondary">
							{rating} / 5
						</Typography>
					</Stack>

					{/* Location */}
					<Typography variant="body2" color="text.secondary" mb={2}>
						<LocationOn sx={{ fontSize: "small", verticalAlign: "middle", marginRight: 0.5 }} />
						{location}
					</Typography>

					{/* Amenities */}
					<Box mb={1}>
						<Typography variant="body2" fontWeight="bold" gutterBottom>
							Amenities:
						</Typography>
						<Stack direction="row" spacing={1} sx={{ overflow: "hidden", whiteSpace: "nowrap" }}>
							{visibleAmenities.map((amenity, index) => (
								<Chip key={index} label={amenity} size="small" color="primary" variant="outlined" />
							))}
							{remainingCount > 0 && <Chip label={`+${remainingCount}`} size="small" color="primary" variant="outlined" />}
						</Stack>
					</Box>
				</CardContent>

				{/* Actions */}
				<CardActions
					sx={{
						justifyContent: "space-between",
						padding: 2,
						borderTop: "1px solid #e0e0e0",
						marginTop: "auto", // Push actions to the bottom
					}}
				>
					<Typography variant="h6" fontWeight="bold" color="primary">
						{convertPrice(minPrice)} VND
					</Typography>
					<Stack direction="row" spacing={1}>
						<Button variant="contained" size="small" color="primary">
							Choose room
						</Button>
					</Stack>
				</CardActions>
			</Box>
		</Card>
	);
}

export default HotelCard;
