// Create category selectors (2 filters &&) (Use multi-select from React Select)
// STYLING
// Use local storage to save name and score WITH LEADERBOARD AND FORM FOR NAME (maybe at end)

// Must choose level before selecting categories 

// CREATE LOADING SPINNER

import React, { Component } from 'react';
// import './App.css';
import axios from 'axios'
import Select from 'react-select'
// import Questions from './quiz/Questions'
import Answers from './quiz/Answers'
// import ScoreConditions from './quiz/ScoreConditions';


class App extends Component {

state = {
  questions: '',
  levelChosen: '',
  categoriesChosen: [],
  score: 0,
  answerChosen: '',
  questionCounter: 0,
  running: false,
  randomQuestions: '',
  randomQuestion: '',
  currentQuestion: '',
  options: '',
  nextQuestion: false,
  totalQuestions: 0

}
  categories = [
    {value: "Any Category", label: "Any Category"},
    {value: "Entertainment: Video Games", label: "Entertainment: Video Games"},
    {value: "Entertainment: Film", label: "Entertainment: Film"},
    {value: "Entertainment: Books", label: "Entertainment: Books"},
    {value: "Entertainment: Film", label: "Entertainment: Film"},
    {value: "Entertainment: Music", label: "Entertainment: Music"},
    {value: "Entertainment: Television", label: "Entertainment: Television"},
    {value: "Entertainment: Cartoon & Animations", label: "Entertainment: Cartoon & Animations"},
    {value: "Entertainment: Musicals & Theatres", label: "Entertainment: Musicals & Theatres"},
    {value: "Entertainment: Japanese Anime & Manga", label: "Entertainment: Japanese Anime & Manga"},
    {value: "Science & Nature", label: "Science & Nature"},
    {value: "Science: Mathematics", label: "Science: Mathematics"},
    {value: "Science: Computers", label: "Science: Computers"},
    {value: "Animals", label: "Animals"},
    {value: "Geography", label: "Geography"},
    {value: "General Knowledge", label: "General Knowledge"},
    {value: "Sports", label: "Sports"},
    {value: "Vehicles", label: "Vehicles"},
    {value: "Mythology", label: "Mythology"},
    {value: "Politics", label: "Politics"},
    {value: "History", label: "History"},
    {value: "Celebrities", label: "Celebrities"},
    {value: "Art", label: "Art"}
  ]

componentDidMount = () => {
  this.nextQuestion()
}

startGame = () => {
  this.setState({ running: true })
  this.setState({ questionCounter: 0})
  this.setState({ score: 0})
  console.log(this.state.randomQuestions)
} 

// HANDLE CLICK FOR SELECTING LEVELS AND ANSWERS
handleChange = (e) => {
  e.preventDefault()
 this.setState({ [e.target.name]: e.target.value }, () => {
 })
}

handleMultiSelect = (selected) => {
const selectedCategories = selected.map(item => item.value)
const categoriesChosen = {...this.state.categoriesChosen, selectedCategories}
this.setState({ categoriesChosen }, () => {
  this.setQuestions()
  })
}

// Setting questions once the level and category have been chosen 
setQuestions = () => {
  console.log(this.state.levelChosen)
  const randomQuestions = this.state.questions.filter(question => {
    return question.difficulty === this.state.levelChosen && 
    this.state.categoriesChosen.selectedCategories.includes(question.category)
  })
  console.log(randomQuestions)

    const randomQuestion = randomQuestions[Math.floor(Math.random() * randomQuestions.length)]

  const currentQuestion = randomQuestion.question
  .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&eacute;/g, 'é').replace(/&amp;/g, '&')

  const options = randomQuestion.incorrect_answers.concat(randomQuestion.correct_answer).sort((a, b) => b - a)
  this.setState({ randomQuestions, randomQuestion, currentQuestion, options })
}

nextQuestion = async () => {
  try {
  let res = await axios.get('https://opentdb.com/api.php?amount=50&type=boolean')
  this.setState({ questions: res.data.results })
  this.setState({ running: true })
  }
  catch (e) {
    console.error(e)
  }
  // await this.answerCheck()
  this.state.questionCounter === this.state.totalQuestions ? this.endOfGame() :
  this.setState({questionCounter: this.state.questionCounter += 1})
}

handleAnswer = (e) => {
  e.preventDefault()
  this.setState({ [e.target.name]: e.target.value }, () => {
    console.log(this.state.answerChosen)
    this.answerCheck()
  })
  // this.setState(({questionCounter}) => ({questionCounter: questionCounter + 1}))
}

answerCheck = () => { // need to fix this to call
  console.log(this.state.randomQuestion.correct_answer === this.state.answerChosen, 'CHECKING')
  this.state.randomQuestion.correct_answer === this.state.answerChosen ? this.setState({score: this.state.score += 1})
  : this.setState({ score: this.state.score })
  this.nextQuestion()
  this.setState({answerChosen: ''})
  }

