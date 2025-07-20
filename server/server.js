const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") }); // ✅ Load env early

console.log("TEST_VAR:", process.env.TEST_VAR);

const express = require("express");
const app = express();

app.use(express.json());

const dbConfig = require("./config/dbConfig"); // ✅ Mongo URI will now be defined
const port = process.env.PORT || 5000;

const usersRoute = require("./routes/usersRoute");
const projectsRoute = require("./routes/projectsRoute");
const tasksRoute = require("./routes/tasksRoute");
const notificationsRoute = require("./routes/notificationsRoute");

app.use("/api/users", usersRoute);
app.use("/api/projects", projectsRoute);
app.use("/api/tasks", tasksRoute);
app.use("/api/notifications", notificationsRoute);

__dirname = path.resolve(); // ✅ reuse existing path variable

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => console.log(`Node JS server listening on port ${port}`));
