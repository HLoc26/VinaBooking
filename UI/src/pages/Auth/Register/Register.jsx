import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Container, MenuItem, Stepper, Step, StepLabel, Modal } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import OTPInput from "../../../components/ui/OTPInput/OTPInput";

function Register() {
	const navigate = useNavigate();
	const [activeStep, setActiveStep] = useState(0);
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState(Array(6).fill(""));
	const [otpTimer, setOtpTimer] = useState(0);
	const [password, setPassword] = useState("");
	const [retypePassword, setRetypePassword] = useState("");
	const [name, setName] = useState("");
	const [dob, setDob] = useState("");
	const [gender, setGender] = useState("");
	const [stepErrors, setStepErrors] = useState([false, false, false, false]);
	const [openErrorModal, setOpenErrorModal] = React.useState(false);
	const [errorModalMessage, setErrorModalMessage] = React.useState("");

	const handleOpenErrorModal = () => setOpenErrorModal(true);
	const handleCloseErrorModal = () => setOpenErrorModal(false);

	const steps = ["Input Phone and Email", "Validate Email by OTP", "Set Password", "Personal Information"];

	const handleNext = () => {
		const errors = [...stepErrors];

		switch (activeStep) {
			case 0: // Validate Phone and Email
				if (!phone || !email) {
					// alert("Please enter both phone number and email.");
					errors[0] = true;
					setStepErrors(errors);
					setErrorModalMessage("Please enter both phone number and email.");
					handleOpenErrorModal(true);
					return;
				}
				errors[0] = false;
				break;
			case 1: // Validate OTP
				if (otp.join("") !== "123456") {
					// alert("Invalid OTP! Please try again.");
					errors[1] = true;
					setStepErrors(errors);
					setErrorModalMessage("Invalid OTP! Please try again.");
					handleOpenErrorModal(true);
					return;
				}
				errors[1] = false;
				break;
			case 2: // Validate Password and Retype Password
				if (!password || !retypePassword) {
					// alert("Please enter both password and retype password.");
					errors[2] = true;
					setStepErrors(errors);
					setErrorModalMessage("Please enter both password and retype password.");
					handleOpenErrorModal(true);
					return;
				}
				if (password !== retypePassword) {
					// alert("Passwords do not match!");
					errors[2] = true;
					setStepErrors(errors);
					setErrorModalMessage("Passwords do not match!");
					handleOpenErrorModal(true);
					return;
				}
				errors[2] = false;
				break;
			case 3: // Validate Personal Information
				if (!name || !dob || !gender) {
					// alert("Please fill in all personal information fields.");
					errors[3] = true;
					setStepErrors(errors);
					setErrorModalMessage("Please fill in all personal information fields.");
					handleOpenErrorModal(true);
					return;
				}
				errors[3] = false;
				break;
			default:
				break;
		}

		setStepErrors(errors);
		setActiveStep((prev) => prev + 1);
	};

	const handleBack = () => {
		if (activeStep === 0) {
			navigate("/login");
		} else {
			setActiveStep((prev) => prev - 1);
		}
	};

	const handleSendOtp = () => {
		if (otpTimer > 0) return;

		// Call API to send OTP
		console.log("Sending OTP to:", email);
		setOtpTimer(60); // Set 1-minute timer

		// Start countdown
		const interval = setInterval(() => {
			setOtpTimer((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	const handleRegister = () => {
		console.log("Register with:", { phone, email, password, name, dob, gender });
		alert("Registration Successful!");
	};

	const renderStepContent = (step) => {
		switch (step) {
			case 0:
				return (
					<Box>
						<MuiTelInput
							required
							defaultCountry={"VN"}
							continents={["AS", "NA"]}
							preferredCountries={["VN", "US"]}
							value={phone}
							onChange={(phone) => setPhone(phone)}
							sx={{ width: "100%", marginBottom: 2 }}
							label="Phone number"
						/>
						<TextField required fullWidth label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
					</Box>
				);
			case 1:
				return (
					<Box>
						<Typography variant="body1" gutterBottom>
							An OTP has been sent to your email. Please enter it below:
						</Typography>
						<OTPInput length={6} value={otp} onChange={(newOtp) => setOtp(newOtp)} />
						<Button sx={{ mt: 2 }} variant="contained" color="primary" onClick={handleSendOtp} disabled={otpTimer > 0}>
							{otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend OTP"}
						</Button>
					</Box>
				);
			case 2:
				return (
					<Box>
						<TextField required fullWidth label="Password" type="password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ marginBottom: 2 }} />
						<TextField required fullWidth label="Retype Password" type="password" variant="outlined" value={retypePassword} onChange={(e) => setRetypePassword(e.target.value)} />
					</Box>
				);
			case 3:
				return (
					<Box>
						<TextField required fullWidth label="Full Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} sx={{ marginBottom: 2 }} />
						<TextField
							required
							fullWidth
							label="Date of Birth"
							type="date"
							variant="outlined"
							InputLabelProps={{ shrink: true }}
							value={dob}
							onChange={(e) => setDob(e.target.value)}
							sx={{ marginBottom: 2 }}
						/>
						<TextField required fullWidth select label="Gender" variant="outlined" value={gender} onChange={(e) => setGender(e.target.value)}>
							<MenuItem value="male">Male</MenuItem>
							<MenuItem value="female">Female</MenuItem>
						</TextField>
					</Box>
				);
			default:
				return null;
		}
	};

	return (
		<Container maxWidth="md">
			<Modal open={openErrorModal} onClose={handleCloseErrorModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "background.paper",
						border: "2px solid red", // Red border for danger
						boxShadow: 24,
						p: 4,
						borderRadius: 2,
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
						<Typography
							id="modal-modal-title"
							variant="h6"
							component="h2"
							sx={{ color: "red", fontWeight: "bold" }} // Red bold title
						>
							⚠️ Error
						</Typography>
					</Box>
					<Typography id="modal-modal-description" sx={{ mt: 2, color: "black", fontSize: "1rem" }}>
						{errorModalMessage}
					</Typography>
					<Button variant="contained" color="error" onClick={handleCloseErrorModal} sx={{ mt: 2, width: "100%" }}>
						Close
					</Button>
				</Box>
			</Modal>
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					boxShadow: 3,
					padding: 4,
					borderRadius: 2,
					backgroundColor: "#fff",
				}}
			>
				<Typography variant="h4" fontWeight="bold" gutterBottom>
					Register
				</Typography>
				<Stepper activeStep={activeStep} sx={{ width: "100%", marginBottom: 4 }}>
					{steps.map((label, index) => (
						<Step key={index}>
							<StepLabel error={stepErrors[index]}>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				{renderStepContent(activeStep)}
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						marginTop: 4,
						width: "100%",
					}}
				>
					{activeStep === 0 ? (
						<Button onClick={handleBack} variant="outlined" color="primary">
							Return to Login
						</Button>
					) : (
						<Button onClick={handleBack} variant="outlined" color="primary">
							Back
						</Button>
					)}

					{activeStep === steps.length - 1 ? (
						<Button onClick={handleRegister} variant="contained" color="primary">
							Register
						</Button>
					) : (
						<Button onClick={handleNext} variant="contained" color="primary">
							Next
						</Button>
					)}
				</Box>
			</Box>
		</Container>
	);
}

export default Register;
