// STYLING

// Modals - 
// WHEN NOT ENOUGHT Qs 
// WHEN ENTERING NAME IN SCORE BOARD

// CREATE LOADING SPINNER

import React, { Component } from 'react';
// import './App.css';
import axios from 'axios'
import Select from 'react-select'


class App extends Component {


state = {
  questions: '',
  levelChosen: '',
  categoriesChosen: null,
  levelCheck: [],
  notEnoughQuestions: false,
  notEnoughInCategory: false,
  score: 0,
  answerChosen: '',
  questionCounter: 0,
  running: true,
  randomQuestions: '',
  randomQuestion: '',
  currentQuestion: '',
  options: '',
  nextQuestion: false,
  totalQuestions: 0,
  displayScore: false,
  name: ''
}

  categories = [
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
    {value: "Art", label: "Art"},
    {value: "Entertainment: Video Games", label: "Entertainment: Video Games"},
    {value: "Entertainment: Film", label: "Entertainment: Film"},
    {value: "Entertainment: Books", label: "Entertainment: Books"},
    {value: "Entertainment: Film", label: "Entertainment: Film"},
    {value: "Entertainment: Music", label: "Entertainment: Music"},
    {value: "Entertainment: Television", label: "Entertainment: Television"},
    {value: "Entertainment: Cartoon & Animations", label: "Entertainment: Cartoon & Animations"},
    {value: "Entertainment: Japanese Anime & Manga", label: "Entertainment: Japanese Anime & Manga"}
  ]

  scoreArray = localStorage.getItem('scores') ? JSON.parse(localStorage.getItem('scores')) : []
  scoreData = localStorage.getItem('scores') ? JSON.parse(localStorage.getItem('scores')) : []

componentDidMount = () => {
  this.nextQuestion()
  
}

startGame = () => {
  console.log(this.state.running)
  this.setState({ questionCounter: 0, score: 0, totalQuestions: 2, running: !this.state.running,
    notEnoughInCategory: false, notEnoughQuestions: false, displayScore: false })
  
  if (!this.state.categoriesChosen && this.state.questions) {
    this.handleAnyCategory()
  // console.log(this.state.displayScore)

  }
} 

// HANDLE CLICK FOR SELECTING LEVELS AND ANSWERS
handleChange = (e) => {
  e.preventDefault()
  this.setState({ [e.target.name]: e.target.value }, () => {
   const checkingLevel = this.state.questions.filter(question => {
   return question.difficulty.includes(this.state.levelChosen)
  })
    const levelCheck = { ...this.state.levelCheck, checkingLevel}
    this.setState({ levelCheck }, () => {
      console.log(this.state.levelCheck.checkingLevel.length)
      if (this.state.levelCheck.checkingLevel.length < 10) {
        console.log('less')
        this.setState({ notEnoughQuestions: !this.state.notEnoughQuestions })
        console.log(this.state.notEnoughQuestions)
      }
    })
 })
}

chooseAnotherLevel = (e) => {
  e.preventDefault()
  this.setState({ notEnoughQuestions: !this.state.notEnoughQuestions, notEnoughInCategory: false}) 
}

chooseMoreCategories = (e) => {
  e.preventDefault()
  this.setState({ notEnoughInCategory: !this.state.notEnoughInCategory, notEnoughQuestions: false})
}

handleMultiSelect = (selected) => {
  if (selected) {
const selectedCategories = selected.map(item => item.value)
const categoriesChosen = {...this.state.categoriesChosen, selectedCategories}
this.setState({ categoriesChosen }, () => {
  this.setQuestions()
    })
  }
}

// if chosen categories - setQuestions else 
handleAnyCategory = () => {
    const randomQuestions = this.state.questions.filter(question => {
        return question.difficulty === this.state.levelChosen
      })
    this.setState({ randomQuestions })
    console.log(randomQuestions.length)
    if (randomQuestions.length < 10) {
      this.setState({ notEnoughInCategory: !this.state.notEnoughInCategory})
    }
    console.log(this.state.levelCheck)

  const randomQuestion = randomQuestions[Math.floor(Math.random() * randomQuestions.length)]
  const currentQuestion = randomQuestion ? randomQuestion.question
  .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&eacute;/g, 'é').replace(/&amp;/g, '&') : null

  const options = randomQuestion ? randomQuestion.incorrect_answers.concat(randomQuestion.correct_answer).sort((a, b) => b - a) : null
  this.setState({ randomQuestion, currentQuestion, options })

}


