import User from "./User.model.js";
import Room from "./Room.model.js";
import Accommodation from "./Accommodation.model.js";
import Address from "./Address.model.js";
import Booking from "./Booking.model.js";
import BookingItem from "./BookingItem.model.js";
import Amenity from "./Amenity.model.js";
import AccommodationAmenity from "./AccommodationAmenity.model.js";
import RoomAmenity from "./RoomAmenity.model.js";
import Review from "./Review.model.js";
import Policy from "./Policy.model.js";
import SupportTicket from "./SupportTicket.model.js";
import SystemAdmin from "./SystemAdmin.model.js";
import ReviewReply from "./ReviewReply.model.js";
import Notification from "./Notification.model.js";
import FavouriteList from "./FavouriteList.model.js";
import Image from "./Image.model.js";

// Import and execute associations
import "./associations.js";

// prettier-ignore
export {
    User,
    Room,
    Accommodation,
    Address,
    BookingItem,
    Booking,
    Amenity,
    AccommodationAmenity,
    RoomAmenity,
    Review,
    Policy,
    SupportTicket,
    SystemAdmin,
    ReviewReply,
    Notification,
    FavouriteList,
    Image
};
