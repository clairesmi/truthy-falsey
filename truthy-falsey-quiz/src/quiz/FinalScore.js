import React from 'react'

const FinalScore = ({ displayScore, totalQuestions, score, handleInput, submitScore, styles}) => (
  <>
  {displayScore && totalQuestions !== 0 &&
    <div>
      <div style={styles.questionsHeader}>
         You scored: {score}
      </div>
      <div className="leaderboard"> 
    <form>
      <input style={styles.inputName} className="input" placeholder="Enter your name" name="name" onChange={handleInput}></input>
    <button style={styles.startButton} onClick={submitScore}>Submit</button>
    </form>
  </div>
    </div>
  }
  </>
)

export default FinalScore