const userModel = require("../Models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function createUser(req, res) {
    const { fullName, email, password } = req.body;
    const isUserAlreadyExists = await userModel.findOne({ email })
    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "user exists with same email"
        })
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        fullName, email, password: hashedPassword
    })

    const token = jwt.sign(
        { userId: user._id },   // payload
        process.env.JWT_SECRET, // secret key
        { expiresIn: "1d" }     // expiry
    );

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        token: token,
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePicture: user.profilePicture
        }
    })
}

async function loginUser(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        userId: user._id,
    }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        token: token,
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePicture: user.profilePicture
        }
    })
}

function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    });
}

async function getMe(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    res.status(200).json({
        user: {
            _id: req.user._id,
            email: req.user.email,
            fullName: req.user.fullName,
            profilePicture: req.user.profilePicture
        }
    });
}

async function googleAuthRedirect(req, res) {
    const clientId = process.env.CLIENT_ID.trim();
    const redirectUri = `${process.env.BACKEND_URL || 'https://reelify-bqci.onrender.com'}/api/auth/google/callback`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent('profile email')}&` +
        `prompt=select_account`;
        console.log("Redirect URI:", redirectUri);
    res.redirect(googleAuthUrl);
}

async function googleAuthCallback(req, res) {
    try {
        const { code } = req.query;
        if (!code) {
            return res.redirect(`${process.env.FRONTEND_URL || 'https://reelifybusiness.vercel.app'}/login?error=no_code`);
        }

        // Exchange code for token using fetch
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.CLIENT_ID.trim(),
                client_secret: process.env.CLIENT_SECRET.trim(),
                redirect_uri: `${process.env.BACKEND_URL || 'https://reelify-bqci.onrender.com'}/api/auth/google/callback`,
                grant_type: 'authorization_code'
            })
        });

        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) {
            console.error('Error exchanging Google OAuth code:', tokenData);
            return res.redirect(`${process.env.FRONTEND_URL || 'https://reelifybusiness.vercel.app'}/login?error=token_exchange_failed`);
        }

        // Fetch user profile info
        const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const profileData = await profileResponse.json();

        if (!profileData.email) {
            console.error('Google profile info contains no email:', profileData);
            return res.redirect(`${process.env.FRONTEND_URL || 'https://reelifybusiness.vercel.app'}/login?error=no_email`);
        }

        // Find or create user
        let user = await userModel.findOne({ email: profileData.email });
        if (!user) {
            user = await userModel.create({
                googleId: profileData.sub,
                fullName: profileData.name || 'Google User',
                email: profileData.email,
                profilePicture: profileData.picture || ''
            });
        } else {
            // Update googleId and profilePicture if not present
            let isModified = false;
            if (!user.googleId) {
                user.googleId = profileData.sub;
                isModified = true;
            }
            if (!user.profilePicture && profileData.picture) {
                user.profilePicture = profileData.picture;
                isModified = true;
            }
            if (isModified) {
                await user.save();
            }
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Store cookie exact same way
        res.cookie("token", token);

        // Redirect to Frontend Auth Success page with token
        res.redirect(`${process.env.FRONTEND_URL || 'https://reelifybusiness.vercel.app'}/auth-success?token=${token}`);
    } catch (error) {
        console.error("Error in Google Auth callback:", error);
        res.redirect(`${process.env.FRONTEND_URL || 'https://reelifybusiness.vercel.app'}/login?error=server_error`);
    }
}

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    getMe,
    googleAuthRedirect,
    googleAuthCallback
}