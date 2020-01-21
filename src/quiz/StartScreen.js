import React from 'react'
import Select from 'react-select'

const StartScreen = ({ styles, running, levelChosen, categories, 
  scoreData, handleChange, handleMultiSelect, startGame }) => (
      <>
        <div className="start-screen" style={styles.startScreen}>
          <h1 style={styles.h1}>Truthy or Falsey?</h1>
        </div>
        <div className="start-screen-wrapper"style={styles.startScreenWrapper}>
        <div className="score-board" style={styles.scoreBoard}>
            <h3>Top 5 Scores</h3>
          {scoreData ? scoreData.map(item => <div className="name-score"key={item.name}> {item.name} {item.score}</div>) : null}
            </div>
        <div className="player-options" style={styles.playerOptions}>
        <div className="choose-level">
        <select style={styles.select} name="levelChosen" value={levelChosen} onChange={handleChange} disabled={levelChosen}>
          <option value="" disabled>Choose your level</option> 
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        </div>
        <div style={styles.multiSelect} className="choose-categories">
          <Select 
          isMulti
          isDisabled={!levelChosen}
          options={categories}
          onChange={handleMultiSelect}
          placeholder={"Any Category"}
          />
        </div>
        <div className="start-game">
        <button style={styles.startButton} type="button" onClick={startGame} name="startGame" disabled={!levelChosen}>Start Game</button>
        </div>
        </div>
        </div>
  </>
)

export default StartScreen