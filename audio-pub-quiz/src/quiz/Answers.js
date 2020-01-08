import React from 'react'
import Speech from 'react-speech'
// put Handle Listen props in here so that the answer can be listened for as well as clicked

const Answers = ({ questions, randomQuestion, randomOptions, handleClick, handleListen, listening }) => (
  <div>
  {!listening &&
  <div>
  Options:
{randomOptions.map(randomOption => 
    <Speech type="button" 
    key={randomOption} 
    name="answerChosen" 
    value={randomOption} 
    onClick={handleClick}
    text={randomOption.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&eacute;/g, 'é').replace(/&amp;/g, '&')}
    textAsButton={true}
    // displayText={'text'}
    />
  )}
</div>
  }
</div>
)

export default Answers