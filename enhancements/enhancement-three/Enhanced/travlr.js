const mongoose = require('mongoose');

// Define the trip schema
const tripSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, index: true, trim: true, minlength: 1 },  
    name: { type: String, required: true, index: true, trim: true, minlength: 1 },
    length: { type: String, required: true },
    start: { type: Date, required: true },
    resort: { type: String, required: true },
    perPerson: { type: String, required: true, trim: true, minlength: 1 },
    image: { type: String, required: true },
    description: { type: String, required: true },
});
const Trip = mongoose.model('trips', tripSchema);
module.exports = Trip;