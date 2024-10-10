const express = require("express");
const authControllers = require("../controllers/auth-controller");
const { signupSchema, loginSchema } = require("../validators/auth_validator");
const validate = require("../middlewares/validate_middleware");
const authMiddleware = require("../middlewares/auth-middleware");
var nodemailer = require('nodemailer');
const router = express.Router();

router.route("/").get(authControllers.home);
router.route("/user").get(authMiddleware, authControllers.user);

router.route("/register").post(validate(signupSchema), authControllers.register);
router.route("/login").post(validate(loginSchema), authControllers.login);
router.route("/forgot-password").post(authControllers.forgotPassword);
router.route("/reset-password/:id/:token").get(authControllers.resetPassword);
router.route("/reset-password/:id/:token").post(authControllers.saveNewPassword);

module.exports = router;
