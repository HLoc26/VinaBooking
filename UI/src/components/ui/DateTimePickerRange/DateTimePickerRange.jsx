import * as React from "react";
import * as Icon from "@mui/icons-material";
import styles from "./DateTimePickerRange.module.css";

function DateTimePickerRange({
	showTime = true,
	numMonths = 2,
	direction = "horizontal",
	minDate = null,
	value = { startDate: new Date(), endDate: new Date() }, // Controlled value
	onChange = () => {}, // Callback for changes
}) {
	const [range, setRange] = React.useState(value);
	const [isOpen, setIsOpen] = React.useState(false);
	const [monthOffset, setMonthOffset] = React.useState(0);
	const pickerRef = React.useRef(null);

	React.useEffect(() => {
		setRange(value); // Sync with controlled value
	}, [value]);

	// Utility to format date and time
	const formatDateTime = (date) =>
		date.toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			...(showTime && { hour: "2-digit", minute: "2-digit" }),
		});

	// Generate days for a month, including next month's overflow
	const getDaysInMonth = (date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const days = [];
		const lastDay = new Date(year, month + 1, 0);

		for (let i = 1; i <= lastDay.getDate(); i++) {
			days.push(new Date(year, month, i));
		}

		return days;
	};

	// Handle date selection
	const handleDateClick = (day) => {
		if (!day || (minDate && day < minDate)) return;

		let newRange;
		if (day > range.endDate) {
			newRange = { ...range, endDate: day };
		} else if (day < range.endDate) {
			newRange = { startDate: day, endDate: day };
		} else {
			newRange = range;
		}

		setRange(newRange);
		onChange(newRange); // Notify parent
	};

	// Handle time change
	const handleTimeChange = (type, value) => {
		const [hours, minutes] = value.split(":");
		const newDate = new Date(type === "start" ? range.startDate : range.endDate);
		newDate.setHours(parseInt(hours), parseInt(minutes));

		const newRange = {
			...range,
			[type === "start" ? "startDate" : "endDate"]: newDate,
		};

		setRange(newRange);
		onChange(newRange); // Notify parent
	};

	// Close picker when clicking outside
	React.useEffect(() => {
		const handleClickOutside = (event) => {
			if (pickerRef.current && !pickerRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Generate months based on numMonths and offset
	const startMonth = new Date();
	const months = Array.from({ length: numMonths }, (_, i) => {
		const monthDate = new Date(startMonth.getFullYear(), startMonth.getMonth() + i + monthOffset, 1);
		return {
			date: monthDate,
			days: getDaysInMonth(monthDate),
		};
	});

	return (
		<div className={styles.dateRangePicker}>
			{/* Display selected range */}
			<div className={`${styles.rangeDisplay}`} onClick={() => setIsOpen(!isOpen)}>
				<Icon.CalendarMonth />
				{formatDateTime(range.startDate)} - {formatDateTime(range.endDate)}
			</div>

			{/* Dropdown picker */}
			{isOpen && (
				<div className={`${styles.pickerDropdown}`} ref={pickerRef}>
					<div className={`${styles.navigation}`}>
						<button type="button" onClick={() => setMonthOffset((prev) => prev - 1)}>
							<Icon.ArrowLeftTwoTone />
						</button>
						<button type="button" onClick={() => setMonthOffset((prev) => prev + 1)}>
							<Icon.ArrowRightTwoTone />
						</button>
					</div>
					<div className={`${styles.calendars} ${direction == "horizontal" ? styles.horizontal : styles.vertical}`}>
						{months.map((month, index) => (
							<div key={index} className={`${styles.calendar}`}>
								<div className={`${styles.monthHeader}`}>{month.date.toLocaleString("en-US", { month: "long", year: "numeric" })}</div>
								<div className={`${styles.dayGrid}`}>
									{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
										<div key={day} className={`${styles.dayHeader}`}>
											{day}
										</div>
									))}
									{/* Empty slots before the first day */}
									{Array.from({ length: new Date(month.date.getFullYear(), month.date.getMonth(), 1).getDay() }).map((_, idx) => (
										<div key={`empty-start-${idx}`} className={`${styles.day} ${styles.empty}`}></div>
									))}
									{month.days.map((day, idx) => {
										const classes = [styles.day];

										if (minDate && day < minDate) {
											classes.push(styles.muted);
										} else if (range.startDate.toDateString() === day.toDateString() && range.endDate.toDateString() === day.toDateString()) {
											classes.push(styles.selected, styles.single);
										} else if (range.startDate.toDateString() === day.toDateString()) {
											classes.push(styles.selected, styles.start);
										} else if (range.endDate.toDateString() === day.toDateString()) {
											classes.push(styles.selected, styles.end);
										} else if (day >= range.startDate && day <= range.endDate) {
											classes.push(styles.inRange);
										}

										return (
											<div key={idx} className={classes.join(" ")} onClick={() => day && handleDateClick(day)}>
												{day.getDate()}
											</div>
										);
									})}
								</div>
							</div>
						))}
					</div>

					{/* Time Pickers (conditional) */}
					{showTime && (
						<div className={`${styles.timePickers}`}>
							<div className={`${styles.timePicker}`}>
								<label>Start Time:</label>
								<input
									type="time"
									value={`${range.startDate.getHours().toString().padStart(2, "0")}:${range.startDate.getMinutes().toString().padStart(2, "0")}`}
									onChange={(e) => handleTimeChange("start", e.target.value)}
								/>
							</div>
							<div className={`${styles.timePicker}`}>
								<label>End Time:</label>
								<input
									type="time"
									value={`${range.endDate.getHours().toString().padStart(2, "0")}:${range.endDate.getMinutes().toString().padStart(2, "0")}`}
									onChange={(e) => handleTimeChange("end", e.target.value)}
								/>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default DateTimePickerRange;

/** USAGE:
 * const [dateRange, setDateRange] = React.useState({
		startDate: new Date(),
		endDate: new Date(),
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Selected Date Range:", dateRange);
	};

	return (
		<form onSubmit={handleSubmit}>
			<DateTimePickerRange
				value={dateRange} // This value will be set when user select date, and will be used as form data
				minDate={startOfToday()} // Today
				onChange={(newRange) => setDateRange(newRange)}
				showTime={true}
				numMonths={2}
			/>
			<button type="submit">Submit</button>
		</form>
	);
 */
