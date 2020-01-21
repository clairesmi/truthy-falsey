import React from 'react'

const GameRunning = ({ running, currentQuestion, answerChosen, options, 
score, questionCounter, styles, handleAnswer }) => (
<>
{running &&
      <div className="game-wrapper" style={styles.gameWrapper}>
      <header className="App-header">
        <h1 style={styles.h1}>Truthy or Falsey?</h1>
      </header>
      <div className="questions-header" style={styles.questionsHeader}>
        <h2 style={styles.questionsHeader}>Question {questionCounter} </h2>
        <h2 style={styles.questionsHeader}>Points scored: {score}</h2>
      </div>
      <div className="questions" style={styles.questionStyle}>
        {currentQuestion}
      </div>
      <div className="options">
  {/* <h2 style={styles.questionsHeader}>Options:</h2> */}
  {currentQuestion &&
  <select style={styles.select} name="answerChosen" onChange={handleAnswer} value={answerChosen}>
    <option value="" disabled>Choose your answer</option>
      {options.map(option => 
         <option key={option} value={option}>{option}</option>
      )}
  </select>
  }
      </div>
      {/* <div className="answers">
        {randomQuestion ? randomQuestion.correct_answer: null} THIS IS THE CORRECT ANSWER
      </div> */}
      </div>
      }
</>
)

export default GameRunning