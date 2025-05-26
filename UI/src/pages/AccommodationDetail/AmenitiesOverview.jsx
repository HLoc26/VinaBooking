import * as React from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";

function AmenitiesOverview({ amenities }) {
	return (
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
	);
}

export default AmenitiesOverview;
