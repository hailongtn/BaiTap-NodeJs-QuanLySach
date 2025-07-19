const express = require("express");
const app = express();
const logger = require("./middlewares/logger");
const contentTypeCheck = require("./middlewares/contentTypeCheck");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const booksRouter = require("./books");

app.use(express.json());
app.use(logger);
app.use(contentTypeCheck);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/books", booksRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
