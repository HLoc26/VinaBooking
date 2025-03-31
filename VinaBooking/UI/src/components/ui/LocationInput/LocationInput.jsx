import React, { useState, useRef, useEffect } from "react";
import styles from "./LocationInput.module.css";

function LocationInput({ value, onSelect, onChange }) {
	// State management
	const [query, setQuery] = useState(value);
	const [suggestions, setSuggestions] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [focusedIndex, setFocusedIndex] = useState(-1);

	// Refs for DOM reference and debouncing
	const componentRef = useRef(null);
	const debounceTimeout = useRef(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (componentRef.current && !componentRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Fetch location suggestions from Nominatim API
	const fetchSuggestions = async (query) => {
		if (!query) {
			setSuggestions([]);
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`);
			if (!response.ok) throw new Error("Network response was not ok");
			const data = await response.json();
			setSuggestions(data);
			setIsLoading(false);
		} catch (error) {
			console.error("Error fetching location suggestions:", error);
			setSuggestions([]);
			setError("Failed to fetch suggestions");
			setIsLoading(false);
		}
	};

	// Handle input changes with debouncing
	const handleInputChange = (e) => {
		const value = e.target.value;
		setQuery(value);
		setError(null);
		if (value) {
			setShowDropdown(true);
			if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
			debounceTimeout.current = setTimeout(() => fetchSuggestions(value), 500);
		} else {
			setSuggestions([]);
			setShowDropdown(false);
		}
	};

	// Handle suggestion selection
	const handleSelect = (suggestion) => {
		setQuery(suggestion.display_name);
		setSuggestions([]);
		setShowDropdown(false);
		if (onSelect) onSelect(suggestion);
		if (onChange) onChange(suggestion);
	};

	useEffect(() => {
		const style = document.createElement("style");
		style.textContent = `.location-input::placeholder { color: #1976d2; }`;
		document.head.appendChild(style);
		return () => document.head.removeChild(style);
	}, []);

	return (
		<div className={styles.locationInputContainer} ref={componentRef} style={{ position: "relative", width: "100%" }}>
			{/* LocationOn Icon */}
			<div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#1976d2">
					<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
				</svg>
			</div>

			{/* Input Field */}
			<input
				className={styles.locationInput}
				type="text"
				value={query}
				onChange={handleInputChange}
				placeholder="Enter a location"
				style={{
					width: "100%",
					padding: "8px 46px", // Space for icons
					fontSize: "16px",
					fontFamily: "Roboto, sans-serif",
					border: "1px solid #1976d2",
					borderRadius: "12px",
					outline: "none",
					transition: "border-color 0.2s",
					boxSizing: "border-box",
					height: "46px",
					color: "#1976d2",
					fontWeight: "600",
				}}
			/>

			{/* X Button */}
			{query && (
				<button
					onClick={() => {
						setQuery("");
						setSuggestions([]);
						setShowDropdown(false);
						setFocusedIndex(-1);
					}}
					style={{
						position: "absolute",
						right: "8px",
						top: "50%",
						transform: "translateY(-50%)",
						background: "none",
						border: "none",
						cursor: "pointer",
						padding: 0,
					}}
					aria-label="Clear input"
				>
					<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#757575">
						<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
					</svg>
				</button>
			)}

			{/* Error Message */}
			{error && <p style={{ color: "red", marginTop: "4px" }}>{error}</p>}

			{/* Dropdown */}
			{showDropdown && (
				<ul
					style={{
						position: "absolute",
						top: "100%",
						left: 0,
						right: 0,
						backgroundColor: "white",
						boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
						listStyle: "none",
						margin: 0,
						padding: 0,
						zIndex: 1000,
						maxHeight: "500px",
						overflowY: "auto",
						color: "#1976d2",
						fontWeight: "600",
						fontFamily: "Roboto, sans-serif",
					}}
				>
					{isLoading ? (
						<li style={{ padding: "8px 12px", color: "#666" }}>Loading...</li>
					) : suggestions.length > 0 ? (
						suggestions.map((suggestion, index) => (
							<li
								key={suggestion.place_id}
								onClick={() => handleSelect(suggestion)}
								style={{
									padding: "8px 12px",
									cursor: "pointer",
									backgroundColor: index === focusedIndex ? "#f0f0f0" : "white",
								}}
								onMouseEnter={() => setFocusedIndex(index)}
							>
								{suggestion.display_name}
							</li>
						))
					) : (
						<li style={{ padding: "8px 12px", color: "#666" }}>No results found</li>
					)}
				</ul>
			)}
		</div>
	);
}

export default LocationInput;
