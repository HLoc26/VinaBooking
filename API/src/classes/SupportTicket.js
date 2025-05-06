/**
 * @class SupportTicket
 */
class SupportTicket {
	constructor(subject, description, screenshots, createdDate, resolveDate) {
		this.subject = subject;
		this.description = description;
		this.screenshots = screenshots;
		this.createdDate = createdDate;
		this.resolveDate = resolveDate;
	}
}

export default SupportTicket;
