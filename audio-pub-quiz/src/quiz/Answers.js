import React from 'react'

const Answers = ({ questions, randomQuestion, randomOptions, handleClick }) => (
<div>
  Options:
  <div>
{randomOptions.map(randomOption => 
  <button key={randomOption} name="answerChosen" value={randomOption} onClick={handleClick}>
    {randomOption}</button>
  )}
</div>
{}
</div>
)

export default Answers