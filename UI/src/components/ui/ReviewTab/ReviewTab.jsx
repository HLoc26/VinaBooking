// ReviewsTab.jsx
import React from "react";
import { Container, Box, Typography, Rating, LinearProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ReviewCard from "../ReviewCard/ReviewCard";

export default function ReviewsTab({ reviews }) {
	const theme = useTheme();
	const total = reviews.length;
	const average = total > 0 ? reviews.reduce((sum, r) => sum + Number(r.star), 0) / total : 0;

	// Tính phân phối 5→1 sao
	const distribution = [5, 4, 3, 2, 1].map((star) => ({
		star,
		count: reviews.filter((r) => Number(r.star) === star).length,
	}));

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{/* === SUMMARY HEADER === */}
			<Box sx={{ textAlign: "center", mb: 6 }}>
				<Typography variant="h4" fontWeight="bold">
					Customer Reviews
				</Typography>
				<Box sx={{ display: "inline-flex", alignItems: "center", mt: 1 }}>
					<Typography variant="h2" fontWeight="bold" sx={{ mr: 1 }}>
						{average.toFixed(1)}
					</Typography>
					<Rating readOnly value={average} precision={0.1} size="large" />
				</Box>
				<Typography variant="subtitle1" color="text.secondary">
					{total} review{total !== 1 && "s"}
				</Typography>
				<Box sx={{ mt: 2, maxWidth: 400, mx: "auto" }}>
					{distribution.map(({ star, count }) => (
						<Box key={star} sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
							<Typography variant="body2" sx={{ width: 28 }}>
								{star}{" "}
								<Box component="span" sx={{ color: theme.palette.warning.main }}>
									★
								</Box>
							</Typography>
							<LinearProgress variant="determinate" value={total ? (count / total) * 100 : 0} sx={{ flexGrow: 1, mx: 1, height: 8, borderRadius: 4 }} />
							<Typography variant="body2" sx={{ width: 24, textAlign: "right" }}>
								{count}
							</Typography>
						</Box>
					))}
				</Box>
			</Box>

			{/* === REVIEW CARDS === */}
			{total > 0 ? (
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "1fr", // <-- mỗi hàng chỉ 1 card
						gap: 2,
						width: "100%",
					}}
				>
					{reviews.map((r, idx) => (
						<Box key={idx} sx={{ width: "100%" }}>
							<ReviewCard star={Number(r.star)} comment={r.comment} reviewer={r.reviewer.name} reviewDate={r.reviewDate} images={r.images || []} />
						</Box>
					))}
				</Box>
			) : (
				<Typography variant="body2" color="text.secondary">
					No reviews yet.
				</Typography>
			)}
		</Container>
	);
}
