import { useState , useEffect , useRef} from "react";
import '../styles/advice.css';
import ReactMarkdown from 'react-markdown';


function AdvicePage() {

  const [advice, setAdvice] = useState("");
  const [ messages, setMessages ] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);


  const handleSend = async() => {
    // Prevent sending empty messages
    if (!advice.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: advice }]);
    setAdvice("");

    // setTimeout(() => {
    //   setMessages((prev) => [
    //     ...prev,
    //     { sender: "ai", text: "Hello!! AI speaking, We're still working on the responses" },
    //   ]);
    // }, 1000);

    setMessages((prev) => [...prev, { sender: "ai", text: "Typing..." }]);
    
    setIsLoading(true);
    // Call the advice API
    try{
      // Understand fetch API
      // Method POST --> Used to send data to server
      // Headers --> Content type JSON
      // Body --> question
      const response = await fetch('/api/advice-api', { method: 'POST',
                                                  headers: {
                                                    'Content-Type': 'application/json',
                                                  },
                                                  body: JSON.stringify({ question: advice })
                                                }

    );

    const data = await response.json();

    // Remove the "Typing..." message
    setMessages((prev) => prev.filter((msg) => msg.text !== "Typing..."));
    setMessages((prev) => [...prev, { sender: "ai", text: data.response }]);

    setIsLoading(false);
    }
    catch(error){
      setMessages((prev) => [...prev, { sender: "ai", text: "Error: Unable to fetch advice at the moment. Please try again later." }]);
      console.error("Error fetching advice:", error);
      setIsLoading(false);
    }

   
  }

  // If they click enter
  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  }

  // Auto scroll to bottom when new message is added
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="advice-page">
      <h1 className="header-info">Need any advice about your flower?</h1>
      <div className="note">Note: Responses are generated independently (This is not a ChatBot).</div>
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user" : "ai"}`}
          >
           {msg.sender === "ai" ? (
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          ) : (
            msg.text
          )}
          </div>
          ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={advice}
          onChange={(e) => setAdvice(e.target.value)}
          onKeyDown={handleEnter}
          disabled={isLoading}
          placeholder="Ask for whatever you want on flowers..."
        />
        <button disabled={isLoading} onClick={handleSend}>Send</button>
        
      </div>
      <div className="disclaimer">Disclaimer: The advice provided by the AI is for eduactional purposes only and should not be considered as professional guidance.</div>  
    </div>
  );
}
export default AdvicePage;

// To Do:
// Animation of typing


