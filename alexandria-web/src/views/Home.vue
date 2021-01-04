<template>
  <div class="home">
    <v-app-bar fixed dark dense>
      <v-toolbar-title>Alexandria</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon v-on:click="showBookSearch()">mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon v-on:click="addNewBook()">add</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- C O N T E N T   -->
    <v-main class="content">
      <v-container>
        <template v-for="book in books">
          <v-card
            dark
            class="bookCard"
            :key="book.id"
            v-on:click="bookInfoShow(book)"
          >
            <v-card-title> {{ book.title }} </v-card-title>
            <v-card-text>
              <p class="author">by {{ book.author }}</p>
              <p v-if="book.borrowed" class="borrowed">
                Borrowed by <b class="borrower">{{ book.borrowedTo }}</b>
              </p>
            </v-card-text>
          </v-card>
        </template>
      </v-container>
    </v-main>

    <!-- Book Search Dialog   -->
    <div class="text-center">
      <v-dialog v-model="search" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            Busca un libro
          </v-card-title>

          <v-container fluid>
            <v-col>
              <v-select :items="selections" label="Filtrar por"></v-select>
              <v-text-field
                name="name"
                label="Parámetros de filtro"
                single-line
              ></v-text-field>
            </v-col>
          </v-container>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false"> Buscar </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- Book Modify Dialog   -->
    <div class="text-center">
      <v-dialog v-model="modify" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            Modifica un libro
          </v-card-title>

          <v-container fluid>
            <v-col>
              <v-select
                :items="selections"
                label="Campo a modificar"
                v-model="modifyingBook.field"
              ></v-select>
              <v-text-field
                name="name"
                label="Nuevo valor"
                single-line
                v-model="modifyingBook.newValue"
              ></v-text-field>
            </v-col>
          </v-container>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="updateBook(modifyingBook)">
              Actualizar
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- Book info   -->
    <v-bottom-sheet dark v-model="bookInfo">
      <v-sheet class="text-center" height="80vh">
        <div class="bookInfoWrapper">
          <v-img
            class="imgInfo"
            max-width="150"
            :src="selectedBook.img"
          ></v-img>
          <h2 class="bookInfoTitle">{{ selectedBook.title }}</h2>
          <p class="bookInfoAuthor"><b>Autor:</b> {{ selectedBook.author }}</p>
          <p class="bookInfoAuthor">
            <b>Editorial:</b> {{ selectedBook.editorial }}
          </p>
          <p class="bookInfoAuthor">
            <b>Isbn:</b> {{ selectedBook.isbn }}
          </p>
          <p class="bookInfoAuthor"><b>Año:</b> {{ selectedBook.year }}</p>
          <p v-if="selectedBook.borrowed" class="bookInfoAuthor borrowedInfo">
            <b>Prestado a:</b> {{ selectedBook.borrowedTo }}
          </p>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="orange" v-on:click="deleteBook()" text>Borrar</v-btn>
            <v-btn color="blue" v-on:click="modifyBook()" text>Editar</v-btn>
            <v-btn color="green" v-on:click="lendBook()" text>Prestar</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </div>
      </v-sheet>
    </v-bottom-sheet>

    <!-- New Book   -->
    <v-bottom-sheet dark v-model="newBook">
      <v-sheet class="text-center" height="80vh">
        <div class="newBookWrapper">
          <h2 class="newBookTitle">New Book</h2>
          <v-text-field
            label="Título"
            single-line
            v-model="newUserBook.title"
          ></v-text-field>
          <v-text-field
            label="Autor"
            single-line
            v-model="newUserBook.author"
          ></v-text-field>
          <v-text-field
            label="Editorial"
            single-line
            v-model="newUserBook.editorial"
          ></v-text-field>
          <v-text-field
            label="Año"
            single-line
            v-model="newUserBook.year"
          ></v-text-field>
          <v-text-field
            label="Isbn"
            single-line
            v-model="newUserBook.isbn"
          ></v-text-field>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="orange" v-on:click="saveNewBook()" text
              >Guardar</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </div>
      </v-sheet>
    </v-bottom-sheet>

    <!-- Error Snack   -->
    <v-snackbar v-model="error" top>
      {{ errorText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="error = false">
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
// @ is an alias to /src
import booksArray from "@/assets/books.json";
import ServiceManager from "@/services/bookServices.js";

export default {
  name: "Home",
  data() {
    return {
      bookInfo: false,
      error: false,
      search: false,
      modify: false,
      newBook: false,
      selections: ["Autor", "Título", "Año", "Isbn", "Editorial"],
      books: new Array(),
      selectedBook: new Object(),
      modifyingBook: {
        field: "",
        newValue: "",
      },
      newUserBook: {
        title: "",
        author: "",
        editorial: "",
        year: "",
        isbn: "",
      },
      errorText: "Generic Error",
    };
  },
  mounted() {
    this.loadBooks();
  },
  methods: {
    showBookSearch() {
      this.search = true;
    },
    loadBooks() {
      ServiceManager.getBooks()
        .then((res) => {
          this.books = res;
        })
        .catch((err) => {
          this.errorText = err;
          this.error = true;
        });
    },
    bookInfoShow(book) {
      this.newUserBook.title = "";
      this.newUserBook.author = "";
      this.newUserBook.year = "";
      this.selectedBook = book;
      this.bookInfo = true;
    },
    deleteBook() {
      let deleteModel = {
        id: this.selectedBook.id,
      };
      ServiceManager.deleteBook(deleteModel)
        .then((res) => {
          this.loadBooks();
          this.bookInfo = false;
        })
        .catch((err) => {
          this.errorText = err;
          this.error = true;
        });
    },
    modifyBook() {
      this.modify = true;
    },
    lendBook() {
      print("lend book");
    },
    addNewBook() {
      this.newUserBook = {
        title: "",
        author: "",
        editorial: "",
        year: "",
        isbn: "",
      }
      this.newBook = true;
    },
    saveNewBook() {
      let newBookModel = {
        id: this.generateRandomId(15),
        title: this.newUserBook.title,
        author: this.newUserBook.author,
        year: this.newUserBook.year,
        isbn: this.newUserBook.isbn,
        img: "https://static.megustaleer.com/images/libros_650_x/EH405173.jpg",
        editorial: this.newUserBook.editorial,
        borrowed: false,
        borrowedTo: "",
      };

      ServiceManager.addBook(newBookModel)
        .then((res) => {
          this.newBook = false;
          this.loadBooks();
        })
        .catch((err) => {
          this.errorText = err;
          this.error = true;
          this.newBook = false;
        });
    },
    generateRandomId(len) {
      var charSet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let randomString = "";

      for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
      }
      return randomString;
    },
    updateBook(modifyBook) {

      let index = this.selections.indexOf(modifyBook.field)

      let updatemodel = {
        id: this.selectedBook.id,
        field: index,
        newValue: modifyBook.newValue,
      }
      
      ServiceManager.updateBook(updatemodel)
        .then((res) => {
          this.loadBooks();
          this.bookInfo = false
          this.modify = false;
        })
        .catch((err) => {
          this.errorText = err;
          this.error = true;
        });
    },
  },
  components: {},
};
</script>


<style scoped>
.home {
  background-color: rgb(71, 71, 71);
  min-height: 100vh;
}
.content {
  margin-top: 3rem;
}

.bookCard {
  margin-bottom: 2rem;
}

.author {
  margin-top: -1rem;
  margin-bottom: 10px;
}

.borrowed {
  font-size: 12px;
  color: red;
  margin-bottom: 0;
}

.bookInfoWrapper {
  padding: 1rem;
  text-align: left;
  display: grid;
  height: 80vh;
  overflow-y: scroll;
}

.bookInfoTitle {
  text-align: center;
  margin-bottom: 1rem;
}

.borrowedInfo {
  font-size: 14px;
  color: red;
}

.imgInfo {
  justify-self: center;
}

.bookInfoTitle {
  margin-top: 1rem;
}

.newBookWrapper {
  text-align: left;
  padding: 1rem;
  display: grid;
  height: 80vh;
  overflow-y: scroll;
}

.newBookTitle {
  text-align: center;
}
</style>