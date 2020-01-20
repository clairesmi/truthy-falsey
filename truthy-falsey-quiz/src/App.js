// STYLING

// Modals - 
// WHEN NOT ENOUGHT Qs 
// WHEN ENTERING NAME IN SCORE BOARD

// CREATE LOADING SPINNER

import React, { Component } from 'react'
// import './App.css';
import axios from 'axios'
// import Select from 'react-select'
import GameRunning from './quiz/GameRunning'
import StartScreen from './quiz/StartScreen'
import QuestionSelection from './quiz/QuestionSelection'
import FinalScore from './quiz/FinalScore'


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
  // console.log(this.state.running)
  this.setState({ questionCounter: 0, score: 0, totalQuestions: 5, running: !this.state.running,
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
      // console.log(this.state.levelCheck.checkingLevel.length)
      if (this.state.levelCheck.checkingLevel.length < 10) {
        // console.log('less')
        this.setState({ notEnoughQuestions: !this.state.notEnoughQuestions })
        // console.log(this.state.notEnoughQuestions)
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
  // console.log(this.state.questions)
  // console.log(this.state.levelChosen)
  const randomQuestions = this.state.questions.filter(question => 
      question.difficulty === this.state.levelChosen && 
      (this.state.categoriesChosen.selectedCategories.includes(question.category))
    )
    // console.log(randomQuestions.length)
    if (!randomQuestions || randomQuestions.length < 5) {
      this.setState({ notEnoughInCategory: true})
    }
    // console.log(this.state.levelCheck)

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
  if (!questions) return null
  const { levelChosen, notEnoughQuestions, notEnoughInCategory, randomQuestion, 
    currentQuestion, options, score, questionCounter, answerChosen, 
    running, displayScore, totalQuestions } = this.state

    console.log(this.state.randomQuestions)

  return (
      <>
    <div className="App-wrap">

      <GameRunning
      running={running}
      currentQuestion={currentQuestion}
      answerChosen={answerChosen}
      options={options}
      randomQuestion={randomQuestion}
      score={score}
      questionCounter={questionCounter}
      styles={styles}
      handleAnswer={this.handleAnswer}
      />

      <StartScreen
      styles={styles}
      levelChosen={levelChosen}
      categories={this.categories}
      scoreArray={this.scoreArray}
      scoreData={this.scoreData}
      handleChange={this.handleChange}
      handleMultiSelect={this.handleMultiSelect}
      startGame={this.startGame}
      />

    </div>

    <QuestionSelection 
    styles={styles}
    chooseAnotherLevel={this.chooseAnotherLevel}
    chooseMoreCategories={this.chooseMoreCategories}
    notEnoughQuestions={notEnoughQuestions}
    notEnoughInCategory={notEnoughInCategory}
    running={running}
    />

    <FinalScore 
    displayScore={displayScore}
    totalQuestions={totalQuestions}
    score={score}
    startAgain={this.startAgain}
    handleInput={this.handleInput}
    submitScore={this.submitScore}
    />
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

  startScreen: {
    fontFamily: 'Londrina Outline, cursive',
    // color: 'yellow',
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
const { container, startScreen, button, interim, final, questions_wrapper, inner_elements, question_options, score_speech_rec } = styles