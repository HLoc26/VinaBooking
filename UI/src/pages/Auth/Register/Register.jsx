import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box, TextField, Button, Typography, Container,
	MenuItem, Stepper, Step, StepLabel, Modal
} from "@mui/material";
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
	const [openSuccessModal, setOpenSuccessModal] = useState(false);
	const [isNextLoading, setIsNextLoading] = useState(false);

	const [name, setName] = useState("");
	const [dob, setDob] = useState("");
	const [gender, setGender] = useState("");
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

	const handleOTP = async () => {
		try {
			const response = await axios.post("/auth/register", {
				name, phone, email, password, role, gender, dob
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

			if (error.response?.data?.error?.message === "Email already exists") {
				navigate("/login");
			} else {
				handleOpenErrorModal(error.response?.data?.error?.message || "Failed to send OTP.");
			}
		}
	};

	const handleNext = async () => {
		setIsNextLoading(true);
		const errors = [...stepErrors];

		switch (activeStep) {
			case 0:
				if (!name || !dob || !gender) {
					errors[0] = true;
					setStepErrors(errors);
					handleOpenErrorModal("Please fill in all personal information fields.");
					setIsNextLoading(false);
					return;
				}
				const today = new Date();
				if (new Date(dob) > today) {
					errors[0] = true;
					setStepErrors(errors);
					handleOpenErrorModal("Date of birth cannot be in the future.");
					setIsNextLoading(false);
					return;
				}
				errors[0] = false;
				break;

			case 1:
				if (!email || !phone || !password || !retypePassword) {
					errors[1] = true;
					setStepErrors(errors);
					handleOpenErrorModal("Please fill in all account fields.");
					setIsNextLoading(false);
					return;
				}
				if (password !== retypePassword) {
					errors[1] = true;
					setStepErrors(errors);
					handleOpenErrorModal("Passwords do not match.");
					setIsNextLoading(false);
					return;
				}
				errors[1] = false;
				break;

			case 2:
				await handleOTP();
				break;

			default:
				break;
		}

		setStepErrors(errors);
		setActiveStep((prev) => prev + 1);
		setIsNextLoading(false);
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
			setOpenSuccessModal(true); // Open success modal
			setTimeout(() => {
				navigate("/login");
			},20000); // Redirect after 2 seconds
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
					</Box>
				);
			case 1:
				return (
					<Box>
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
						<Typography variant="h6" mb={2}>Review your information and click 'Next' to send OTP:</Typography>
						<Typography><strong>Name:</strong> {name}</Typography>
						<Typography><strong>Date of Birth:</strong> {dob}</Typography>
						<Typography><strong>Gender:</strong> {gender}</Typography>
						<Typography><strong>Email:</strong> {email}</Typography>
						<Typography><strong>Phone:</strong> {phone}</Typography>
						<Typography><strong>Role:</strong> {role}</Typography>
					</Box>
				);
			case 3:
				return (
					<Box>
						<Typography variant="body1">Enter the OTP sent to your email:</Typography>
						<OTPInput length={6} value={otp} onChange={(newOtp) => setOtp(newOtp)} />
					</Box>
				);
			default:
				return null;
		}
	};

	return (
		<Container maxWidth="md">
			{/* Top right Return to Login */}
			{activeStep > 0 && (
				<Box sx={{ position: "absolute", top: 24, right: 24 }}>
					<Button onClick={() => navigate("/login")} color="primary" variant="text">
						Return to Login
					</Button>
				</Box>
			)}

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

			<Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: 3, p: 4, borderRadius: 2, bgcolor: "#fff", position: "relative" }}>
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
				<Modal open={openSuccessModal} onClose={() => setOpenSuccessModal(false)}>
    <Box
        sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid green",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
        }}
    >
        <Typography variant="h6" sx={{ color: "green", fontWeight: "bold" }}>
            ✅ Success
        </Typography>
        <Typography sx={{ mt: 2 }}>Registration Successful!</Typography>
        <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/login")} // Redirect on button click
            sx={{ mt: 2, width: "100%" }}
        >
            OK
        </Button>
    </Box>
</Modal>
				{/* Navigation Buttons */}
				<Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, width: "100%" }}>
					<Button onClick={handleBack} variant="outlined" color="primary">
						{activeStep === 0 ? "Return to Login" : "Back"}
					</Button>

					{activeStep !== steps.length - 1 ? (
						<Button onClick={handleNext} variant="contained" color="primary" disabled={isNextLoading}>
							{isNextLoading ? "Loading..." : "Next"}
						</Button>
					) : (
						<Button onClick={handleVerifyOtp} variant="contained" color="primary">
							Confirm
						</Button>
					)}
				</Box>
			</Box>
		</Container>
	);
}

export default Register;
