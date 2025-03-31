/**
 * @class SystemAdmin
 */
class SystemAdmin {
    constructor(id, username, password) {
        this.id = id
        this.username = username;
        this.password = password
    }

    resolveSupportTicket(supportTicket) { }
    sendNotification(message, users) { }
    activateUser(user) { }
    disableUser(user) { }
    activateRoom(room) { }
    disableRoom(room) { }
    activateAccommodation(accommodation) { }
    disableAccommodation(accommodation) { }
}

export default SystemAdmin;
