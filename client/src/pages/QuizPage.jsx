import { useState , useRef  , useEffect} from "react";
import { data, useNavigate } from "react-router-dom";
import '../styles/advice.css';
import '../styles/quiz.css';

function QuizPage() {
  const [ answers, setAnswers ] = useState({});
  const [status , setStatus] = useState("");


  const written_questions = [
    {id: "Fav Color",  question: "What is your favorite color?"},
    {id: "Hobby",  question: "How do you usually spend your weekends?"},
    {id: "Fav Fruit",  question: "What's your favorite fruit?"},
    {id: "Dream Vacation",  question: "What is your dream vacation destination?"},
    {id: "Fav Music Artist",  question: "What's your favorite music artist?"},
    {id: "Hairstyle",  question: "Do you like short or tall hairstyles?"},
    {id: "Fav Season",  question: "What is your favorite season of the year?"},
    {id: "Fav Movie Genre",  question: "What type of movies do you enjoy the most?"},
    {id: "Morning Person/ Night Owl",  question: "Morning person or night owl?"},
    {id: "Reason for Quiz", question: "Why are you taking this quiz?"},
    ];

  const mcq_questions = [
    {id: "Personality", question: "How would your friends describe you? ",multi: true ,  options: ["Energetic", "Adventurous", "Calm" , "Thoughtful" , "Creative" , "Reliable" , "Elegant" , "Optimistic" , "Independent" , "Sociable"]},
    {id: "Fav Weather", question: "What weather makes you happiest?", multi: false , options: ["Sunny", "Cloudy", "Rainy" , "Windy" , "Snowy"]},
    {id: "Mood", question: "Which of these best describes your mood most of the time?", multi: true , options: ["Bold", "Playful", "Serene", "Cheerful", "Romantic", "Optimistic", "Curious", "Relaxed"]},
    {id: "Fav View", question: "What's your favorite view of the following?",multi: false, options: ["Park", "Beach", "Forest" , "Mountains" , "City" , "Desert" , "Lake" , "Farm"]},
    {id: "Love Languages", question: "What is your love languages?", multi: true , options: ["Physical Touch", "Words of Affirmation", "Quality Time" , "Acts of Service" , "Gift Giving"]},
    ];

  const navigate = useNavigate();

  // So that when status changes the view scrolls down to show it automatically
  const statusRef = useRef(null);
  useEffect(() => {
    if (status === "Please answer all questions before submitting!!" && statusRef.current) {
      statusRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [status]);

  const handleSubmit = async () => {
    // Prevent submitting empty answers
    const x = written_questions.length + mcq_questions.length;
    if (Object.keys(answers).length < x) 
    {
      setStatus("Please provide more meaningful answers and answer all questions!!");
      setTimeout(() => {
        setStatus("");
      }, 3000);
      return;
    }
    else{
      for (const q of written_questions) {
      const answer = answers[q.id].trim().toLowerCase();
      console.log("Answer:", answer);
      if (answer.length < 3 || (!/[a-zA-Z]/.test(answer))) {
        setStatus("Please provide more meaningful answers and answer all questions!!");
        setTimeout(() => {
          setStatus("");
        }, 3000);
        return;
      }
    }
    }

    

    // Process the answers to determine the flower type
    setStatus("Predicting your flower type..."); 


    setTimeout(() => {
      setStatus("Consulting AI Model..."); 
    }, 2000);

    // Call Quiz API 
    try {
      const response = await fetch('/api/quiz-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers })
      });

      const data = await response.json();
      // console.log("Quiz API Response:", data.response);

      const flowerName = data.response.trim();
      

      setStatus("Redirecting...");
      navigate(`/info/${encodeURIComponent(flowerName)}`);



    } catch (error) {
      console.error("Error calling Quiz API:", error);
    }

    // setTimeout(() => {
    //   setStatus("Redirecting..."); 
    // }, 4000);

    // setTimeout(() => {
    //   navigate(`/info/${encodeURIComponent(flower) }`);
    // }, 5000);

  }

  return (
    <div className="quiz-page">
      <h1 className="header-info">Which flower are you?</h1>
      <div className="quiz-container">

        {/* If status is defined aka processing remove all quesitons and button */}
      {(!status || status == "Please provide more meaningful answers and answer all questions!!") && (
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