const express = require("express");
const router = express.Router();

// Require controller modules
const user_controller = require("../controllers/userController");

// GET request for fetching github user information
// requires authentication to be passed using bearer token
router.get('/data',
user_controller.get_user_data_on_get);

// GET user authentication route
router.get('/accessToken',
user_controller.get_access_token_on_get);

module.exports = router;