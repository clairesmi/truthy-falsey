// To do 
// write points count logic with voice rec
// put all answers into 1 array (new Set or concat)
// write win conditions 
// write voice selector for level 

// build end screen

// Extras:
// write category selector

import React, { Component } from 'react';
// import './App.css';
import axios from 'axios'
// import Speech from 'react-speech'
// import SpeechRecognition from "react-speech-recognition"
import Questions from './quiz/Questions'
import Answers from './quiz/Answers'
import ScoreConditions from './quiz/ScoreConditions';

const SpeechRec = window.webkitSpeechRecognition
const recognition = new SpeechRec()
// console.log(new SpeechRec)

recognition.continous = true
recognition.interimResults = true
recognition.lang = 'en-US'

class App extends Component {

state = {
  questions: null,
  levelChosen: 'Any',
  listening: false,
  interimTranscript: '',
  finalTranscript: '',
  count: 0,
  answerChosen: '',
  answerSpoken: '',
  questionCounter: 1,
  gameFinished: false
}




componentDidMount = async () => {
  try {
    const res = await axios.get('https://opentdb.com/api.php?amount=50')
  this.setState({ questions: res.data.results })
  // console.log(res.data.results)
    } catch(e) {
    console.log(e)
    }
  }

// generateQuestion = () => {
//   this.componentDidMount()
// }

// HANDLE CLICK FOR SELECTING LEVELS AND ANSWERS
handleClick = (e) => {
  e.preventDefault()
 this.setState({ [e.target.name]: e.target.value })
}

handleAnswerClick = (e) => {
  e.preventDefault()
 this.setState({ [e.target.name]: e.target.value })
 this.setState(({questionCounter}) => ({questionCounter: questionCounter + 1}))
}


// FILTER FOR LEVELS 
filteredLevels = () => {
  const { questions, levelChosen } = this.state
  return questions.filter(question => {
    return question.difficulty === levelChosen || levelChosen === 'Any'
  } )
}

// Fisher-Yates shuffling algorithm to shuffle multiple choice options
// It randomly picks out options until there are none left and sets them in the array of randomOptions
randomOptions = (options) => {
  let temp = 0
  for (let i = options.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      temp = options[i] // sets temp to last item in array
      // console.log(temp)
      options[i] = options[j] // sets options[i] to options[j] which is random multiplied by the length of the array minus 1
      // console.log(options[i])
      options[j] = temp // sets options[j] to temp to set random order
      // console.log(options[j])
  }
  return options
  // WORKING ON A REDUCE FUNCTION TO REPLACE THIS

  // const rand = options[Math.floor(Math.random() * options.length)]
  // return options.reduce((acc, rand) => acc.includes(rand) ? acc : [...acc, rand])
}

toggleListen = async (e) => {
  e.preventDefault()
  this.handleListen()
}

toggleStopListening = async (e) => {
  e.preventDefault()
  this.stopListening()
  this.setState({ listening: !this.state.listening})
  this.setState(({questionCounter}) => ({questionCounter: questionCounter + 1}))
  this.answerCheck()
  // window.location.reload()
}

// HANDLE LISTEN FUNCTION FOR ACTIONS TO TAKE WHILST LISTENING 
handleListen = async (e) => {
  await this.setState({listening: true})
  console.log('also listening')

  if (this.state.listening === true) {
    recognition.start()
    recognition.onend = () => recognition.start()
  } else {
    recognition.end()
  }

  let finalTranscript = ''
  recognition.onresult = (e) => {
    let interimTranscript = ''
  for (let i = e.resultIndex; i < e.results.length; i++) {
    const transcript = e.results[i][0].transcript;
    // console.log(transcript)
    if (e.results[i].isFinal) finalTranscript += transcript + ' ';
    else interimTranscript += transcript;
    }
    this.setState({ interimTranscript })
    this.setState({ answerSpoken: finalTranscript })
    document.querySelector('#interim').innerHTML = interimTranscript
    document.querySelector('#final').innerHTML = finalTranscript 

    const finalTranscriptArr = finalTranscript.split(' ')
    const finalText = finalTranscriptArr.join(' ')
    // console.log(finalText)
    document.querySelector('#final').innerHTML = finalText
  }
  recognition.onerror = event => {
    console.log("Error occurred in recognition: " + event.error)
  }
}

stopListening = (e) => {
  // PREVIOUS CODE DURING TEST - USING VOICE TO DEACTIVATE SPEECH RECOGNITION
  // if (!this.state.listening) {
    // (stopListening[0] === 'stop' && stopListening[1] === 'listening' || this.state.listening === false) 
      recognition.stop()
      recognition.onend = () => {
        console.log('i have stopped listening')
    } 
    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error)
    }
}

