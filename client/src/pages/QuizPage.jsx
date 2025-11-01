import { useState , useRef  , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import '../styles/advice.css';
import '../styles/quiz.css';

function QuizPage() {
  const [ answers, setAnswers ] = useState({});
  const [status , setStatus] = useState("");


  const written_questions = [
    {id: "q1",  question: "What is your favorite color?"},
    {id: "q2",  question: "How do you usually spend your weekends?"},
    {id: "q3",  question: "What's your favorite fruit?"},
    {id: "q4",  question: "What is your dream vacation destination?"},
    {id: "q5",  question: "What's your favorite music artist?"},
    {id: "q6",  question: "Which flowers do you think is the most romantic?"},
    {id: "q7",  question: "What is your favorite season of the year?"},
    {id: "q8",  question: "What type of movies do you enjoy the most?"},
    {id: "q9",  question: "Morning person or night owl?"},
    {id: "q10", question: "Why do you want to know which flower you are?"}
    ];

  const mcq_questions = [
    {id: "q11", question: "How would your friends describe you? ",multi: true ,  options: ["Energetic", "Adventurous", "Calm" , "Thoughtful" , "Creative" , "Reliable" , "Elegant" , "Optimistic" , "Independent" , "Sociable"]},
    {id: "q12", question: "What weather makes you happiest?", multi: false , options: ["Sunny", "Cloudy", "Rainy" , "Windy" , "Snowy"]},
    {id: "q13", question: "Which of these best describes your mood most of the time?", multi: true , options: ["Bold", "Playful", "Serene", "Cheerful", "Romantic", "Optimistic", "Curious", "Relaxed"]},
    {id: "q14", question: "What's your favorite view of the following?",multi: false, options: ["Park", "Beach", "Forest" , "Mountains" , "City" , "Desert" , "Lake" , "Farm"]},
    {id: "q15", question: "Whatis your love languages?", multi: true , options: ["Physical Touch", "Words of Affirmation", "Quality Time" , "Acts of Service" , "Gift Giving"]},
    ];

  const navigate = useNavigate();

  // So that when status changes the view scrolls down to show it automatically
  const statusRef = useRef(null);
  useEffect(() => {
    if (status === "Please answer all questions before submitting!!" && statusRef.current) {
      statusRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [status]);

  const handleSubmit =() => {
    // Prevent submitting empty answers
    const x = written_questions.length + mcq_questions.length;
    if (Object.keys(answers).length < x) 
    {
      setStatus("Please answer all questions before submitting!!");
      setTimeout(() => {
        setStatus("");
      }, 3000);
      return;
    }
    // Process the answers to determine the flower type
    setStatus("Predicting your flower type..."); 


    setTimeout(() => {
      setStatus("Consulting AI Model..."); 
    }, 2000);

    setTimeout(() => {
      setStatus("Redirecting..."); 
    }, 4000);

    setTimeout(() => {
      const flower = "Rose";
      navigate(`/info/${encodeURIComponent(flower) }`);
    }, 5000);

  }
  return (
    <div className="quiz-page">
      <h1 className="header-info">Which flower are you?</h1>
      <div className="quiz-container">

        {/* If status is defined aka processing remove all quesitons and button */}
      {(!status || status == "Please answer all questions before submitting!!") && (
      <div className="question">
        {written_questions.map((q) => (
          <div key={q.id} className="item">
            <label>{q.question}</label>
            <input
              type="text"
              id = {q.id}
              value={answers[q.id] || ""}
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            />
          </div>
          ))}

        {mcq_questions.map((q) => (
          <div key={q.id} className="item">
            <label>{q.question}</label>
            <div className="options">
            {q.options.map((option) => (
              <div key={option} className="option-item">
                <input
                  type={q.multi ? "checkbox" : "radio"}
                  name={q.id}
                  value={option}
                  checked={q.multi ? (answers[q.id] || []).includes(option) : answers[q.id] === option}
                  onChange={
                    (e) => {
                      if (q.multi) {
                        const currentAnswers = answers[q.id] || [];
                        if (e.target.checked) {
                          setAnswers({ ...answers, [q.id]: [...currentAnswers, option] });
                        } else {
                          setAnswers({ ...answers, [q.id]: currentAnswers.filter(ans => ans !== option) });
                        }
                      } else {
                        setAnswers({ ...answers, [q.id]: option });
                      }
                  }
                }
                />
                <label>{option}</label>
              </div>
            ))}
            </div>
          </div>     
        ))}
      </div>
      )}
      
      {(!status || status == "Please answer all questions before submitting!!") && (
      <button 
      className="submit"
      onClick={handleSubmit}
      >Submit</button>

      )}
      {status && <p ref={statusRef} className="status">{status}</p>}
      </div>


    </div>
  );
}
export default QuizPage;