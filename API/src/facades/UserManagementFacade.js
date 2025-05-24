import authService from "../services/auth.service.js";
import favouriteService from "../services/favourite.service.js";
import emailService from "../services/email.service.js";

/**
 * User Management Facade - Provides a simplified interface for user-related operations
 * This facade coordinates authentication, profile management, and user preferences
 */
class UserManagementFacade {
	/**
	 * Complete user registration with email verification and initial setup
	 * @param {Object} registrationData - User registration information
	 * @param {string} registrationData.email - User email
	 * @param {string} registrationData.password - User password
	 * @param {string} registrationData.username - Username
	 * @param {string} registrationData.fullName - Full name (optional)
	 * @param {string} registrationData.phone - Phone number (optional)
	 * @returns {Object} Registration result with user data and verification status
	 */
	async registerUser(registrationData) {
		try {
			const { email, password, username, fullName, phone } = registrationData;

			// Validate required fields
			if (!email || !password || !username) {
				throw new Error("Email, password, and username are required");
			}

			// Check if user already exists
			const existingUser = await authService.findUserByEmail(email);
			if (existingUser) {
				throw new Error("User with this email already exists");
			}

			// Register the user
			const user = await authService.register({
				email,
				password,
				username,
				fullName,
				phone,
			});

			// Initialize user's favorite list
			try {
				await favouriteService.findByUserId(user.id);
			} catch (error) {
				console.warn("Could not initialize favorite list:", error.message);
			}

			// Send welcome email (if email service is configured)
			try {
				await this._sendWelcomeEmail(user);
			} catch (emailError) {
				console.warn("Could not send welcome email:", emailError.message);
			}

			return {
				user: {
					id: user.id,
					email: user.email,
					username: user.username,
					fullName: user.fullName,
					isVerified: user.isVerified || false,
				},
				message: "Registration successful",
				needsVerification: !user.isVerified,
			};
		} catch (error) {
			console.error("Error in registerUser:", error);
			throw error;
		}
	}

	/**
	 * Complete user login with session management and user preferences
	 * @param {Object} loginData - Login credentials
	 * @param {string} loginData.email - User email
	 * @param {string} loginData.password - User password
	 * @param {boolean} loginData.rememberMe - Remember user session (optional)
	 * @returns {Object} Login result with token and user profile
	 */
	async loginUser(loginData) {
		try {
			const { email, password, rememberMe = false } = loginData;

			// Validate credentials
			if (!email || !password) {
				throw new Error("Email and password are required");
			}

			// Authenticate user
			const authResult = await authService.login({ email, password });

			if (!authResult.success) {
				throw new Error(authResult.message || "Invalid credentials");
			}

			// Get user profile data
			const userProfile = await this.getUserProfile(authResult.user.id);

			// Prepare login response
			const loginResponse = {
				success: true,
				token: authResult.token,
				user: authResult.user,
				profile: userProfile,
				sessionSettings: {
					rememberMe,
					tokenExpiry: rememberMe ? "30d" : "1d",
				},
			};

			return loginResponse;
		} catch (error) {
			console.error("Error in loginUser:", error);
			throw error;
		}
	}

	/**
	 * Get comprehensive user profile with preferences and statistics
	 * @param {number} userId - User ID
	 * @returns {Object} Complete user profile data
	 */
	async getUserProfile(userId) {
		try {
			// Get basic user information
			const user = await authService.findUserById(userId);
			if (!user) {
				throw new Error("User not found");
			}

			// Get user's favorites
			const favouriteList = await favouriteService.findByUserId(userId);

			// Prepare profile data
			const profile = {
				basicInfo: {
					id: user.id,
					email: user.email,
					username: user.username,
					fullName: user.fullName || user.username,
					phone: user.phone,
					isVerified: user.isVerified || false,
					joinDate: user.createdAt,
					lastLogin: user.lastLogin,
				},
				preferences: {
					favorites: favouriteList || { accommodations: [] },
					totalFavorites: favouriteList?.accommodations?.length || 0,
				},
				statistics: {
					totalBookings: 0, // This would require a booking history service
					totalSpent: 0, // This would require a booking history service
					memberSince: this._calculateMembershipDuration(user.createdAt),
				},
			};

			return profile;
		} catch (error) {
			console.error("Error in getUserProfile:", error);
			throw error;
		}
	}

	/**
	 * Update user profile with validation and change notifications
	 * @param {number} userId - User ID
	 * @param {Object} updateData - Profile update data
	 * @returns {Object} Updated profile data
	 */
	async updateUserProfile(userId, updateData) {
		try {
			// Get current user data
			const currentUser = await authService.findUserById(userId);
			if (!currentUser) {
				throw new Error("User not found");
			}

			// Validate update data
			const allowedFields = ["fullName", "phone", "username"];
			const validUpdateData = {};

			for (const [key, value] of Object.entries(updateData)) {
				if (allowedFields.includes(key) && value !== undefined) {
					validUpdateData[key] = value;
				}
			}

			if (Object.keys(validUpdateData).length === 0) {
				throw new Error("No valid fields to update");
			}

			// Update user profile
			const updatedUser = await authService.updateProfile(userId, validUpdateData);

			// Send notification email if email was changed
			if (updateData.email && updateData.email !== currentUser.email) {
				try {
					await this._sendProfileChangeNotification(updatedUser, "email");
				} catch (emailError) {
					console.warn("Could not send profile change notification:", emailError.message);
				}
			}

			// Get updated profile
			const updatedProfile = await this.getUserProfile(userId);

			return {
				success: true,
				user: updatedUser,
				profile: updatedProfile,
				message: "Profile updated successfully",
			};
		} catch (error) {
			console.error("Error in updateUserProfile:", error);
			throw error;
		}
	}

