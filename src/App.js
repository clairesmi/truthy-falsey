import React, { Component } from 'react'
// import './App.css';
import axios from 'axios'
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
    {value: "Entertainment: Music", label: "Entertainment: Music"},
    {value: "Entertainment: Television", label: "Entertainment: Television"},
    {value: "Entertainment: Cartoon & Animations", label: "Entertainment: Cartoon & Animations"},
    {value: "Entertainment: Japanese Anime & Manga", label: "Entertainment: Japanese Anime & Manga"}
  ]

scoreArray = localStorage.getItem('scores') ? JSON.parse(localStorage.getItem('scores')) : []
scoreData = localStorage.getItem('scores') ? JSON.parse(localStorage.getItem('scores')) : []

componentDidMount () {
  this.nextQuestion()
}

startGame = () => {
  // console.log(this.state.running)
  this.setState({ questionCounter: 1, score: 0, totalQuestions: 5, running: true,
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
  this.setState({ notEnoughQuestions: !this.state.notEnoughQuestions, 
    notEnoughInCategory: false, levelChosen: '' }) 
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
  const randomQuestions = this.state.questions.filter(question => 
      question.difficulty === this.state.levelChosen && 
      (this.state.categoriesChosen.selectedCategories.includes(question.category))
    )
    // console.log(randomQuestions.length)
    if (!randomQuestions || randomQuestions.length < 5) {
      this.setState({ notEnoughInCategory: true})
    }

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
  if (this.state.questionCounter === this.state.totalQuestions) {
    this.endOfGame() 
  }
  // this.setQuestions()
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

  this.state.selectedCategories ? this.nextQuestion() : this.handleAnyCategory()

  this.setState({answerChosen: '', questionCounter: this.state.questionCounter + 1})

  if (this.state.questionCounter === this.state.totalQuestions) {
    this.endOfGame() 
    }
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

render () {
  const questions = this.state.questions
  if (!questions) return null
  const { levelChosen, notEnoughQuestions, notEnoughInCategory, randomQuestion, 
    currentQuestion, options, score, questionCounter, answerChosen, 
    running, displayScore, totalQuestions } = this.state
  return (
      <>
        <div className="app-wrapper" style={!displayScore && !notEnoughQuestions && !notEnoughInCategory ? container: outerModal}>
          {running &&
          <GameRunning
          styles={styles}
          running={running}
          currentQuestion={currentQuestion}
          answerChosen={answerChosen}
          options={options}
          randomQuestion={randomQuestion}
          score={score}
          questionCounter={questionCounter}
          handleAnswer={this.handleAnswer}
          />
          }

          {!running &&
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
          }
          <div style={notEnoughQuestions || notEnoughInCategory ? innerModal: null}>
          <QuestionSelection 
          styles={styles}
          chooseAnotherLevel={this.chooseAnotherLevel}
          chooseMoreCategories={this.chooseMoreCategories}
          notEnoughQuestions={notEnoughQuestions}
          notEnoughInCategory={notEnoughInCategory}
          running={running}
          />
          </div>
          <div style={displayScore && totalQuestions !== 0 ? innerModal: null}>
          <FinalScore 
          styles={styles}
          displayScore={displayScore}
          totalQuestions={totalQuestions}
          score={score}
          startAgain={this.startAgain}
          handleInput={this.handleInput}
          submitScore={this.submitScore}
          />
          </div>
        </div>
      </>
    )
  }
}
export default App

const styles = {
  container: {
    background: 'url(https://cdn.hipwallpaper.com/i/50/52/ZG9Ntj.jpg)',
    // backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flexStart',
    textAlign: 'left',
    // border: 'solid black 2px',
    width: '100vw',
    height: '100vh',
    // paddingRight: '20px'
  },

  h1: {
    marginBottom: '0px',
    marginTop: '20px',
    // marginLeft: '10px',
    paddingTop: '40px',
    fontFamily: 'Londrina Outline, cursive',
    fontSize: '80px',
    textAlign: 'center'
  },

  startScreen: {
    fontFamily: 'Londrina Outline, cursive',
    fontSize: '80px',
    paddingLeft: '50px',
    paddingRight: '20px',
    paddingTop: '30px'
  },

  startScreenWrapper: {
    display: 'flex',
    // border: 'solid black 1px',
    width: '100vw',
  },

  playerOptions: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '70%',
    alignItems: 'center',
    // border: 'solid black 1px',
    height: '70vh',
    justifyContent: 'center'
  },

  select : {
    height: '40px',
    width: '800px',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '25px',
    marginTop: '30px',
    marginBottom: '20px',
    padding: '20px'
  },

  multiSelect: {
    height: '40px',
    width: '800px',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '25px',
    margin: '10px'
  },

  startButton: {
    height: '40px',
    width: '200px',
    borderRadius: '5px',
    fontSize: '25px',
    marginTop: '80px',
    zIndex: '1',
    opacity: '1.0',
  },

  scoreBoard: {
    flexBasis: '30%',
    fontFamily: 'Londrina Outline, cursive',
    fontSize: '40px',
    textAlign: 'left',
    height: '70vh',
    paddingLeft: '100px',
    marginLeft: '10px'
  },

  gameWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
    // paddingLeft: '60px',
    paddingRight: '60px',
    paddingTop: '30px',
    marginLeft: '20px'
  },

  questionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'Londrina Outline, cursive',
    fontSize: '50px',
    letterSpacing: '1px',
    textAlign: 'center',
  },

  questionStyle: {
    height: '40px',
    width: '800px',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '25px',
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: '5px',
    paddingTop: '20px',
    paddingBottom: '25px'
  },

  questions_wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100 vw',
    border: 'solid, black, 2px',
  },

  outerModal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0px',
    background: 'url(https://cdn.hipwallpaper.com/i/50/52/ZG9Ntj.jpg)',
    backgroundRepeat: 'no-repeat',
    zIndex: '1',
    height: '100vh',
  },

  innerModal: {
    display: 'flex',
    height: '60vh',
    width: '50vw',
    position: 'absolute',
    padding: '50px',
    paddingBottom: '0px',
    backgroundColor: 'grey',
    opacity: '0.8',
    border: 'solid grey 1px',
    marginTop: '200px',
    zIndex: '2',
    boxShadow: '0px 2px 10px 0px',
    textAlign: 'center',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '30px',
    fontWeight: 'light',
    color: 'black'
  },

  inputName : {
    height: '40px',
    width: '500px',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '25px',
    marginTop: '30px',
    marginBottom: '20px',
    padding: '20px'
  },

}
const { container, outerModal, innerModal } = styles