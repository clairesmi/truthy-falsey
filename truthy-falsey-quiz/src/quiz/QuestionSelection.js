import React from 'react'

const QuestionSelection = ({notEnoughQuestions, notEnoughInCategory, chooseAnotherLevel, chooseMoreCategories, styles}) => (
  <>
{notEnoughQuestions && 
<div>
        <p>
          Oops, we don't have enough questions, please choose a different level! 
        </p>
        <button type="button" onClick={chooseAnotherLevel} name="chooseAnotherLevel">OK</button>
      </div>
    }
     {notEnoughInCategory &&
      <div>
        <p>
          Oops, we don't have enough questions in that category, please select another! 
        </p>
        <button type="button" onClick={chooseMoreCategories} name="chooseAnotherLevel">OK</button>
      </div>
      }
      </>
)

export default QuestionSelection