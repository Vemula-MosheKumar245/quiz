// import React, { useEffect, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useNavigate,
//   useLocation
// } from "react-router-dom";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { motion } from "framer-motion";
// import './App.css';

// // Validation schema
// const schema = yup.object().shape({
//   name: yup
//     .string()
//     .required("Name is required")
//     .matches(/^[A-Za-z ]+$/, "Name should contain only letters and spaces"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   categoryId: yup.number().required("Category is required"),
// });

// // Start Page Component
// function StartPage() {
//   const navigate = useNavigate();
//   const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     axios.get("http://127.0.0.1:8000/categories/")
//       .then(res => setCategories(res.data))
//       .catch(console.error);
//   }, []);

//   const onSubmit = (data) => {
//     navigate("/quiz", { state: data });
//   };

//   return (
//     <motion.div className="body-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
//       <div className="quiz-container">
//         <h1 className="quiz-title">🚀 Welcome to the Quiz</h1>

//         <form onSubmit={handleSubmit(onSubmit)} className="quiz-form">
//           <div className="input-group">
//             <label>Name:</label>
//             <input {...register("name")} placeholder="Your Name" />
//             <p className="error-text">{errors.name?.message}</p>
//           </div>

//           <div className="input-group">
//             <label>Email:</label>
//             <input {...register("email")} placeholder="example@mail.com" />
//             <p className="error-text">{errors.email?.message}</p>
//           </div>

//           <div className="input-group">
//             <label>Select Category:</label>
//             <select {...register("categoryId")}>
//               <option value="">-- Select Category --</option>
//               {categories.map(cat => (
//                 <option key={cat.id} value={cat.id}>{cat.category}</option>
//               ))}
//             </select>
//             <p className="error-text">{errors.categoryId?.message}</p>
//           </div>

//           <button className="submit-btn" type="submit">Start Quiz</button>
//         </form>
//       </div>
//     </motion.div>
//   );
// }

// // Quiz Page Component
// function QuizPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { name, email, categoryId } = location.state || {};
//   const [questions, setQuestions] = useState([]);
//   const { register, handleSubmit, setValue, formState: { errors } } = useForm();

//   useEffect(() => {
//     if (!categoryId) {
//       navigate("/");
//       return;
//     }

//     axios.get(`http://127.0.0.1:8000/questions/${categoryId}`)
//       .then(res => {
//         setQuestions(res.data);
//         res.data.forEach((q, i) => {
//           setValue(`answers.${i}.question_id`, q.id);
//         });
//       })
//       .catch(console.error);
//   }, [categoryId, navigate, setValue]);

//   const onSubmit = async (data) => {
//     const payload = {
//       name,
//       email,
//       answers: data.answers,
//     };

//     try {
//       const res = await axios.post("http://127.0.0.1:8000/submit/", payload);
//       navigate("/result", { state: res.data });
//     } catch (error) {
//       console.error("Submission failed", error);
//       alert("Something went wrong while submitting. Try again.");
//     }
//   };

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="quiz-page">
//       <div className="quiz-card">
//         <h2 className="quiz-title">📝 Answer the Questions</h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {questions.map((q, i) => (
//             <div key={q.id} className="question-box">
//               <p className="text-xl font-semibold text-purple-800 mb-3">{q.question}</p>
//               <input
//                 type="text"
//                 {...register(`answers.${i}.submitted_answer`, { required: "Answer is required" })}
//                 placeholder="Your answer..."
//               />
//               <input type="hidden" {...register(`answers.${i}.question_id`)} value={q.id} />
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.answers?.[i]?.submitted_answer?.message}
//               </p>
//             </div>
//           ))}

//           <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="submit-button">
//             Submit Answers
//           </motion.button>
//         </form>
//       </div>
//     </motion.div>
//   );
// }

// // Result Page Component
// function ResultPage() {
//   const location = useLocation();
//   const result = location.state;

//   if (!result) {
//     return <div className="text-center p-10 text-red-600">No result data found.</div>;
//   }

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="result-page">
//       <div className="result-card">
//         <h3 className="result-title">🎉 Your Result</h3>
//         <ul className="result-list">
//           <li><strong>Name:</strong> {result.name}</li>
//           <li><strong>Email:</strong> {result.email}</li>
//           <li><strong>Total Questions:</strong> {result.total_questions}</li>
//           <li><strong>Correct Answers:</strong> {result.correct_answers}</li>
//           <li><strong>Score:</strong> {result.score}%</li>
//         </ul>
//       </div>
//     </motion.div>
//   );
// }

// // Main App Router
// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<StartPage />} />
//         <Route path="/quiz" element={<QuizPage />} />
//         <Route path="/result" element={<ResultPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// Updated React QuizPage component with dynamic validation based on backend `type` and `max_limit`

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from "react-router-dom";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import './App.css';

