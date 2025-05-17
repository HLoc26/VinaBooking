export default {
	validateSearch(req, res, next) {
		const rules = {
			startDate: {
				isInvalid: (val) => isNaN(Date.parse(val)),
				message: "Invalid startDate format, use YYYY-MM-DD.",
			},
			endDate: {
				isInvalid: (val) => isNaN(Date.parse(val)),
				message: "Invalid startDate format, use YYYY-MM-DD.",
			},
			roomCount: {
				isInvalid: (val) => !Number.isInteger(+val) || +val < 1,
				message: "roomCount must be a positive integer.",
			},
			adultCount: {
				isInvalid: (val) => !Number.isInteger(+val) || +val < 1,
				message: "adultCount must be a positive integer.",
			},
			priceMin: {
				isInvalid: (val) => isNaN(+val) || +val < 0,
				message: "priceMin must be a non-negative number.",
			},
			priceMax: {
				// Check if it is a valid number AND it must be > priceMin
				isInvalid: (val) => isNaN(+val) || +val < 0 || (req.query.priceMin !== undefined && +val < +req.query.priceMin),
				message: "priceMax must be a non-negative number and >= priceMin",
			},
		};

		const errors = [];

		// For each value, if it is in the query, check for its validity
		for (const key in rules) {
			const val = req.query[key];
			if (val !== undefined && rules[key].isInvalid(val)) {
				errors.push(rules[key].message);
			}
		}

		if (errors.length) {
			return res.status(400).json({
				success: false,
				error: {
					code: 400,
					message: errors.join(" "),
				},
			});
		}

		next();
	},
};
