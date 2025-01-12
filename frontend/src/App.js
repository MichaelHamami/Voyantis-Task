import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "http://localhost:3000/api";

function App() {
  const [queues, setQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all queues and message counts
  useEffect(() => {
    async function fetchQueues() {
      try {
        const response = await axios.get(`${API_BASE_URL}/queues`);
        setQueues(response.data);
      } catch (error) {
        console.error("Error fetching queues:", error);
      }
    }
    fetchQueues();
  }, []);

  // Handle queue selection and fetch messages
  const handleGoClick = async () => {
    if (!selectedQueue) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/${selectedQueue}`);
      setMessages([...messages, response.data]);
    } catch (error) {
      if (error.response && error.response.status === 204) {
        alert("No messages available in the queue.");
      } else {
        console.error("Error fetching message:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Voyantis Queue Manager</h1>
      </header>

      <main>
        <div className="queue-list">
          <h2>Available Queues</h2>
          <ul>
            {queues.map((queue) => (
              <li key={queue.name}>
                {queue.name} ({queue.count} messages)
              </li>
            ))}
          </ul>
        </div>

        <div className="queue-actions">
          <h2>Select a Queue</h2>
          <select
            value={selectedQueue}
            onChange={(e) => setSelectedQueue(e.target.value)}
          >
            <option value="">-- Select a Queue --</option>
            {queues.map((queue) => (
              <option key={queue.name} value={queue.name}>
                {queue.name}
              </option>
            ))}
          </select>
          <button onClick={handleGoClick} disabled={loading}>
            {loading ? "Loading..." : "Go"}
          </button>
        </div>

        <div className="message-list">
          <h2>Messages</h2>
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{JSON.stringify(message)}</li>
            ))}
          </ul>
        </div>
      </main>

      <footer>
        <p>Powered by Hamami to Voyantis</p>
      </footer>
    </div>
  );
}

export default App;
