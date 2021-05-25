class ExpressError extends Error {
	constructor(message, statusCode) {
		//super is a reference to what we extend from, which is Error
		super();
		this.message = message;
		this.statusCode = statusCode;
	}
}

module.exports = ExpressError;
