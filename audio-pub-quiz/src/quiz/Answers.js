import React from 'react'

const Answers = ({ questions, randomQuestion, randomOptions, handleClick }) => (
<div>
  Options:
  <div>
{randomOptions.map(randomOption => 
  <button type="button" key={randomOption} name="answerChosen" value={randomOption} onClick={handleClick}>
    {randomOption.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&eacute;/g, 'é').replace(/&amp;/g, '&')}
    </button>
  )}
</div>
{}
</div>
)

export default Answers