	/**
	 * Change user password with validation and security notifications
	 * @param {number} userId - User ID
	 * @param {Object} passwordData - Password change data
	 * @param {string} passwordData.currentPassword - Current password
	 * @param {string} passwordData.newPassword - New password
	 * @param {string} passwordData.confirmPassword - Password confirmation
	 * @returns {Object} Password change result
	 */
	async changePassword(userId, passwordData) {
		try {
			const { currentPassword, newPassword, confirmPassword } = passwordData;

			// Validate input
			if (!currentPassword || !newPassword || !confirmPassword) {
				throw new Error("All password fields are required");
			}

			if (newPassword !== confirmPassword) {
				throw new Error("New password and confirmation do not match");
			}

			if (newPassword.length < 6) {
				throw new Error("New password must be at least 6 characters long");
			}

			// Get user data
			const user = await authService.findUserById(userId);
			if (!user) {
				throw new Error("User not found");
			}

			// Verify current password
			const isValidPassword = await authService.validatePassword(user.email, currentPassword);
			if (!isValidPassword) {
				throw new Error("Current password is incorrect");
			}

			// Change password
			const result = await authService.changePassword(userId, newPassword);

			// Send security notification
			try {
				await this._sendSecurityNotification(user, "password_changed");
			} catch (emailError) {
				console.warn("Could not send security notification:", emailError.message);
			}

			return {
				success: true,
				message: "Password changed successfully",
			};
		} catch (error) {
			console.error("Error in changePassword:", error);
			throw error;
		}
	}

	/**
	 * Delete user account with data cleanup and confirmation
	 * @param {number} userId - User ID
	 * @param {string} password - User password for confirmation
	 * @returns {Object} Account deletion result
	 */
	async deleteAccount(userId, password) {
		try {
			// Get user data
			const user = await authService.findUserById(userId);
			if (!user) {
				throw new Error("User not found");
			}

			// Verify password for security
			const isValidPassword = await authService.validatePassword(user.email, password);
			if (!isValidPassword) {
				throw new Error("Password verification failed");
			}

			// Clean up user's favorite list
			try {
				const favouriteList = await favouriteService.findByUserId(userId);
				if (favouriteList && favouriteList.accommodations.length > 0) {
					// Remove all favorites
					for (const accommodation of favouriteList.accommodations) {
						await favouriteService.remove(userId, accommodation.id);
					}
				}
			} catch (favoriteError) {
				console.warn("Could not clean up favorites:", favoriteError.message);
			}

			// Send farewell email
			try {
				await this._sendFarewellEmail(user);
			} catch (emailError) {
				console.warn("Could not send farewell email:", emailError.message);
			}

			// Delete user account
			const result = await authService.deleteAccount(userId);

			return {
				success: true,
				message: "Account deleted successfully",
			};
		} catch (error) {
			console.error("Error in deleteAccount:", error);
			throw error;
		}
	}

	// Private helper methods

	_calculateMembershipDuration(joinDate) {
		if (!joinDate) return "Unknown";

		const now = new Date();
		const joined = new Date(joinDate);
		const diffTime = Math.abs(now - joined);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays < 30) {
			return `${diffDays} days`;
		} else if (diffDays < 365) {
			const months = Math.floor(diffDays / 30);
			return `${months} month${months > 1 ? "s" : ""}`;
		} else {
			const years = Math.floor(diffDays / 365);
			return `${years} year${years > 1 ? "s" : ""}`;
		}
	}

	async _sendWelcomeEmail(user) {
		console.log(`Sending welcome email to ${user.email}`);
		// In a real implementation:
		// await emailService.sendWelcomeEmail({
		//     to: user.email,
		//     userName: user.fullName || user.username
		// });
	}

	async _sendProfileChangeNotification(user, changeType) {
		console.log(`Sending profile change notification to ${user.email} for ${changeType}`);
		// In a real implementation:
		// await emailService.sendProfileChangeNotification({
		//     to: user.email,
		//     userName: user.fullName || user.username,
		//     changeType
		// });
	}

	async _sendSecurityNotification(user, actionType) {
		console.log(`Sending security notification to ${user.email} for ${actionType}`);
		// In a real implementation:
		// await emailService.sendSecurityNotification({
		//     to: user.email,
		//     userName: user.fullName || user.username,
		//     actionType,
		//     timestamp: new Date()
		// });
	}

	async _sendFarewellEmail(user) {
		console.log(`Sending farewell email to ${user.email}`);
		// In a real implementation:
		// await emailService.sendFarewellEmail({
		//     to: user.email,
		//     userName: user.fullName || user.username
		// });
	}
}

export default new UserManagementFacade();
