//set process before we require DB
process.env.NODE_ENV = "test"

const request=require("supertest")
const app=require("./app")
const db=require("./db")
const Book = require("./models/book");

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

beforeEach(async () =>{
  const book = await Book.create(bookData)
  testBook=book
  console.log("inside beforeEach!","here is testBook ---->",testBook)
})

afterEach(async()=>{
  await Book.remove(bookData.isbn)
})

afterAll(async () =>{
  await db.end();
})

describe("GET /books" , () =>{
  test("get a list with one book", async () =>{
    const res=await request(app).get("/books")
    expect(res.statusCode).toBe(200)
  })
})