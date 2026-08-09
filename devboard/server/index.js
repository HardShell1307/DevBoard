const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

// Make io available to route handlers (req.app.get("io"))
app.set("io", io);

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/github", require("./routes/github"));
app.use("/api/ai", require("./routes/ai"));

app.get("/", (req, res) => res.json({ message: "DevBoard API running 🚀" }));

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    // change app.listen to server.listen
    server.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
