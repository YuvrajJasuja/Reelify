const userModel = require("../Models/userModel")
const jwt = require("jsonwebtoken");
// “Is the user logged in? If yes → allow access, else → block”

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId);
        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}
module.exports = authUserMiddleware;