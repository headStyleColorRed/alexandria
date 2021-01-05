const axios = require("axios")

let currentEnvironment = "37.134.12.86"
let serverPort = 3001

async function getBooks() {
    let result = await axios
        .get(`http://${currentEnvironment}:${serverPort}/get-books`)
        .then((res) => {
            console.log(res);
            if (res.data.code != 200) throw res.data;
            else return res.data.status;
        })
        .catch((err) => {
            console.log("err: " + err);
            throw err;
        });
    return result;
}

async function addBook(data) {
    let result = await axios
        .post(`http://${currentEnvironment}:${serverPort}/add-book`, data)
        .then((res) => {
            console.log(res);
            if (res.data.code != 200) throw res.data;
            else return res.data;
        })
        .catch((err) => {
            console.log("err: " + err);
            throw err;
        });
    return result;
}

async function deleteBook(data) {
    let result = await axios
        .post(`http://${currentEnvironment}:${serverPort}/delete-book`, data)
        .then((res) => {
            console.log(res);
            if (res.data.code != 200) throw res.data;
            else return res.data;
        })
        .catch((err) => {
            console.log("err: " + err);
            throw err;
        });
    return result;
}

async function updateBook(data) {
    let result = await axios
        .post(`http://${currentEnvironment}:${serverPort}/update-book`, data)
        .then((res) => {
            console.log(res);
            if (res.data.code != 200) throw res.data;
            else return res.data;
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
    return result;
}

export default  {
    getBooks,
    addBook,
    deleteBook,
    updateBook,
}