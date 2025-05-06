import React from "react";

function OTPInput({ length, value, onChange }) {
	const handleChange = (e, index) => {
		const newValue = [...value];
		newValue[index] = e.target.value.slice(-1); // Chỉ lấy ký tự cuối cùng
		onChange(newValue);

		// Tự động focus vào ô tiếp theo
		if (e.target.value && index < length - 1) {
			const nextInput = document.getElementById(`otp-input-${index + 1}`);
			if (nextInput) nextInput.focus();
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === "Backspace" && !value[index] && index > 0) {
			const prevInput = document.getElementById(`otp-input-${index - 1}`);
			if (prevInput) prevInput.focus();
		}
	};

	return (
		<div style={{ display: "flex", gap: "10px" }}>
			{Array.from({ length }).map((_, index) => (
				<input
					key={index}
					id={`otp-input-${index}`}
					type="text"
					value={value[index] || ""}
					onChange={(e) => handleChange(e, index)}
					onKeyDown={(e) => handleKeyDown(e, index)}
					maxLength={1}
					style={{
						width: "50px",
						height: "50px",
						textAlign: "center",
						fontSize: "20px",
						border: "1px solid #ccc",
						borderRadius: "5px",
					}}
				/>
			))}
		</div>
	);
}

export default OTPInput;