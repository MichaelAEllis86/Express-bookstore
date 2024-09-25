//set process before we require DB
// instructions to run this test!!!! NPM test (since i am using a local directory install of the jest pkg)! or if u globally install jest jest cmd would likely work.
process.env.NODE_ENV = "test"

const request=require("supertest")
const app=require("./app")
const db=require("./db")
const Book = require("./models/book");
const expressError=require("./expressError")

//a single book to test! it is added to the db before each test
const bookData={
    "isbn": "9781122334455",
    "amazon_url": "http://a.co/d/fakebook789",
    "author": "Alice Johnson",
    "language": "english",
    "pages": 350,
    "publisher": "Novelty Press",
    "title": "The Chronicles of Code",
    "year": 2022
  }
let testBook;

// book data ready to add via post route! using this book to test post route specifically
const bookDataPost={
  "isbn": "9781982134554",
  "amazon_url": "http://a.co/dpOJG9m",
  "author": "Harper Adams",
  "language": "english",
  "pages": 354,
  "publisher": "Riverwood Press",
  "title": "Echoes of the Forgotten",
  "year": 2022
}

beforeEach(async () =>{
  const book = await Book.create(bookData)
  testBook=book
  console.log("inside beforeEach!","here is testBook ---->",testBook)
})

afterEach(async () => {
  // Check if the book still exists before trying to remove it! we need this conditional logic because the delete test deletes the book that is normally deleted by afterEach!!
  const book = await Book.findOne(bookData.isbn);
  if (book) {
    await Book.remove(bookData.isbn);
  }
});
// we need to delete added POST request data to clean up the DB properly
afterAll(async () =>{
  await db.query("DELETE FROM books WHERE isbn IN ($1, $2)", [bookData.isbn, bookDataPost.isbn]);
  await db.end();
})

describe("GET /books" , () =>{
  test("get a list with one book(one book in our tests would be more in theory)", async () =>{
    const response=await request(app).get("/books");
    expect(response.statusCode).toEqual(200);
    console.log("logging status code for /books....",response.statusCode);
    console.log("logging the response.body for /books", response.body);
    expect(response.body).toEqual({books:[{"isbn": "9781122334455",
    "amazon_url": "http://a.co/d/fakebook789",
    "author": "Alice Johnson",
    "language": "english",
    "pages": 350,
    "publisher": "Novelty Press",
    "title": "The Chronicles of Code",
    "year": 2022}]})
  })
})

//test successful fetch
describe("GET /books/:isbn", () =>{
  test("get a book based upon route param isbn", async () =>{
    const response=await request(app).get(`/books/${bookData.isbn}`);
    expect(response.statusCode).toEqual(200);
    console.log("logging status code /books/:isbn....",response.statusCode);
    console.log("logging the response.body /books/:isbn", response.body);
    expect(response.body).toEqual({book:{"isbn": "9781122334455",
    "amazon_url": "http://a.co/d/fakebook789",
    "author": "Alice Johnson",
    "language": "english",
    "pages": 350,
    "publisher": "Novelty Press",
    "title": "The Chronicles of Code",
    "year": 2022}})
    
    
  })
})

//test unsuccessful fetch and 404 response
describe("GET /books/:isbn", () =>{
  test("book not found 404", async () =>{
    const response=await request(app).get(`/books/1234`);
    expect(response.statusCode).toEqual(404);
    console.log("logging status code /books/:isbn....",response.statusCode);
    console.log("logging the response.body /books/:isbn", response.body);
    expect(response.body).toEqual({
      "error": {
        "message": "There is no book with an isbn '1234",
        "status": 404
      },
      "message": "There is no book with an isbn '1234"
    })
  })
})

//testing a successful post route using bookDataPost 
describe("POST /books", () =>{
  test("Create a new book via req.body payload", async () =>{
    const response=await request(app).post("/books").send({
      "isbn": "9781982134554",
      "amazon_url": "http://a.co/dpOJG9m",
      "author": "Harper Adams",
      "language": "english",
      "pages": 354,
      "publisher": "Riverwood Press",
      "title": "Echoes of the Forgotten",
      "year": 2022
    })
    expect(response.statusCode).toEqual(201);
    console.log("logging status code for POST /books/",response.statusCode);
    console.log("logging the response.body POST /books/", response.body);
    expect(response.body).toEqual({
      "book": {
        "isbn": "9781982134554",
        "amazon_url": "http://a.co/dpOJG9m",
        "author": "Harper Adams",
        "language": "english",
        "pages": 354,
        "publisher": "Riverwood Press",
        "title": "Echoes of the Forgotten",
        "year": 2022
      }
    })

  })
})

