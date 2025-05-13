import Accommodation from "./Accommodation.model.js";
import AccommodationAmenity from "./AccommodationAmenity.model.js";
import Address from "./Address.model.js";
import Amenity from "./Amenity.model.js";
import Booking from "./Booking.model.js";
import BookingItem from "./BookingItem.model.js";
import FavouriteList from "./FavouriteList.model.js";
import Image from "./Image.model.js";
import Notification from "./Notification.model.js";
import Policy from "./Policy.model.js";
import Review from "./Review.model.js";
import ReviewReply from "./ReviewReply.model.js";
import Room from "./Room.model.js";
import RoomAmenity from "./RoomAmenity.model.js";
import SupportTicket from "./SupportTicket.model.js";
import SystemAdmin from "./SystemAdmin.model.js";
import User from "./User.model.js";

// User associations
User.hasMany(Booking, { foreignKey: "userId" });
User.hasOne(FavouriteList, { as: "userFavourites", foreignKey: "userId" });
User.hasMany(Notification, { foreignKey: "userId" });
User.hasMany(Review, { foreignKey: "userId" });
User.hasMany(ReviewReply, { foreignKey: "userId" });
User.hasMany(SupportTicket, { foreignKey: "userId" });
User.hasMany(Accommodation, { as: "ownedAccommodations", foreignKey: "ownerId" });

// Accommodation associations
Accommodation.hasMany(AccommodationAmenity, { foreignKey: "accommodationId" });
Accommodation.hasOne(Address, { foreignKey: "accommodationId" });
Accommodation.hasMany(Image, { foreignKey: "accommodationId" });
Accommodation.hasMany(Review, { foreignKey: "accommodationId" });
Accommodation.hasMany(Room, { foreignKey: "accommodationId" });
Accommodation.hasOne(Policy, { foreignKey: "accommodationId" });
Accommodation.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
Accommodation.belongsToMany(FavouriteList, {
	through: "FavouriteItem",
	foreignKey: "accommodationId",
	otherKey: "favouriteListId",
});
// Address associations
Address.belongsTo(Accommodation, { foreignKey: "accommodationId" });

// Amenity associations
Amenity.hasMany(RoomAmenity, { foreignKey: "id" });
Amenity.hasMany(AccommodationAmenity, { foreignKey: "id" });

// Amenity - Accommodation associations
AccommodationAmenity.belongsTo(Accommodation, { foreignKey: "accommodationId" });
AccommodationAmenity.belongsTo(Amenity, { foreignKey: "id" });

// Amenity - Room associations
RoomAmenity.belongsTo(Room, { foreignKey: "roomId" });
RoomAmenity.belongsTo(Amenity, { foreignKey: "id" });

// Booking associations
Booking.hasMany(BookingItem, { foreignKey: "bookingId" });
Booking.belongsTo(User, { foreignKey: "userId" });

// FavouriteList associations
FavouriteList.belongsTo(User, { foreignKey: "userId" });
FavouriteList.belongsToMany(Accommodation, {
	through: "FavouriteItem",
	foreignKey: "favouriteListId",
	otherKey: "accommodationId",
});

// Image associations
Image.belongsTo(Accommodation, { foreignKey: "accommodationId" });
Image.belongsTo(Review, { foreignKey: "reviewId" });
Image.belongsTo(Room, { foreignKey: "roomId" });

// Notification associations
Notification.belongsToMany(User, {
	through: "UserNotification",
	foreignKey: "notificationId",
	otherKey: "userId",
});

// Review associations
Review.hasMany(Image, { foreignKey: "reviewId" });
Review.belongsTo(User, { as: "reviewer", foreignKey: "userId" });
Review.belongsTo(Accommodation, { foreignKey: "accommodationId" });
Review.hasMany(ReviewReply, { foreignKey: "reviewId" });

// ReviewReply associations
ReviewReply.belongsTo(Review, { foreignKey: "reviewId" });
ReviewReply.belongsTo(User, { foreignKey: "userId" });

// Room associations
Room.belongsTo(Accommodation, { foreignKey: "accommodationId" });
Room.hasMany(Image, { foreignKey: "roomId" });
Room.hasMany(RoomAmenity, { foreignKey: "roomId" });
Room.hasMany(BookingItem, { foreignKey: "roomId" });

// SupportTicket associations
SupportTicket.belongsTo(User, { foreignKey: "userId" });
SupportTicket.belongsTo(SystemAdmin, { foreignKey: "adminId" });

// SystemAdmin associations
SystemAdmin.hasMany(SupportTicket, { foreignKey: "adminId" });

// BookingItem associations
BookingItem.belongsTo(Room, {
	foreignKey: "roomId",
});
BookingItem.belongsTo(Booking, {
	foreignKey: "bookingId",
});
