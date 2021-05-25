const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const revewSchema = new Schema({
	body: String,
	rating: Number
});

module.exports = mongoose.model('Review', revewSchema);
