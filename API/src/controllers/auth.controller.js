import authService from "../services/auth.service.js";

const authController = {
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
    }
};

export default authController;