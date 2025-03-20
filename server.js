const app = require("./app");
const connection = require("./config/DB");

// Connection To Db
//connection();

// Running The Server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
