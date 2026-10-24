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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const q = await Model
        .find({}) // No filter, return trip records
        .skip(skip)
        .limit(limit)
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

    try {
        const q = await newTrip.save();

        tripMap.set(q.code, q);

        return res.status(201).json(q);
    } catch (err) {
        return res.status(400).json({
            message: 'Unable to add trip',
            error: err.message
        });
    }
};

const tripsUpdateTrip = async (req, res) => {
    try {
        const q = await Trip.findOneAndUpdate(
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
            { new: true, runValidators: true }
        ).exec();

        if (!q) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        tripMap.set(q.code, q);

        return res.status(200).json(q);
    } catch (err) {
        return res.status(400).json({
            message: 'Unable to update trip',
            error: err.message
        });
    }
};

const tripsFindByCode = async(req, res) => {
    let q = tripMap.get(req.params.tripCode);

    if (!q) {
        q = await Model
            .findOne({ code: req.params.tripCode })
            .exec();

        if (q) {
            tripMap.set(q.code, q);
        }
    }

    // Uncomment the following line to show the trip found
    // console.log(q);

    if (!q)
    { // Trip code was not found
        return res
            .status(404)
            .json({ message: 'Trip not found' });
    } else { // Return resulting trip as an array
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