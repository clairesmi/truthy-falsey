import React from 'react'

const FinalScore = ({ displayScore, totalQuestions, score, startAgain, handleInput, submitScore}) => (
  <>
  {displayScore && totalQuestions !== 0 &&
    <div>
      <p>
         You scored: {score}
      </p>
      {/* this will be a modal  */}
      <button type="button" onClick={startAgain} name="startAgain">Start Again</button>
      <div className="leaderboard"> 
    <form>
      <input className="input" placeholder="Enter your name" name="name" onChange={handleInput}></input>
    <button onClick={submitScore}>Submit</button>
    </form>
  </div>
    </div>
  }
  </>
)

export default FinalScore