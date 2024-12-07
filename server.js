const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(express.static("public"));

// Define routers
const routers = [
    { id: 1, x: 200, y: 200, name: "Router 1" },
    { id: 2, x: 600, y: 200, name: "Router 2" },
];

// Handle transfer request
app.post("/transfer", (req, res) => {
    const { packetSize, bandwidth } = req.body;

    if (!packetSize || !bandwidth) {
        return res.status(400).send({ error: "Packet size and bandwidth are required!" });
    }

    // Calculate delay (ms)
    const delay = (packetSize * 8) / (bandwidth * 1000); // Delay = size in bits / bandwidth in kbps

    // Emit packet for animation
    const packet = {
        source: routers[0],
        destination: routers[1],
        delay: delay * 1000, // Convert to milliseconds for animation
    };
    io.emit("packet", packet);

    res.send({ delay: delay * 1000, packet });
});

// Handle client connection
io.on("connection", (socket) => {
    console.log("Client connected");
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