// Validation schema for StartPage
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[A-Za-z ]+$/, "Name should contain only letters and spaces"),
  email: yup.string().email("Invalid email").required("Email is required"),
 categoryId: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .required("Select the appropriate subject please"),
});

function StartPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/categories/")
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  const onSubmit = (data) => {
    navigate("/quiz", { state: data });
  };

  return (
    <motion.div className="body-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <div className="quiz-container">
        <h1 className="quiz-title">🚀 Welcome to the Quiz</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="quiz-form">
          <div className="input-group">
            <label>Name:</label>
            <input {...register("name")} placeholder="Your Name" />
            <p className="error-text">{errors.name?.message}</p>
          </div>
          <div className="input-group">
            <label>Email:</label>
            <input {...register("email")} placeholder="example@mail.com" />
            <p className="error-text">{errors.email?.message}</p>
          </div>
          <div className="input-group">
            <label>Select Category:</label>
            <select {...register("categoryId")}> 
              <option value="">-- Select Category --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.category}</option>
              ))}
            </select>
            <p className="error-text">{errors.categoryId?.message}</p>
          </div>
          <button className="submit-btn" type="submit">Start Quiz</button>
        </form>
      </div>
    </motion.div>
  );
}

function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email, categoryId } = location.state || {};
  const [questions, setQuestions] = useState([]);

  const { register, handleSubmit, setValue, formState: { errors }, control } = useForm();
  const { fields } = useFieldArray({ control, name: "answers" });

  useEffect(() => {
    if (!categoryId) {
      navigate("/");
      return;
    }

    axios.get(`http://127.0.0.1:8000/questions/${categoryId}`)
      .then(res => {
        setQuestions(res.data);
        res.data.forEach((q, i) => {
          setValue(`answers.${i}.question_id`, q.id);
        });
      })
      .catch(console.error);
  }, [categoryId, navigate, setValue]);

  const validateAnswer = (value, q) => {
    if (!value || value.trim() === "") return true;

    if (q.type === "integer" && !/^-?\d+$/.test(value)) {
      return "Answer must be a number";
    }

    if (q.type === "text" && /\d/.test(value)) {
      return "Answer must be text (no numbers)";
    }

    if (q.type === "boolean" && !/^(true|false)$/i.test(value.trim())) {
      return "Answer must be either 'true' or 'false'";
    }

    if (q.max_limit && value.length > q.max_limit) {
      return `Answer should not exceed ${q.max_limit} characters`;
    }

    return true;
  };

  const onSubmit = async (data) => {
    const payload = { name, email, answers: data.answers };

    try {
      const res = await axios.post("http://127.0.0.1:8000/submit/", payload);
      navigate("/result", { state: res.data });
    } catch (error) {
      console.error("Submission failed", error);
      alert("Something went wrong while submitting. Try again.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="quiz-page">
      <div className="quiz-card">
        <h2 className="quiz-title">📝 Answer the Questions</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {questions.map((q, i) => (
            <div key={q.id} className="question-box">
              <p className="text-xl font-semibold text-purple-800 mb-3">{q.question}</p>

              {q.type === "boolean" ? (
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      value="true"
                      {...register(`answers.${i}.submitted_answer`, {
                        validate: value => validateAnswer(value, q)
                      })}
                    />{" "}
                    True
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="false"
                      {...register(`answers.${i}.submitted_answer`, {
                        validate: value => validateAnswer(value, q)
                      })}
                    />{" "}
                    False
                  </label>
                  <label>
                    <input
                      type="radio"
                      value=""
                      {...register(`answers.${i}.submitted_answer`, {
                        validate: value => validateAnswer(value, q)
                      })}
                    />{" "}
                    Skip
                  </label>
                </div>
              ) : (
                <input
                  type="text"
                  {...register(`answers.${i}.submitted_answer`, {
                    validate: value => validateAnswer(value, q)
                  })}
                  placeholder={`Answer (${q.type}${q.max_limit ? ", max " + q.max_limit + " chars" : ""})`}
                  className="border rounded p-2 w-full"
                />
              )}

              <input type="hidden" {...register(`answers.${i}.question_id`)} value={q.id} />

              <p className="text-red-500 text-sm mt-1">
                {errors.answers?.[i]?.submitted_answer?.message}
              </p>
            </div>
          ))}

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="submit-button">
            Submit Answers
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
function ResultPage() {
  const location = useLocation();
  const result = location.state;

  if (!result) {
    return <div className="text-center p-10 text-red-600">No result data found.</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="result-page">
      <div className="result-card">
        <h3 className="result-title">🎉 Your Result</h3>
        <ul className="result-list">
          <li><strong>Name:</strong> {result.name}</li>
          <li><strong>Email:</strong> {result.email}</li>
          <li><strong>Total Questions:</strong> {result.total_questions}</li>
          <li><strong>Correct Answers:</strong> {result.correct_answers}</li>
          <li><strong>Score:</strong> {result.score}</li>
        </ul>
      </div>
    </motion.div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
