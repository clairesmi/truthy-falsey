import React, { Component } from 'react'
import Speech from 'react-speech'

const Questions = ({ randomQuestion, styles }) => (
  <div className="question">
  <>
{randomQuestion.type === 'boolean' &&
<div id="container" style={styles.container}>
<h3>True or False</h3>
<Speech 
text="True or False"
voice="Google UK English Female"
textAsButton={true}
resume={true} 
style={styles}
/>
<Speech 
text={randomQuestion.question}
voice="Google UK English Female"
textAsButton={true}
resume={true} 
style={styles}
/>
</div>}
{randomQuestion.type === 'multiple' &&
  <div id="container" style={styles.container}>
  <h3>Multiple Choice</h3>
  <Speech 
  text="Multiple Choice"
  voice="Google UK English Female"
  textAsButton={true}
  resume={true} 
  style={styles}
  />
  <Speech 
  text={randomQuestion.question}
  voice="Google UK English Female"
  textAsButton={true}
  resume={true} 
  style={styles}
  />
  </div>
}
</>
</div>
)

export default Questions