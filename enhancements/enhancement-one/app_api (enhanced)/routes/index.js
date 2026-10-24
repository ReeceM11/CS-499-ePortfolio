const express = require("express");
const router = express.Router();

const tripsController = require("../controllers/trips");
const authController = require('../controllers/authentication');

const {
    authenticateJWT,
    authorizeRole
} = require('../middleware/auth');

router
  .route('/trips')
  .get(tripsController.tripsList)
  .post(authenticateJWT, authorizeRole('admin'), tripsController.tripsAddTrip);

router
  .route('/register')
  .post(authController.register);

router
  .route('/login')
  .post(authController.login);

router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, authorizeRole('admin'), tripsController.tripsUpdateTrip);

module.exports = router;