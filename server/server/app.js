const express = require("express")
const app = express();
const puerto = 80;
const bodyParser = require("body-parser")
const Cors = require("cors")
const mongoose = require("mongoose")
const environment = process.env.NODE_ENV
var dbLink = new String()
const Book = require("./mongoDB/bookModel.js")
const Validation = require("./tools/validation.js")

// Set environment
if (environment == "production")
    dbLink = "mongodb://board_DB:27017/mongoboard"
else
    dbLink = "mongodb://localhost:27017/mongoboard"

// Middlewares
app.use(Cors());
app.use(bodyParser.json());

// Open port
app.listen(puerto, () => console.log("Listening port " + puerto))

// DataBase connection
let timeOut = setInterval(() => {
    mongoose.connect(dbLink, { useNewUrlParser: true }, (err) => {
        if (err) {
            console.log("Encountered an error in Db Connection")
        } else {
            console.log("Succesfully connected with DB");
            clearInterval(timeOut)
        }
    })
}, 5000);

// ++++++++++++++++ HTTP METHODS +++++++++++++++++++ //



// Server status
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html")
})

// Get al user books
app.get("/get-books", async (req, res) => {
    await Book.find()
        .then((book) => { res.send({ code: 200, status: book }) })
        .catch((err) => { res.send({ code: 404, status: err }) })
})

// Add Book
app.post("/add-book", async (req, res) => {
    let body = req.body

    // Validation
    let validationResult = Validation.validateDataFields(
        body,
        ["id", "title", "author", "editorial", "isbn", "year"],
        "adding new book"
    );
    if (validationResult.isError) {
        console.log(validationResult.isError);
        res.status(200).send({ code: validationResult.error, status: validationResult.message });
        return;
    }

    let bookModel = new Book({
        id: body.id,
        title: body.title,
        author: body.author,
        isbn: body.isbn,
        editorial: body.editorial,
        year: body.year,
        img: "",
        borrowed: false,
        borrowedTo: "",
    })

    await bookModel.save()
    .then((book) => { res.send({ code: 200, status: book }) })
    .catch((err) => { res.send({ code: 404, status: err }) })
})

// Delete book
app.post("/delete-book", async (req, res) => {
    let body = req.body

    // Validation
    let validationResult = Validation.validateDataFields(
        body,
        ["id"],
        "deleting book"
    );
    if (validationResult.isError) {
        console.log(validationResult.isError);
        res.status(200).send({ code: validationResult.error, status: validationResult.message });
        return;
    }

    await Book.deleteOne({id: body.id})
    .then((book) => { res.send({ code: 200, status: book }) })
    .catch((err) => { res.send({ code: 404, status: err }) })
})

// Update Book 
app.post("/update-book", async (req, res) => {
    let body = req.body
    
    // Validation
    let validationResult = Validation.validateDataFields(
        body,
        ["id", "field", "newValue"],
        "updating book"
    );
    if (validationResult.isError) {
        console.log(validationResult.isError);
        res.status(200).send({ code: validationResult.error, status: validationResult.message });
        return;
    }

    if (body.field < 0 || body.newValue.length == 0) {
        res.status(200).send({ code: 400, status: `Param not correct. field: ${body.field}, new value: ${body.newValue}` });
        return;
    }

    let messageObject = body.newValue

    if (body.field == 0) {
        await Book.updateOne( { id: body.id }, { author: messageObject })
        .then((book) => { res.send({ code: 200, status: book }) })
        .catch((err) => { res.send({ code: 404, status: err }) })
    } else if (body.field == 1) {
        await Book.updateOne( { id: body.id }, { title: messageObject })
        .then((book) => { res.send({ code: 200, status: book }) })
        .catch((err) => { res.send({ code: 404, status: err }) })
    } else if (body.field == 2) {
        await Book.updateOne( { id: body.id }, { year: messageObject })
        .then((book) => { res.send({ code: 200, status: book }) })
        .catch((err) => { res.send({ code: 404, status: err }) })
    } else if (body.field == 3) {
        await Book.updateOne( { id: body.id }, { isbn: messageObject })
        .then((book) => { res.send({ code: 200, status: book }) })
        .catch((err) => { res.send({ code: 404, status: err }) })
    } else if (body.field == 4) {
        await Book.updateOne( { id: body.id }, { editorial: messageObject })
        .then((book) => { res.send({ code: 200, status: book }) })
        .catch((err) => { res.send({ code: 404, status: err }) })
    } else if (body.field == 5) {
        await Book.updateOne( { id: body.id }, { image: messageObject })
        .then((book) => { res.send({ code: 200, status: book }) })
        .catch((err) => { res.send({ code: 404, status: err }) })
    } else if (body.field == 6) {
        await Book.updateOne( { id: body.id }, { borrowed: messageObject })
        .then((book) => { res.send({ code: 200, status: book }) })
        .catch((err) => { res.send({ code: 404, status: err }) })
    } else if (body.field == 7) {
        await Book.updateOne( { id: body.id }, { borrowedTo: messageObject })
        .then((book) => { res.send({ code: 200, status: book }) })
        .catch((err) => { res.send({ code: 404, status: err }) })
    } else {
        res.status(200).send({ code: 400, status: `Param not found. field: ${body.field}, new value: ${body.newValue}` });
    }


})