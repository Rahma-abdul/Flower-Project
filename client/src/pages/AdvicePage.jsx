import { useState } from "react";
import '../styles/advice.css';

function AdvicePage() {

  const [advice, setAdvice] = useState("");
  const [ messages, setMessages ] = useState([]);

  const handleSend = () => {
    // Prevent sending empty messages
    if (!advice.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: advice }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Hello!! AI speaking, We're still working on the responses" },
      ]);
    }, 1000);

    setAdvice("");
  }

  // If they click enter
  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  }


  return (
    <div className="advice-page">
      <h1 className="header-info">Flower Bot</h1>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user" : "ai"}`}
          >
            {msg.text}
          </div>
          ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={advice}
          onChange={(e) => setAdvice(e.target.value)}
          onKeyDown={handleEnter}
          placeholder="Ask for whatever you want on flowers..."
        />
        <button onClick={handleSend}>Send</button>
      </div>

    </div>
  );
}
export default AdvicePage;