import React from 'react'

const GameRunning = ({ running, currentQuestion, answerChosen, options, 
randomQuestion, score, questionCounter, styles, handleAnswer }) => (
<>
{running &&
      <>
      <header className="App-header" style={styles.container}>
        <h1>Truthy or Falsey?</h1>
      </header>
      <div className="question-header">
        <h2>Questions</h2>
      </div>
      <div className="questions">
        {currentQuestion} THIS IS THE RANDOM QUESTION
      </div>
      <div className="options">
  <h2>Options:</h2>
  {currentQuestion &&
  <select name="answerChosen" onChange={handleAnswer} value={answerChosen}>
    <option value="" disabled>Choose your answer</option>
      {options.map(option => 
         <option key={option} value={option}>{option}</option>
      )}
  </select>
  }
      </div>
      <div className="answers">
        {randomQuestion ? randomQuestion.correct_answer: null} THIS IS THE CORRECT ANSWER
      </div>
      <div className="score">
        {score} YOUR SCORE
      </div>
      <div className="question-counter">
        {questionCounter} THIS IS THE QUESTION COUNTER
      </div>
      </>
      }
</>
)

export default GameRunning