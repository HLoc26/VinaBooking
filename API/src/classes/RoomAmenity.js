import Amenity from "./Amenity";

/**
 * A room's single amenity. Room will contain a list of this class.
 * @class RoomAmenity
 * @extends {Amenity}
 */
class RoomAmenity extends Amenity {
    /**
     * @param {number} id 
     * @param {string} name 
     * @param {number} roomId 
     * @param {ERoomAmenityType} type
     */
    constructor(id, name, roomId, type) {
        super(id, name);
        this.roomId = roomId;
        this.type = type;
    }
}

/**
 * Enum for room amenity types.
 * @readonly
 * @enum {string}
 */
export const ERoomAmenityType = Object.freeze({
    BASE: "base",
    BATHROOM: "bathroom",
    FACILITY: "facility"
});

export default RoomAmenity;