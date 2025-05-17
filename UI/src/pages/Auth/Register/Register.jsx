import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Container, MenuItem, Stepper, Step, StepLabel, Modal, Paper, InputAdornment, IconButton } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import OTPInput from "../../../components/ui/OTPInput/OTPInput";
import axios from "./../../../app/axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Register() {
	const navigate = useNavigate();
	const [activeStep, setActiveStep] = useState(0);
	const [otp, setOtp] = useState(Array(6).fill(""));
	const [otpTimer, setOtpTimer] = useState(0);
	const [openErrorModal, setOpenErrorModal] = useState(false);
	const [errorModalMessage, setErrorModalMessage] = useState("");
	const [openSuccessModal, setOpenSuccessModal] = useState(false);
	const [isNextLoading, setIsNextLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showRetypePassword, setShowRetypePassword] = useState(false);

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

	const handleTogglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const handleToggleRetypePasswordVisibility = () => {
		setShowRetypePassword(!showRetypePassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleOpenErrorModal = (message) => {
		setErrorModalMessage(message);
		setOpenErrorModal(true);
	};
	const handleCloseErrorModal = () => setOpenErrorModal(false);

	const isValidEmail = (email) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const handleOTP = async () => {
		try {
			const response = await axios.post("/auth/register", {
				name,
				phone,
				email,
				password,
				role,
				gender,
				dob,
			});
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
				if (!isValidEmail(email)) {
					errors[1] = true;
					setStepErrors(errors);
					handleOpenErrorModal("Please enter a valid email address.");
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
			setOpenSuccessModal(true);
		} catch (error) {
			handleOpenErrorModal(error.response?.data?.error?.message || "Invalid OTP.");
		}
	};

	return (
		<Container
			component="main"
			maxWidth={false}
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "100vh",
				padding: 3,
				backgroundImage: "url(/images/vietnam-background.jpg)",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "rgba(255, 255, 255, 0.2)",
					opacity: 0.8,
					zIndex: -1,
				},
			}}
		>
			<Box sx={{ maxWidth: "md", width: "100%", position: "relative" }}>
				<Button
					startIcon={<ArrowBackIcon />}
					variant="contained"
					color="primary"
					onClick={() => navigate("/")}
					sx={{
						position: "absolute",
						top: -60,
						left: 0,
						zIndex: 1,
						borderRadius: 2,
						boxShadow: 3,
						padding: "10px 20px",
						backgroundColor: "primary.dark",
						"&:hover": {
							transform: "translateY(-2px)",
							boxShadow: 5,
							backgroundColor: "primary.main",
						},
						transition: "all 0.3s ease",
					}}
				>
					Return to Home Page
				</Button>

				<Button
					endIcon={<ArrowBackIcon sx={{ transform: "rotate(180deg)" }} />}
					variant="contained"
					color="primary"
					onClick={() => navigate("/login")}
					sx={{
						position: "absolute",
						top: -60,
						right: 0,
						zIndex: 1,
						borderRadius: 2,
						boxShadow: 3,
						padding: "10px 20px",
						backgroundColor: "primary.dark",
						"&:hover": {
							transform: "translateY(-2px)",
							boxShadow: 5,
							backgroundColor: "primary.main",
						},
						transition: "all 0.3s ease",
					}}
				>
					Login
				</Button>

				<Paper
					elevation={6}
					sx={{
						width: "100%",
						borderRadius: 3,
						overflow: "hidden",
						transition: "all 0.3s ease-in-out",
						"&:hover": {
							boxShadow: 10,
						},
						position: "relative",
					}}
				>
					<Box
						sx={{
							bgcolor: "primary.main",
							color: "white",
							padding: 3,
							textAlign: "center",
						}}
					>
						<Typography variant="h4" fontWeight="bold" gutterBottom>
							Create Account
						</Typography>
						<Typography variant="subtitle1">Join VinaBooking to discover amazing stays across Vietnam</Typography>
					</Box>

					<Box sx={{ p: 4, bgcolor: "#fff" }}>
						<Stepper activeStep={activeStep} sx={{ width: "100%", mb: 4 }}>
							{steps.map((label, index) => (
								<Step key={index}>
									<StepLabel error={stepErrors[index]}>{label}</StepLabel>
								</Step>
							))}
						</Stepper>

						{activeStep === 0 && (
							<Box>
								<TextField required fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} InputProps={{ sx: { borderRadius: 2 } }} />
								<TextField
									required
									fullWidth
									label="Date of Birth"
									type="date"
									InputLabelProps={{ shrink: true }}
									value={dob}
									onChange={(e) => setDob(e.target.value)}
									sx={{ mb: 2 }}
									InputProps={{ sx: { borderRadius: 2 } }}
								/>
								<TextField required fullWidth select label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} sx={{ mb: 2 }} InputProps={{ sx: { borderRadius: 2 } }}>
									<MenuItem value="male">Male</MenuItem>
									<MenuItem value="female">Female</MenuItem>
								</TextField>
							</Box>
						)}

						{activeStep === 1 && (
							<Box>
								<MuiTelInput defaultCountry="VN" value={phone} onChange={(value) => setPhone(value)} sx={{ width: "100%", mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
								<TextField required fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} InputProps={{ sx: { borderRadius: 2 } }} />
								<TextField
									required
									fullWidth
									label="Password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									sx={{ mb: 2 }}
									InputProps={{
										sx: { borderRadius: 2 },
										endAdornment: (
											<InputAdornment position="end">
												<IconButton aria-label="toggle password visibility" onClick={handleTogglePasswordVisibility} onMouseDown={handleMouseDownPassword} edge="end">
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
								<TextField
									required
									fullWidth
									label="Retype Password"
									type={showRetypePassword ? "text" : "password"}
									value={retypePassword}
									onChange={(e) => setRetypePassword(e.target.value)}
									sx={{ mb: 2 }}
									InputProps={{
										sx: { borderRadius: 2 },
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle retype password visibility"
													onClick={handleToggleRetypePasswordVisibility}
													onMouseDown={handleMouseDownPassword}
													edge="end"
												>
													{showRetypePassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
								<TextField required fullWidth select label="Role" value={role} onChange={(e) => setRole(e.target.value)} sx={{ mb: 2 }} InputProps={{ sx: { borderRadius: 2 } }}>
									<MenuItem value="registered user">Registered User</MenuItem>
									<MenuItem value="accommodation owner">Accommodation Owner</MenuItem>
								</TextField>
							</Box>
						)}

						{activeStep === 2 && (
							<Box
								sx={{
									p: 3,
									borderRadius: 2,
									bgcolor: "#f5f9ff",
									border: "1px solid #e0e9fa",
								}}
							>
								<Typography variant="h6" mb={2} color="primary" fontWeight="medium">
									Review your information:
								</Typography>
								<Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
									<Typography>
										<strong>Name:</strong> {name}
									</Typography>
									<Typography>
										<strong>Date of Birth:</strong> {dob}
									</Typography>
									<Typography>
										<strong>Gender:</strong> {gender}
									</Typography>
									<Typography>
										<strong>Email:</strong> {email}
									</Typography>
									<Typography>
										<strong>Phone:</strong> {phone}
									</Typography>
									<Typography>
										<strong>Role:</strong> {role}
									</Typography>
								</Box>
								<Typography sx={{ mt: 2, fontStyle: "italic", color: "text.secondary" }}>Click 'Next' to receive an OTP verification code via email</Typography>
							</Box>
						)}

						{activeStep === 3 && (
							<Box sx={{ textAlign: "center" }}>
								<Typography variant="h6" color="primary" mb={2}>
									Verify Your Account
								</Typography>
								<Typography variant="body1" mb={3}>
									Enter the 6-digit OTP sent to your email:
								</Typography>
								<OTPInput length={6} value={otp} onChange={(newOtp) => setOtp(newOtp)} />
								{otpTimer > 0 && (
									<Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
										Resend OTP in {otpTimer} seconds
									</Typography>
								)}
							</Box>
						)}

						<Modal open={openErrorModal} onClose={handleCloseErrorModal}>
							<Box
								sx={{
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									width: 400,
									bgcolor: "background.paper",
									border: "2px solid red",
									boxShadow: 24,
									p: 4,
									borderRadius: 3,
								}}
							>
								<Typography variant="h6" sx={{ color: "red", fontWeight: "bold" }}>
									⚠️ Error
								</Typography>
								<Typography sx={{ mt: 2 }}>{errorModalMessage}</Typography>
								<Button
									variant="contained"
									color="error"
									onClick={handleCloseErrorModal}
									sx={{
										mt: 2,
										width: "100%",
										borderRadius: 2,
										textTransform: "none",
										fontWeight: "bold",
									}}
								>
									Close
								</Button>
							</Box>
						</Modal>

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
									borderRadius: 3,
								}}
							>
								<Typography variant="h6" sx={{ color: "green", fontWeight: "bold" }}>
									✅ Success
								</Typography>
								<Typography sx={{ mt: 2 }}>Registration Successful! You can now log in to your account.</Typography>
								<Button
									variant="contained"
									color="success"
									onClick={() => navigate("/login")}
									sx={{
										mt: 2,
										width: "100%",
										borderRadius: 2,
										textTransform: "none",
										fontWeight: "bold",
									}}
								>
									Go to Login
								</Button>
							</Box>
						</Modal>

						<Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, width: "100%" }}>
							<Button
								onClick={handleBack}
								variant="outlined"
								color="primary"
								sx={{
									borderRadius: 2,
									px: 3,
									textTransform: "none",
									fontWeight: "medium",
								}}
							>
								{activeStep === 0 ? "Back" : "Back"}
							</Button>

							{activeStep !== steps.length - 1 ? (
								<Button
									onClick={handleNext}
									variant="contained"
									color="primary"
									disabled={isNextLoading}
									sx={{
										borderRadius: 2,
										px: 3,
										textTransform: "none",
										fontWeight: "bold",
										transition: "all 0.2s",
										"&:hover": {
											transform: "translateY(-2px)",
											boxShadow: 4,
										},
									}}
								>
									{isNextLoading ? "Loading..." : "Next"}
								</Button>
							) : (
								<Button
									onClick={handleVerifyOtp}
									variant="contained"
									color="primary"
									sx={{
										borderRadius: 2,
										px: 3,
										textTransform: "none",
										fontWeight: "bold",
										transition: "all 0.2s",
										"&:hover": {
											transform: "translateY(-2px)",
											boxShadow: 4,
										},
									}}
								>
									Confirm
								</Button>
							)}
						</Box>
					</Box>
				</Paper>
			</Box>

			{/* Copyright section */}
			<Typography
				variant="caption"
				align="center"
				sx={{
					color: "white",
					opacity: 0.8,
					position: "fixed",
					bottom: 20,
					left: 0,
					right: 0,
					width: "100%",
					fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
					letterSpacing: 0.5,
					fontSize: "0.75rem",
					fontWeight: 400,
				}}
			>
				© 2025 VinaBooking, HCMUTE
				<br />
				Huu Loc - Nhat Quang - Quang Sang - Gia Huy
			</Typography>
		</Container>
	);
}

export default Register;
