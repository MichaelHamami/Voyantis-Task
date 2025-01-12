import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
  })
);

const PORT = 5555;
const DEFAULT_TIMEOUT = 10000;
const queues = {}; // In-memory storage for queues

// GET /api/queues - Get all queues and number of messages for each queue
app.get("/api/queues", (req, res) => {
  const queueStats = Object.entries(queues).map(([queueName, messages]) => ({
    queueName,
    messageCount: messages.length,
  }));

  return res.send(queueStats);
});

// POST /api/:queue_name - Add message to a queue
app.post("/api/:queue_name", (req, res) => {
  const queueName = req.params.queue_name;
  const message = req.body;

  if (!queues[queueName]) {
    queues[queueName] = [];
  }

  queues[queueName].push(message);
  return res
    .status(201)
    .send({ success: true, message: "Message added to the queue" });
});

// GET /api/:queue_name - Get next message from the queue
app.get("/api/:queue_name", async (req, res) => {
  const queueName = req.params.queue_name;
  const timeout = parseInt(req.query.timeout, 10) || DEFAULT_TIMEOUT;

  if (!queues[queueName] || queues[queueName].length === 0) {
    await new Promise((resolve) => setTimeout(resolve, timeout));
    if (!queues[queueName] || queues[queueName].length === 0) {
      if (queues[queueName] && queues[queueName].length === 0)
        delete queues[queueName];
      return res.status(204).send();
    }
  }

  const message = queues[queueName].shift();
  return res.send(message);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
