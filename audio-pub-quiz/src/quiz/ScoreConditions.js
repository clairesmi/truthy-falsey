import React, { Component } from 'react'

class ScoreConditions extends Component {
    state = {
      correctAnswer: false,
      counter: 0,
      currentAnswer: '',
      currentQuestion: '',
      currentOptions: '',
      score: ''
    }

componentDidMount = () => {
  this.setState({ counter: 0 })
}    

// uses prev props to check answer against question as the page re-renders when the answer is clicked - in click version
// on gitHub
componentDidUpdate = (prevProps) => {
  if (prevProps.randomQuestion !== this.props.randomQuestion) {
  this.setState({currentQuestion: prevProps.randomQuestion, 
    currentOptions: prevProps.randomOptions, 
    currentAnswer: prevProps.randomQuestion.correct_answer.toLowerCase()})
    this.updateScore()
  }
}

updateScore = () => {
  console.log(this.props.answerSpoken)
  console.log(this.state.currentAnswer)
  if (this.props.answerSpoken && 
  this.props.answerSpoken.toLowerCase().trim() === this.state.currentAnswer.trim()) {
    this.setState(({ score }) => ({ score: score + 1}))
    }
}

//Checks for the spoken answer so it can be checked against the correct answer
// speechCheck = () => {
//   // const finalAnswer = this.props.answerSpoken
//   console.log(this.state.currentAnswer)
//   if (this.state.currentAnswer.length > 1) {
//   this.setState({currentAnswer: this.props.randomQuestion.correct_answer.toLowerCase()})
//   }
//   // console.log(finalAnswer)
// }

render () {
  const { counter, currentQuestion, currentOptions, currentAnswer, score } = this.state 
  const { questionCounter, answerChosen, answerSpoken, randomQuestion} = this.props 
  console.log(currentQuestion)
  return (
    <>
    <div>
    <p>
  Question number: {questionCounter}
  </p>
<p>{randomQuestion.correct_answer
.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&eacute;/g, 'é').replace(/&amp;/g, '&')} - CORRECT ANSWER</p>

{/* <p>{answerChosen.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&eacute;/g, 'é').replace(/&amp;/g, '&')} -CHOSEN ANSWER</p> */}
  
  <p>
  {/* {counter} / 5 */}
  </p>
  <div>
  <p>
     current answer is: {currentAnswer}
  </p>
  <p>
  my answer is: {answerSpoken.toLowerCase()} 
  </p>
  <p>
  {/* did answers match?  */}
  SCORE: {score}
  {/* {answerSpoken.toLowerCase().trim() === this.state.currentAnswer.trim() ? 'true' : 'false'}  */}
  </p>
</div>
<p>{currentQuestion.question ? 
currentQuestion.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&eacute;/g, 'é').replace(/&amp;/g, '&') : null}</p>
<p>{currentOptions}</p>
</div>
    </>
    )
  }
}

export default ScoreConditions
