require("module-alias/register");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const corsOptions = require("@root/config/corsOptions");

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

// ROUTES
app.use("/api/", require("@root/routes/jwtAuth"));
app.use("/api/", require("@root/routes/doctor"));
app.use("/api/", require("@root/routes/patient"));
app.use("/api/", require("@root/routes/prediction"));
app.use("/api/", require("@root/routes/session"));

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