// checks for end of game
answerCheck = () => {
  this.setState(({ counter }) => ({ counter: counter + 1}))
  if (this.state.questionCounter === 2) {
    // this.endOfGame()
    this.setState(({ gameFinished }) => ({ gameFinished: !gameFinished }))
    console.log('SIX')
    console.log('game in play', this.state.gameFinished)
    this.endOfGame()
  }
}

endOfGame = () => {
  console.log('end of game function runs here')
}

render () {
  if (!this.state.questions) return null

  const questions = this.state.questions
  const { interimTranscript, finalTranscript, answerChosen, answerSpoken, questionCounter, listening, gameFinished } = this.state
  const randomQuestion = this.filteredLevels()[Math.floor(Math.random() * this.filteredLevels().length)]
  const options = randomQuestion.incorrect_answers.concat(randomQuestion.correct_answer)
  const randomOptions = this.randomOptions(options)

  console.log(gameFinished)
  
  return (
    <div className="App-wrap">
      {!gameFinished &&
        <div className="hidden">
      <header className="App-header" style={container}>
      <h1>Claire's Quiz</h1>
      </header>
      <div className="difficulty" style={container}>
        <h2>Choose Difficulty</h2>
        <button type="button" onClick={this.handleClick} name="levelChosen" value="easy">Easy</button>
        <button type="button" onClick={this.handleClick} name="levelChosen" value="medium">Medium</button>
        <button type="button" onClick={this.handleClick} name="levelChosen" value="hard">Hard</button>
        <button type="button" onClick={this.handleClick} name="levelChosen" value="Any">Any</button>
      </div> 
      <div>Generate a question
      {/* <button type="button" onClick={this.generateQuestion} name="questionGenerated">Give me a question!</button> */}
      </div>
      <div className="questions_wrapper" style={questions_wrapper}>
        <div className="question_options" style={question_options}>
      <div className="questions" style={inner_elements}>
      <Questions 
      randomQuestion={randomQuestion}
      randomOptions={randomOptions}
      listening={listening}
      // styles={styles}
      />
      </div>

      <div className="answers" style={inner_elements}>
      <Answers
      listening={listening}
      randomQuestion={randomQuestion}
      // styles={styles}
      questions={questions}
      randomOptions={randomOptions}
      handleClick={this.handleAnswerClick}
      handleListen={this.handleListen}
      />
      </div>
    </div>
    <div className="score_speech_rec" style={score_speech_rec}>
      <div className="score-conditions" style={inner_elements}>
      <ScoreConditions
      randomQuestion={randomQuestion}
      // styles={styles}
      gameFinished={gameFinished}
      questions={questions}
      randomOptions={randomOptions}
      answerChosen={answerChosen}
      answerSpoken={answerSpoken}
      questionCounter={questionCounter}
      finalTranscript={finalTranscript}
      listening={listening}
      generateQuestion={this.generateQuestion}
      toggleStopListening={this.toggleStopListening}
      handleClick={this.handleAnswerClick}
      endOfGame={this.endOfGame}
      />
      </div>

      <div className="speech-rec" style={inner_elements}>
      <button onClick={this.resetTranscript}>Reset</button>
      </div>
      <span>{this.transcript}</span>
      <div>
        <button id='microphone-btn' style={button} onClick={this.toggleListen}>START</button>
        <button id='microphone-btn' style={button} onClick={this.toggleStopListening}>STOP</button>
        <div id='interim' style={interim}>{interimTranscript} </div>
        <div id='final' style={final}>{finalTranscript}</div>
      </div>
    </div>
  </div>
  </div>
}
{gameFinished &&
<div>
  Game is finished
</div>
}
</div>
    )
  }
// write if statements for type of question - boolean or multiple choice 


}

export default App


// --------------- CSS ---------------

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
    // flexDirection: 'column',
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
  },

  hidden: {
    display: 'none'
  }
}

const { container, button, interim, final, questions_wrapper, inner_elements, question_options, score_speech_rec, hidden } = styles