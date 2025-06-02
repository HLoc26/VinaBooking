import * as React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetBooking } from "../../features/booking/bookingSlice";
import { selectBookingDates } from "../../features/search/searchSlice";
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
	const bookingDates = useSelector(selectBookingDates);
	const [activeTab, setActiveTab] = React.useState(0);
	const [selectedImage, setSelectedImage] = React.useState(0);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState(null);
	const [accommodation, setAccommodation] = React.useState({});
	const images = useSafeImageList(accommodation.images);
	const [address, setAddress] = React.useState("");
	const [amenities, setAmenities] = React.useState([]);
	const [rooms, setRooms] = React.useState([]);
	const [reviews, setReviews] = React.useState([]);
	const tabLabels = ["Overview", "Rooms", "Amenities", "Policy", "Reviews"];

	// Function to fetch static accommodation data
	const fetchAccommodation = React.useCallback(async () => {
		setLoading(true);
		try {
			const startDate = new Date(bookingDates.startDate).toISOString().split("T")[0];
			const endDate = new Date(bookingDates.endDate).toISOString().split("T")[0];
			const response = await axiosInstance.get(`/accommodations/${aid}`, {
				params: { startDate, endDate },
			});
			const accomm = response.data.payload.accommodation;
			setAccommodation(accomm);
			setRooms(accomm.rooms);
			setAddress(accomm.address);
			setAmenities(accomm.amenities);
			setReviews(accomm.reviews);
		} catch (error) {
			console.error("Error fetching accommodation:", error);
			setError("Failed to load accommodation details");
		} finally {
			setLoading(false);
		}
	}, [aid]);

	// Function to fetch rooms based on date range
	const fetchRooms = React.useCallback(async () => {
		if (!bookingDates.startDate || !bookingDates.endDate) return;

		try {
			const startDate = new Date(bookingDates.startDate).toISOString().split("T")[0];
			const endDate = new Date(bookingDates.endDate).toISOString().split("T")[0];
			const response = await axiosInstance.get(`/accommodations/${aid}`, {
				params: { startDate, endDate },
			});

			setRooms(response.data.payload.accommodation.rooms || []);
		} catch (error) {
			console.error("Error fetching rooms:", error);
			setError("Failed to load room data");
		}
	}, [aid, bookingDates]);

	// Initial data fetch on mount
	React.useEffect(() => {
		dispatch(resetBooking());
		fetchAccommodation();
	}, [dispatch, fetchAccommodation]);

	// Fetch rooms when Rooms tab is active or bookingDates change
	React.useEffect(() => {
		if (activeTab === 1 && bookingDates.startDate && bookingDates.endDate) {
			fetchRooms();
		}
	}, [activeTab, bookingDates, fetchRooms]);

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
