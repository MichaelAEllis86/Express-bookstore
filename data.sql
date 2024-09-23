-- run this SQL file to seed DB

\c express_bookstore 

DROP TABLE IF EXISTS books;



CREATE TABLE books (
  isbn TEXT PRIMARY KEY,
  amazon_url TEXT,
  author TEXT,
  language TEXT, 
  pages INTEGER,
  publisher TEXT,
  title TEXT, 
  year INTEGER
);

INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) 
VALUES ('9780143127550', 'http://a.co/d/9GDRnX1', 'Yuval Noah Harari', 'english', 464, 'Harper', 'Sapiens: A Brief History of Humankind', 2015);

INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) 
VALUES ('9780307887894', 'http://a.co/d/8F6bLZC', 'Sheryl Sandberg', 'english', 240, 'Knopf', 'Lean In: Women, Work, and the Will to Lead', 2013);

INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) 
VALUES ('9780062316097', 'http://a.co/d/fP9JQq4', 'Trevor Noah', 'english', 304, 'Spiegel & Grau', 'Born a Crime: Stories from a South African Childhood', 2016);

INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) 
VALUES ('9780812981605', 'http://a.co/d/5jCV2H5', 'Tara Westover', 'english', 352, 'Random House', 'Educated: A Memoir', 2018);

INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) 
VALUES ('9781501124020', 'http://a.co/d/4f6PRtY', 'Paula Hawkins', 'english', 336, 'Riverhead Books', 'The Girl on the Train', 2015);

INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) 
VALUES ('9780385543767', 'http://a.co/d/2sThk9C', 'Celeste Ng', 'english', 368, 'Penguin Press', 'Little Fires Everywhere', 2017);

INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) 
VALUES ('9780451495426', 'http://a.co/d/1FLfWqT', 'Delia Owens', 'english', 384, 'G.P. Putnam''s Sons', 'Where the Crawdads Sing', 2018);

INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) 
VALUES ('9780316450867', 'http://a.co/d/3dHTf2M', 'Michelle Obama', 'english', 448, 'Crown', 'Becoming', 2018);

INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) 
VALUES ('9780062457714', 'http://a.co/d/0sJjRj5', 'Haruki Murakami', 'english', 400, 'Knopf', 'Killing Commendatore', 2018);

INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) 
VALUES ('9781984822178', 'http://a.co/d/5dLjxG7', 'Michelle Alexander', 'english', 432, 'The New Press', 'The New Jim Crow: Mass Incarceration in the Age of Colorblindness', 2010);
