import authService from "../services/auth.service.js";
import emailService from "../services/email.service.js";
export default {
  // Handles user authentication requests
  async login(req, res) {
      const { email, password } = req.body;
      try {
          const result = await authService.login(email, password);
          if (!result.success) {
              return res.status(result.error.code).json({ success: false, error: result.error });
          }
          return res.json({
              success: true,
              message: "Login success",
              payload: result.payload,
          });
      } catch (err) {
          console.error(err);
          return res.status(500).json({ success: false, error: { code: 500, message: "Server error" } });
      }
  },
  
  // Handles requesting OTP
	async requestOTP(req, res) {
		const { email } = req.body;

		try {
      // Generate random OTP and save to Redis
		  const otp = await authService.generateOTP(email);
      
			// Send OTP via email
			await emailService.send({
				to: email,
				subject: "Your OTP Code",
				html: `<h3>Your OTP is:</h3><p style="font-size: 20px; font-weight: bold;">${otp}</p><p>This OTP will expire in 5 minutes.</p>`,
			});

			res.status(200).json({ success: true, message: "OTP sent successfully to email.", payload: null });
		} catch (error) {
			console.error("Failed to send OTP:", error);
			res.status(500).json({ success: false, error: {code: 500, message: "Failed to send OTP email"}});
		}
	},

  // Handles OTP confirmation
	async confirmOTP(req, res) {
		const { email, otp } = req.body;
    
    try {
      const result = await authService.validateOTP(email, otp);

      if (!result.valid) {
        return res.status(400).json({ success: false, error: {code: 400, message: result.message}});
      }
      res.status(200).json({ success: true, message: result.message, payload: null });
    }
    catch (error) {
      console.error("Failed to confirm OTP:", error);
			res.status(500).json({ success: false, error: {code: 500, message: "Failed to confirm OTP"}});
    }
	},

	// Mail test route logic
	async testMail(req, res) {
		const { to, subject, message } = req.body;

		try {
			await emailService.send({
				to: to || "example@gmail.com", // Use a fixed email for testing
				subject: subject || "Hello",
				html: `<p>${message}</p>`,
			});

			res.status(200).json({ success: true, message: "Test email sent successfully!", payload: null });
		} catch (error) {
			console.error("Mail test error:", error);
			res.status(500).json({ success: false, error: {code: 500, message: "Failed to send test email"}});
		}
	},
};
