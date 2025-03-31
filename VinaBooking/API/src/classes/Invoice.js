/**
 * Information about an invoice. Contains 1 or many bookings.
 * @class Invoice
 */
class Invoice {
    constructor(id, bookings) {
        this.id = id;
        this.bookings = bookings;
    }

    calculateTotalPrice() {
        
    }
}

export default Invoice;
