const axios = require("axios")

let currentEnvironment = "localhost"


async function getBooks() {
    let result = await axios
        .get(`http://${currentEnvironment}:8750/get-books`)
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
        .post(`http://${currentEnvironment}:8750/add-book`, data)
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
        .post(`http://${currentEnvironment}:8750/delete-book`, data)
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
        .post(`http://${currentEnvironment}:8750/update-book`, data)
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