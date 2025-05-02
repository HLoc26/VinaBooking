import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Container, MenuItem, Stepper, Step, StepLabel, Modal } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import OTPInput from "../../../components/ui/OTPInput/OTPInput";
import axios from "./../../../app/axios"; 
function Register() {
	const navigate = useNavigate();
	const [activeStep, setActiveStep] = useState(0);
	const [otp, setOtp] = useState(Array(6).fill(""));
	const [otpTimer, setOtpTimer] = useState(0);
	const [openErrorModal, setOpenErrorModal] = useState(false);
	const [errorModalMessage, setErrorModalMessage] = useState("");
	// Form fields
	const [name, setName] = useState("");
	const [dob, setDob] = useState("");
	const [gender, setGender] = useState("");
	const [username, setUsername] = useState("");
	const [address, setAddress] = useState("");
	const [role, setRole] = useState("registered user");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [retypePassword, setRetypePassword] = useState("");

	const [stepErrors, setStepErrors] = useState([false, false, false, false]);

	const steps = ["Personal Information", "Account Setup", "Review & Send OTP", "Verify OTP"];

	const handleOpenErrorModal = (message) => {
		setErrorModalMessage(message);
		setOpenErrorModal(true);
	};
	const handleCloseErrorModal = () => setOpenErrorModal(false);
	const handleOTP = async ()=>{
		try {
			const response = await axios.post("/auth/register", {
				name,
				phone,
				email,
				password,
				role,
				gender,
				dob,
				username,
				address
			});
			console.log(response);
			stepErrors[2] = false;
			setOtpTimer(60);
			const interval = setInterval(() => {
				setOtpTimer((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		} catch (error) {
			stepErrors[2] = true;
			setStepErrors(stepErrors);
			handleOpenErrorModal(error.response?.data?.error?.message || "Failed to send OTP.");
			console.log(error);
			
		}
	}
	const handleNext = async () => {
		const errors = [...stepErrors];
		switch (activeStep) {
			case 0: // Validate personal info
				if (!name || !dob || !gender || !address) {
					errors[0] = true;
					setStepErrors(errors);
					handleOpenErrorModal("Please fill in all personal information fields.");
					return;
				}
				errors[0] = false;
				break;
			case 1: // Validate account setup
				if (!username || !email || !phone || !password || !retypePassword) {
					errors[1] = true;
					setStepErrors(errors);
					handleOpenErrorModal("Please fill in all account fields.");
					return;
				}
				if (password !== retypePassword) {
					errors[1] = true;
					setStepErrors(errors);
					handleOpenErrorModal("Passwords do not match.");
					return;
				}
				errors[1] = false;
				break;
			case 2: // Send OTP
				await handleOTP();
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

	const handleVerifyOtp = async () => {
		const enteredOtp = otp.join("");
		if (!enteredOtp || enteredOtp.length !== 6) {
			handleOpenErrorModal("Please enter a valid OTP.");
			return;
		}
		try {
			const response = await axios.post("/auth/register/complete", { email, otp: enteredOtp });
			console.log(response);
			alert("Registration Successful!");
			navigate("/login");
		} catch (error) {
			handleOpenErrorModal(error.response?.data?.error?.message || "Invalid OTP.");
		}
	};

	const renderStepContent = (step) => {
		switch (step) {
			case 0:
				return (
					<Box>
						<TextField required fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
						<TextField required fullWidth label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} value={dob} onChange={(e) => setDob(e.target.value)} sx={{ mb: 2 }} />
						<TextField required fullWidth select label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} sx={{ mb: 2 }}>
							<MenuItem value="male">Male</MenuItem>
							<MenuItem value="female">Female</MenuItem>
						</TextField>
						<TextField required fullWidth label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
					</Box>
				);
			case 1:
				return (
					<Box>
						<TextField required fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} sx={{ mb: 2 }} />
						<MuiTelInput defaultCountry="VN" value={phone} onChange={(value) => setPhone(value)} sx={{ width: "100%", mb: 2 }} />
						<TextField required fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
						<TextField required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
						<TextField required fullWidth label="Retype Password" type="password" value={retypePassword} onChange={(e) => setRetypePassword(e.target.value)} sx={{ mb: 2 }} />
						<TextField required fullWidth select label="Role" value={role} onChange={(e) => setRole(e.target.value)} sx={{ mb: 2 }}>
  						<MenuItem value="registered user">Registered User</MenuItem>
 						 <MenuItem value="accommodation owner">Accommodation Owner</MenuItem>
							</TextField>

					</Box>
				);
			case 2:
				return (
					<Box>
						<Typography variant="h6">Review your information and click 'Next' to send OTP.</Typography>
					</Box>
				);
			case 3:
				return (
					<Box>
						<Typography variant="body1">Enter the OTP sent to your email:</Typography>
						<OTPInput length={6} value={otp} onChange={(newOtp) => setOtp(newOtp)} />
						<Button sx={{ mt: 2 }} variant="contained" color="primary" onClick={handleVerifyOtp}>
							Verify OTP
						</Button>
					</Box>
				);
			default:
				return null;
		}
	};

	return (
		<Container maxWidth="md">
			<Modal open={openErrorModal} onClose={handleCloseErrorModal}>
				<Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", border: "2px solid red", boxShadow: 24, p: 4, borderRadius: 2 }}>
					<Typography variant="h6" sx={{ color: "red", fontWeight: "bold" }}>
						⚠️ Error
					</Typography>
					<Typography sx={{ mt: 2 }}>{errorModalMessage}</Typography>
					<Button variant="contained" color="error" onClick={handleCloseErrorModal} sx={{ mt: 2, width: "100%" }}>
						Close
					</Button>
				</Box>
			</Modal>

			<Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: 3, p: 4, borderRadius: 2, bgcolor: "#fff" }}>
				<Typography variant="h4" fontWeight="bold" gutterBottom>
					Register
				</Typography>
				<Stepper activeStep={activeStep} sx={{ width: "100%", mb: 4 }}>
					{steps.map((label, index) => (
						<Step key={index}>
							<StepLabel error={stepErrors[index]}>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				{renderStepContent(activeStep)}
				<Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, width: "100%" }}>
					<Button onClick={handleBack} variant="outlined" color="primary">
						{activeStep === 0 ? "Return to Login" : "Back"}
					</Button>
					{activeStep === steps.length - 1 ? (
						// Final button is inside handleVerifyOtp
						<></>
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
