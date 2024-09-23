/** Common config for bookstore. */


let DB_URI = `postgres://mooks2022:mookster21@localhost`;

if (process.env.NODE_ENV === "test") {
  DB_URI = `${DB_URI}/express_bookstore_test`;
} else {
  DB_URI = process.env.DATABASE_URL || `${DB_URI}/express_bookstore`;
}


module.exports = { DB_URI };