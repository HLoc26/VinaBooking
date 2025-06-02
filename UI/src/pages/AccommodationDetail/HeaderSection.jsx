import { Stack, Typography, Rating } from "@mui/material";
import { LocationOn as LocationIcon } from "@mui/icons-material";
import FavoriteButton from "../../components/ui/FavoriteButton/FavoriteButton";

function HeaderSection({ accommodation, reviews, address }) {
	return (
		<Stack direction="column" spacing={1} alignItems="center">
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<Typography variant="h4">{accommodation.name}</Typography>
				<FavoriteButton accommodation={accommodation} />
			</Stack>
			<Stack direction="row" spacing={1} alignItems="center">
				<Rating value={Number(accommodation.rating)} precision={0.1} readOnly />
				<Typography variant="body2" color="text.secondary">
					{Number(accommodation.rating).toFixed(1)} ({reviews?.length ?? 0} reviews)
				</Typography>
			</Stack>
			{/* Address section */}
			{address && (
				<Stack direction="row" alignItems="flex-start" spacing={1}>
					<LocationIcon
						sx={{
							fontSize: "1.1rem",
							mt: 0.1,
							flexShrink: 0,
						}}
					/>
					<Typography
						variant="body2"
						sx={{
							lineHeight: 1.4,
							cursor: "pointer",
							"&:hover": {
								textDecoration: "underline",
							},
						}}
						onClick={() => {
							// Open in maps
							const encodedAddress = encodeURIComponent(address);
							window.open(`https://maps.google.com?q=${encodedAddress}`, "_blank");
						}}
					>
						{address}
					</Typography>
				</Stack>
			)}
		</Stack>
	);
}

export default HeaderSection;