//testing an unsuccessful POST route that is lacking the proper json structures this one will deliberately lack a required isbn
describe("POST /books", () =>{
  test("Test JSON schema for invalid POST request json", async () =>{
    const response=await request(app).post("/books").send({
      "amazon_url": "http://a.co/dpOJG9m",
      "author": "Harper Adams",
      "language": "english",
      "pages": 354,
      "publisher": "Riverwood Press",
      "title": "Echoes of the Forgotten",
      "year": 2022
    })
    expect(response.statusCode).toEqual(400);
    console.log("logging status code for POST /books/ bad schema" ,response.statusCode);
    console.log("logging the response.body POST /books/ bad schema" , response.body);
    expect(response.body).toEqual({
      "error": {
        "message": [
          "instance requires property \"isbn\""
        ],
        "status": 400
      },
      "message": [
        "instance requires property \"isbn\""
      ]
    })

  })
})

//test for successful PUT route with correct json schema
describe("PUT /books/:isbn", () =>{
  test("Test editing all properties of a book except the isbn", async () =>{
    const response=await request(app).put(`/books/${bookData.isbn}`).send({
      "amazon_url": "http://a.co/dpOJG9m",
      "author": "testy mctest",
      "language": "english",
      "pages": 354,
      "publisher": "test Press",
      "title": "Echoes of the Forgotten test book",
      "year": 2022})
      expect(response.statusCode).toBe(200)
      console.log("logging status code for PUT /books/:isbn ---->",response.statusCode);
      console.log("logging the response.body PUT /books/:isbn ---->", response.body);
      expect(response.body).toEqual({
        "book": {
          "isbn": "9781122334455",
          "amazon_url": "http://a.co/dpOJG9m",
          "author": "testy mctest",
          "language": "english",
          "pages": 354,
          "publisher": "test Press",
          "title": "Echoes of the Forgotten test book",
          "year": 2022
        }
      })
  })
})
//test for unsuccessful PUT route with incorrect json schema lacking language and pages fields 
describe("PUT /books/:isbn", () =>{
  test("Test editing all properties of a book except the isbn", async () =>{
    const response=await request(app).put(`/books/${bookData.isbn}`).send({
      "amazon_url": "http://a.co/dpOJG9m",
      "author": "testy mctest",
      "publisher": "test Press",
      "title": "Echoes of the Forgotten test book",
      "year": 2022})
      expect(response.statusCode).toBe(400)
      console.log("logging status code for PUT /books/:isbn bad schema ---->",response.statusCode);
      console.log("logging the response.body PUT /books/:isbn bad schema ---->", response.body);
      expect(response.body).toEqual({
        "error": {
          "message": [
            "instance requires property \"language\"",
            "instance requires property \"pages\""
          ],
          "status": 400
        },
        "message": [
          "instance requires property \"language\"",
          "instance requires property \"pages\""
        ]
      })
  })
})

// test PUT route for 404 if isbn isn't found
describe("PUT /books/:isbn", () =>{
  test("Test editing all properties of a book except the isbn", async () =>{
    const response=await request(app).put(`/books/1234`).send({
      "amazon_url": "http://a.co/dpOJG9m",
      "author": "testy mctest",
      "language": "english",
      "pages": 354,
      "publisher": "test Press",
      "title": "Echoes of the Forgotten test book",
      "year": 2022})
      expect(response.statusCode).toBe(404)
      console.log("logging status code for PUT /books/:isbn 404 test ---->",response.statusCode);
      console.log("logging the response.body PUT /books/:isbn 404 test ---->", response.body);
      expect(response.body).toEqual({
        "error": {
          "message": "There is no book with an isbn '1234",
          "status": 404
        },
        "message": "There is no book with an isbn '1234"
      })
  })
})

describe("DELETE /books/:isbn", () =>{
  test("test deletion of a book via isbn route param", async () =>{
    console.log("Trying to delete book with ISBN:", bookData.isbn);
    const response=await request(app).delete(`/books/${bookData.isbn}`)
    expect(response.statusCode).toBe(200)
    console.log("logging status code for DELETE /books/:isbn  test ---->",response.statusCode);
    console.log("logging the response.body DELETE /books/:isbn test ---->", response.body);
    expect(response.body).toEqual({
      "message": "Book deleted"
    })
  })
})

