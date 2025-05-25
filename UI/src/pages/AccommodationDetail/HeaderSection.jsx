import * as React from "react";
import { Stack, Typography, Rating } from "@mui/material";
import FavoriteButton from "../../components/ui/FavoriteButton/FavoriteButton";

function HeaderSection({ accommodation, reviews, address }) {
	return (
		<Stack direction="column" spacing={1}>
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
			<Typography variant="body2" color="text.secondary">
				Address: {address}
			</Typography>
		</Stack>
	);
}

export default HeaderSection;