endOfGame = () => {
  this.setState({ running: !this.state.running })
  console.log(this.state.running, 'end of game')
}

render () {
  const questions = this.state.questions
  const { levelChosen, randomQuestions, randomQuestion, currentQuestion, options, score, 
    questionCounter, answerChosen, running } = this.state
  // console.log(randomQuestion.difficulty)
  // console.log(this.categories)
    
  console.log(questions)
  
  if (!this.state.questions) return null
  return (
      <>
    <div className="App-wrap">
      {running &&
      <>
      <header className="App-header" style={container}>
        <h1>Truthy or Falsey?</h1>
      </header>
      <div className="question-header">
        <h2>Questions</h2>
      </div>
      {/* <div className="next-button">
        <button type="button" onClick={this.nextQuestion} name="levelChosen">Next Question</button>
      </div> */}
      <div className="questions">
        {currentQuestion} THIS IS THE RANDOM QUESTION
      </div>
      <div className="options">
  <h2>Options:</h2>
  {currentQuestion &&
  <select name="answerChosen" onChange={this.handleAnswer} value={answerChosen}>
    <option value="" disabled>Choose your answer</option>
      {options.map(option => 
         <option key={option} value={option}>{option}</option>
      )}
  </select>
  }
      </div>
      <div className="answers">
        {randomQuestion.correct_answer} THIS IS THE CORRECT ANSWER
      </div>
      <div className="score">
        {score} YOUR SCORE
      </div>
      <div className="question-counter">
        {questionCounter} THIS IS THE QUESTION COUNTER
      </div>
      </>
      }
      {!running &&
      <>
        <div className="start-screen">
          Truthy or Falsey
        </div>
        <div className="your-score">
        </div>
        <div className="choose-level">
        <select name="levelChosen" value={levelChosen} onChange={this.handleChange}>
          <option value="" disabled>Choose your level</option> 
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        </div>
        <div className="choose-categories">
          <Select 
          isMulti
          options={this.categories}
          onChange={this.handleMultiSelect}
          />
        </div>
        <div className="leaderboard">
        </div>
        <div className="start-game">
        <button type="button" onClick={this.startGame} name="startGame">Start Game</button>
        </div>
        </>
      }
    </div>
    </>
    // <div className="App-wrap">
//       <header className="App-header" style={container}>
//       <h1>Truthy or Falsey?</h1>
//       </header>
//       <div className="difficulty" style={container}>
//         <h2>Choose Difficulty</h2>
//         {/* <button type="button" onClick={this.handleClick} name="levelChosen" value="easy">Easy</button>
//         <button type="button" onClick={this.handleClick} name="levelChosen" value="medium">Medium</button>
//         <button type="button" onClick={this.handleClick} name="levelChosen" value="hard">Hard</button>
//         <button type="button" onClick={this.handleClick} name="levelChosen" value="Any">Any</button> */}
//         <button type="button" onClick={this.nextQuestion} name="levelChosen">Next Question</button>
//       </div>  
//       {questions &&
//       <div className="questions_wrapper" style={questions_wrapper}>
//       <div>correct{randomQuestion.correct_answer} chosen{answerChosen}</div>
//         <div className="question_options" style={question_options}>
//       <div className="questions" style={inner_elements}>
//       <Questions 
//       randomQuestion={randomQuestion}
//       // styles={styles}
//       />
//       </div>
//       <div className="answers" style={inner_elements}>
//       </div>
//     </div>
//     <div className="score_speech_rec" style={score_speech_rec}>
//       <div className="score-conditions" style={inner_elements}>
//       <ScoreConditions
//       randomQuestion={randomQuestion}
//       counter={counter}
//       // styles={styles}
//       questions={questions}
//       randomOptions={randomOptions}
//       handleClick={this.handleAnswerClick}
//       answerChosen={answerChosen}
//       questionCounter={questionCounter}
//       endOfGame={this.endOfGame}
//       />
//       </div>
//     </div>
//   </div>
//   }
// </div>
    )
  }
// write if statements for type of question - boolean or multiple choice 
}
export default App

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    border: 'solid black 2px',
    width: '100vw'
  },
  questions_wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100 vw',
    border: 'solid, black, 2px',
  },
  question_options: {
    display: 'flexWrap',
    flexBasis: '50%',
    border: 'solid, black, 2px',
    background: 'pink'
  },
  score_speech_rec: {
    display: 'flexWrap',
    flexBasis: '50%',
    border: 'solid, black, 2px',
    background: 'azure'
  },
  inner_elements: {
    display: 'flexWrap',
    flexDirection: 'column',
    border: 'solid, black, 2px',
  },
  button: {
    width: '60px',
    height: '60px',
    background: 'lightblue',
    borderRadius: '50%',
    margin: '6em 0 2em 0'
  },
  interim: {
    color: 'gray',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '300px'
  },
  final: {
    color: 'black',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '300px'
  }
}
const { container, button, interim, final, questions_wrapper, inner_elements, question_options, score_speech_rec } = styles

