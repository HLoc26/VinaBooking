import * as React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetBooking } from "../../features/booking/bookingSlice";
import axiosInstance from "../../app/axios";
import { useSafeImageList } from "../../hooks/useSafeImageList";
import MainLayout from "../../components/layout/MainLayout/MainLayout";
import CustomTabPanel from "../../components/ui/CustomTabPanel/CustomTabPanel";
import ReviewsTab from "../../components/ui/ReviewTab/ReviewTab";
import HeaderSection from "./HeaderSection";
import ImageGallery from "./ImageGallery";
import AmenitiesOverview from "./AmenitiesOverview";
import RoomsTabContent from "./RoomsTabContent";
import AmenitiesTabContent from "./AmenitiesTabContent";
import PolicyTabContent from "./PolicyTabContent";
import TabsBar from "./TabsBar";
import NavigationButtons from "./NavigationButtons";

function AccommodationDetail() {
	const { aid } = useParams();
	const dispatch = useDispatch();
	const [activeTab, setActiveTab] = React.useState(0);
	const [selectedImage, setSelectedImage] = React.useState(0);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState(null);
	const [accommodation, setAccommodation] = React.useState({});
	const images = useSafeImageList(accommodation.images);
	const [address, setAddress] = React.useState("");
	const [amenities, setAmenities] = React.useState([]);
	const [rooms, setRoom] = React.useState([]);
	const [reviews, setReviews] = React.useState([]);
	const tabLabels = ["Overview", "Rooms", "Amenities", "Policy", "Reviews"];

	React.useEffect(() => {
		dispatch(resetBooking());
		setLoading(true);
		axiosInstance
			.get(`/accommodations/${aid}`)
			.then((response) => {
				const accomm = response.data.payload.accommodation;
				setAccommodation(accomm);
				setAddress(accomm.address);
				setAmenities(accomm.amenities);
				setRoom(accomm.rooms);
				setReviews(accomm.reviews);
			})
			.catch((error) => {
				console.error("Error fetching accommodation:", error);
				setError("Failed to load accommodation details");
			})
			.finally(() => {
				setLoading(false);
			});
	}, [dispatch, aid]);

	const groupedAmenities = React.useMemo(() => {
		return (amenities || []).reduce((acc, amenity) => {
			const type = amenity.type || "Other";
			if (!acc[type]) acc[type] = [];
			acc[type].push(amenity);
			return acc;
		}, {});
	}, [amenities]);

	return (
		<MainLayout>
			<Box sx={{ width: "100%", mt: "64px" }}>
				<TabsBar activeTab={activeTab} setActiveTab={setActiveTab} tabLabels={tabLabels} />
				{loading ? (
					<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
						<CircularProgress />
					</Box>
				) : error ? (
					<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
						<Typography color="error">{error}</Typography>
					</Box>
				) : (
					<>
						<CustomTabPanel value={activeTab} index={0}>
							<HeaderSection accommodation={accommodation} reviews={reviews} address={address} />
							<ImageGallery images={images} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
							<AmenitiesOverview amenities={amenities} />
						</CustomTabPanel>
						<CustomTabPanel value={activeTab} index={1}>
							<RoomsTabContent rooms={rooms} />
						</CustomTabPanel>
						<CustomTabPanel value={activeTab} index={2}>
							<AmenitiesTabContent groupedAmenities={groupedAmenities} />
						</CustomTabPanel>
						<CustomTabPanel value={activeTab} index={3}>
							<PolicyTabContent accommodation={accommodation} />
						</CustomTabPanel>
						<CustomTabPanel value={activeTab} index={4}>
							<ReviewsTab reviews={reviews} />
						</CustomTabPanel>
						<NavigationButtons activeTab={activeTab} setActiveTab={setActiveTab} tabLabels={tabLabels} />
					</>
				)}
			</Box>
		</MainLayout>
	);
}

export default AccommodationDetail;
