import React, { Component } from 'react'
// 

class ScoreConditions extends Component {
    state = {
      correctAnswer: false,
      counter: 0,
    }

componentDidMount = () => {
  this.setState({ counter: 0 })
  // console.log(this.state)
}    

// uses prev props to check answer against question as the page re-renders when the answer is clicked 
componentDidUpdate = (prevProps) => {
let answer = this.props.answerChosen
if (prevProps.randomQuestion.correct_answer === answer) {
  this.answerCheck()
  } 
}

// checks for correct answers and adds to the score counter
answerCheck = () => {
  this.setState(({ counter }) => ({ counter: counter + 1}))
  if (this.props.questionCounter > 5) {
    this.endOfGame()
  }
}

endOfGame = () => {
  console.log('END')
}

render () {
  const { counter } = this.state 
  const { questionCounter } = this.props 
  console.log(this.props)
  return (
    <>
  <h2>hello
  </h2>

<p>{this.props.randomQuestion.correct_answer
.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&eacute;/g, 'é').replace(/&amp;/g, '&')} - CORRECT ANSWER</p>

<p>{this.props.answerChosen.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&eacute;/g, 'é').replace(/&amp;/g, '&')} -CHOSEN ANSWER</p>
  
  <p>
  {counter} / 5
  </p>

  <p>
  Question number: {questionCounter}
  </p>

  </>
  )
}
}

export default ScoreConditions
