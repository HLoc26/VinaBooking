import * as React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useParams } from "react-router-dom";

import CustomTabPanel from "../../components/ui/CustomTabPanel/CustomTabPanel";
import MainLayout from "../../components/layout/MainLayout/MainLayout";
import ReviewCard from "../../components/ui/ReviewCard/ReviewCard";

function AccommodationDetail() {
	const { aid } = useParams();
	const [activeTab, setActiveTab] = React.useState(0);

	const handleChangeTab = (e, newValue) => {
		setActiveTab(newValue);
	};

	function a11yProps(index) {
		return {
			id: `simple-tab-${index}`,
			"aria-controls": `simple-tabpanel-${index}`,
		};
	}

	// Mock data for reviews
	const reviews = [
		{ star: 4.5, reviewDate: new Date(), reviewer: "John Doe", comment: "Great place to stay!" },
		{ star: 4.0, reviewDate: new Date(), reviewer: "Jane Smith", comment: "Very clean and comfortable." },
		{ star: 5.0, reviewDate: new Date(), reviewer: "Alice Johnson", comment: "Amazing experience!" },
		{ star: 3.5, reviewDate: new Date(), reviewer: "Bob Brown", comment: "Good, but could be better." },
		{ star: 4.8, reviewDate: new Date(), reviewer: "Charlie Davis", comment: "Highly recommend this place!" },
		{ star: 4.2, reviewDate: new Date(), reviewer: "Emily Wilson", comment: "Nice and cozy." },
		{ star: 3.0, reviewDate: new Date(), reviewer: "Frank Miller", comment: "Average experience." },
		{ star: 5.0, reviewDate: new Date(), reviewer: "Grace Lee", comment: "Perfect for a weekend getaway!" },
		{ star: 4.7, reviewDate: new Date(), reviewer: "Henry White", comment: "Loved the amenities!" },
		{ star: 4.3, reviewDate: new Date(), reviewer: "Ivy Green", comment: "Would definitely come back." },
	];
	// Mock data
	const itemData = [
		{
			img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
			title: "Breakfast",
		},
		{
			img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
			title: "Burger",
		},
		{
			img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
			title: "Camera",
		},
		{
			img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
			title: "Coffee",
		},
		{
			img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
			title: "Hats",
		},
		{
			img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
			title: "Honey",
		},
		{
			img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
			title: "Basketball",
		},
		{
			img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
			title: "Fern",
		},
		{
			img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
			title: "Mushrooms",
		},
		{
			img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
			title: "Tomato basil",
		},
		{
			img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
			title: "Sea star",
		},
		{
			img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
			title: "Bike",
		},
	];

	return (
		<MainLayout>
			<Box sx={{ width: "100%" }}>
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<Tabs value={activeTab} onChange={handleChangeTab}>
						<Tab label="Overview" {...a11yProps(0)} />
						<Tab label="Rooms" {...a11yProps(1)} />
						<Tab label="Amenities" {...a11yProps(2)} />
						<Tab label="Policy" {...a11yProps(3)} />
						<Tab label="Reviews" {...a11yProps(4)} />
					</Tabs>
				</Box>
				<CustomTabPanel value={activeTab} index={0}>
					This is overview for room {aid}
				</CustomTabPanel>
				<CustomTabPanel value={activeTab} index={1}>
					Rooms
				</CustomTabPanel>
				<CustomTabPanel value={activeTab} index={2}>
					Amenities
				</CustomTabPanel>
				<CustomTabPanel value={activeTab} index={3}>
					Policy
				</CustomTabPanel>
				<CustomTabPanel value={activeTab} index={4}>
					{reviews.map((review, index) => (
						<ReviewCard
							key={index}
							star={review.star}
							reviewDate={review.reviewDate}
							images={itemData} // A list of images, could be empty
							reviewer={review.reviewer}
							comment={review.comment}
						/>
					))}
				</CustomTabPanel>
			</Box>
		</MainLayout>
	);
}

export default AccommodationDetail;
