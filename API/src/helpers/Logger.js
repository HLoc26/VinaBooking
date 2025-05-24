class Logger {
	// ANSI foreground + background color map
	#colorMap = {
		info: ["\x1b[36m", "\x1b[46m"], // Cyan text on Cyan bg
		error: ["\x1b[31m", "\x1b[41m"], // Red text on Red bg
		request: ["\x1b[33m", "\x1b[43m"], // Yellow text on Yellow bg
		success: ["\x1b[32m", "\x1b[42m"], // Green text on Green bg
		default: ["\x1b[37m", "\x1b[47m"], // White text on White bg
	};

	#log(type, message, level = "default") {
		const [fg, bg] = this.#colorMap[level] || this.#colorMap.default;
		const reset = "\x1b[0m";
		const prefix = `[${type.toUpperCase()}]`;
		console.log(`${bg}${fg}%s${reset}`, `${prefix} ${message}`);
	}

	info(message) {
		this.#log("info", message, "info");
	}

	success(message) {
		this.#log("success", message, "success");
	}

	error(message) {
		this.#log("error", message, "error");
	}

	requestLog(req) {
		const msg = `${req.ip} -> ${req.method} ${req.originalUrl}`;
		this.#log("request", msg, "request");
	}

	responseLog(res, duration) {
		let level = "default";
		if (res.statusCode >= 200 && res.statusCode < 300) level = "success";
		else if (res.statusCode >= 500) level = "error";

		const msg = `${res.statusCode} (${duration}ms)`;
		this.#log("response", msg, level);
	}
}

export default new Logger();
