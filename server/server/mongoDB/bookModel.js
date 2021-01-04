const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
	id: {
        type: String,
        required: [true, "can't be blank"],
        unique: true,
	},
    title: {
        type: String,
        required: [true, "can't be blank"]
	},
    author: {
        type: String,
        required: [true, "can't be blank"]
	},
    editorial: {
        type: String,
        required: [true, "can't be blank"]
	},
    isbn: {
        type: String,
	},
    year: {
        type: String,
	},
    img: {
        type: String
	},
    borrowed: {
        type: Boolean,
	},
    borrowedTo: {
        type: String,
	},
	
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;