// Setting questions once the level and category have been chosen 
setQuestions = () => {
  console.log(this.state.questions)
  console.log(this.state.levelChosen)
  const randomQuestions = this.state.questions.filter(question => 
      question.difficulty === this.state.levelChosen && 
      (this.state.categoriesChosen.selectedCategories.includes(question.category))
    )
    console.log(randomQuestions.length)
    if (randomQuestions || randomQuestions.length < 10) {
      this.setState({ notEnoughInCategory: true})
    }
    console.log(this.state.levelCheck)

  const randomQuestion = randomQuestions[Math.floor(Math.random() * randomQuestions.length)]

  const currentQuestion = randomQuestion ? randomQuestion.question
  .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&eacute;/g, 'é').replace(/&amp;/g, '&') : null

  const options = randomQuestion ? randomQuestion.incorrect_answers.concat(randomQuestion.correct_answer).sort((a, b) => b - a) : null
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
  this.state.questionCounter === this.state.totalQuestions ? this.endOfGame() :
  this.setState({questionCounter: this.state.questionCounter += 1})
}

handleAnswer = (e) => {
  e.preventDefault()
  this.setState({ [e.target.name]: e.target.value }, () => {
    console.log(this.state.answerChosen)
    this.answerCheck()
  })
}

answerCheck = () => {
  console.log(this.state.randomQuestion.correct_answer === this.state.answerChosen, 'CHECKING')
  this.state.randomQuestion.correct_answer === this.state.answerChosen ? this.setState({score: this.state.score + 1})
  : this.setState({ score: this.state.score })
  this.nextQuestion()
  this.setState({answerChosen: ''})
  }

endOfGame = () => {
  this.setState({ running: !this.state.running, displayScore: true })
  console.log(this.state.running, 'end of game')
}

handleInput = (e) => {
  this.setState({ [e.target.name]: e.target.value })
  console.log(this.state.name, this.state.score)
}

submitScore = (e) => {
this.scoreArray = [...this.scoreArray, {'name': this.state.name, 'score': this.state.score}]
.sort((a, b) => b.score - a.score).slice(0, 5)
console.log(this.scoreArray)
localStorage.setItem('scores', JSON.stringify(this.scoreArray))
this.setState({ [e.target.name]: ''})
const input = document.querySelector('.input')
input.value = ''
}

startAgain = () => {
  this.setState({ displayScore: false, levelChosen: '' })
}

render () {
  const questions = this.state.questions
  const { levelChosen, notEnoughQuestions, notEnoughInCategory, randomQuestion, 
    currentQuestion, options, score, questionCounter, answerChosen, 
    running, displayScore, totalQuestions } = this.state
  if (!questions) return null
  // console.log(this.scoreArray)

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
        {randomQuestion ? randomQuestion.correct_answer: null} THIS IS THE CORRECT ANSWER
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
        <div className="score-board">
            <h3>Latest Scores</h3>
          {this.scoreData ? this.scoreData.map(item => 
          <div key={item.name}>
            {item.name} {item.score}
            </div>
            ) : null}
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
          isDisabled={!this.state.levelChosen}
          options={this.categories}
          onChange={this.handleMultiSelect}
          placeholder={"Any Category"}
          />
        </div>
        {/* move leaderboard div to end score */}

        <div className="start-game">
        <button type="button" onClick={this.startGame} name="startGame" disabled={!this.state.levelChosen}>Start Game</button>
        </div>
        </>
      }
    </div>
    {notEnoughQuestions &&
      <div>
        <p>
          Oops, we don't have enough questions, please choose a different level! 
        </p>
        <button type="button" onClick={this.chooseAnotherLevel} name="chooseAnotherLevel">OK</button>
      </div>
    }
     {notEnoughInCategory &&
      <div>
        <p>
          Oops, we don't have enough questions in that category, please select another! 
        </p>
        <button type="button" onClick={this.chooseMoreCategories} name="chooseAnotherLevel">OK</button>
      </div>
    }
         {displayScore && totalQuestions !== 0 &&
          <div>
            <p>
               You scored: {score}
            </p>
            {/* this will be a modal  */}
            <button type="button" onClick={this.startAgain} name="startAgain">Start Again</button>
            <div className="leaderboard"> 
          <form>
            <input className="input" placeholder="Enter your name" name="name" onChange={this.handleInput}></input>
          <button onClick={this.submitScore}>Submit</button>
          </form>
        </div>
          </div>
        }
        </>
    )
  }
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