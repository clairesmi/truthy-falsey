import React from 'react'
import Select from 'react-select'

const StartScreen = ({styles, running, levelChosen, categories, 
  scoreData, handleChange, handleMultiSelect, startGame }) => (
  <>
  {!running &&
      <>
        <div className="start-screen" style={styles.startScreen}>
          <h1>Truthy or Falsey</h1>
        </div>
        <div className="score-board">
            <h3>Top 5 Scores</h3>
          {scoreData ? scoreData.map(item => <div className="name-score"key={item.name}> {item.name} {item.score}</div>) : null}
            </div>
        <div className="choose-level">
        <select name="levelChosen" value={levelChosen} onChange={handleChange} disabled={levelChosen}>
          <option value="" disabled>Choose your level</option> 
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        </div>
        <div className="choose-categories">
          <Select 
          isMulti
          isDisabled={!levelChosen}
          options={categories}
          onChange={handleMultiSelect}
          placeholder={"Any Category"}
          />
        </div>
        <div className="start-game">
        <button type="button" onClick={startGame} name="startGame" disabled={!levelChosen}>Start Game</button>
        </div>
        </>
      }
  </>
)

export default StartScreen