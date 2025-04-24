import Accommodation from "./Accommodation.model.js";
import AccommodationAmenity from "./AccommodationAmenity.model.js";
import Address from "./Address.model.js";
import Amenity from "./Amenity.model.js";
import Booking from "./Booking.model.js";
import FavouriteList from "./FavouriteList.model.js";
import Image from "./Image.model.js";
import Invoice from "./Invoice.model.js";
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
User.hasMany(Invoice, { foreignKey: "userId" });
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
	foreignKey: "accommodation_id",
	otherKey: "favourite_list_id",
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
Booking.belongsTo(Invoice, { foreignKey: "invoiceId" });
Booking.belongsTo(Room, { foreignKey: "roomId" });
Booking.belongsTo(User, { foreignKey: "userId" });

// FavouriteList associations
FavouriteList.belongsTo(User, { foreignKey: "userId" });
FavouriteList.belongsToMany(Accommodation, {
	through: "FavouriteItem",
	foreignKey: "favourite_list_id",
	otherKey: "accommodation_id",
});

// Image associations
Image.belongsTo(Accommodation, { foreignKey: "accommodationId" });
Image.belongsTo(Review, { foreignKey: "reviewId" });
Image.belongsTo(Room, { foreignKey: "roomId" });

// Invoice associations
Invoice.hasMany(Booking, { foreignKey: "invoiceId" });
Invoice.belongsTo(User, { foreignKey: "userId" });

// Notification associations
Notification.belongsToMany(User, {
	through: "UserNotification",
	foreignKey: "notificationId",
	otherKey: "userId",
});

// Review associations
Review.hasMany(Image, { foreignKey: "reviewId" });
Review.belongsTo(User, { foreignKey: "userId" });
Review.belongsTo(Accommodation, { foreignKey: "accommodationId" });
Review.hasMany(ReviewReply, { foreignKey: "reviewId" });

// ReviewReply associations
ReviewReply.belongsTo(Review, { foreignKey: "reviewId" });
ReviewReply.belongsTo(User, { foreignKey: "userId" });

// Room associations
Room.belongsTo(Accommodation, { foreignKey: "accommodationId" });
Room.hasMany(Booking, { foreignKey: "roomId" });
Room.hasMany(Image, { foreignKey: "roomId" });
Room.hasMany(RoomAmenity, { foreignKey: "roomId" });

// SupportTicket associations
SupportTicket.belongsTo(User, { foreignKey: "userId" });
SupportTicket.belongsTo(SystemAdmin, { foreignKey: "adminId" });

// SystemAdmin associations
SystemAdmin.hasMany(SupportTicket, { foreignKey: "adminId" });
