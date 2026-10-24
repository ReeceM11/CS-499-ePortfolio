const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

const tripMap = new Map();

// Build a map using each trip code as the key
const buildTripMap = (trips) => {
    tripMap.clear();

    trips.forEach((trip) => {
        tripMap.set(trip.code, trip);
    });
};

// Get: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async(req, res) => {
    const q = await Model
        .find({}) // No filter, return all records
        .exec();

        // Uncomment the following line to show results of query
        // on the console
        // console.log(q);

    buildTripMap(q);

    if(!q)
    { // Database returned no data
        return res
            .status(404)
            .json(err);
    } else { // Return resulting trip list
        return res
            .status(200)
            .json(q)
    }
};

const tripsAddTrip = async (req, res) => {
  const newTrip = new Trip({
    code: req.body.code,
    name: req.body.name,
    length: req.body.length,
    start: req.body.start,
    resort: req.body.resort,
    perPerson: req.body.perPerson,
    image: req.body.image,
    description: req.body.description
  });

  const q = await newTrip.save();

  if (!q) {
    return res
      .status(400)
      .json({ message: 'Unable to add trip' });
  } else {
    tripMap.set(q.code, q);
    
    return res
      .status(201)
      .json(q);
  }
};

const tripsUpdateTrip = async (req, res) => {
  const q = await Trip
    .findOneAndUpdate(
      { code: req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      { new: true }
    )
    .exec();

  if (!q) {
    return res
      .status(400)
      .json({ message: 'Trip not found' });
  } else {
      tripMap.set(q.code, q);

      return res
        .status(201)
        .json(q);
  }
};

const tripsFindByCode = async(req, res) => {
    const q = tripMap.get(req.params.tripCode);

    // Uncomment the following line to show the trip found in the map
    // console.log(q);

    if(!q)
    { // Trip code was not found in the map
        return res
            .status(404)
            .json({ message: 'Trip not found' });
    } else { // Return resulting trip
        return res
            .status(200)
            .json([q])
    }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip
};