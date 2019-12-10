// To do 
// write points count logic with voice rec
// put all answers into 1 array (new Set or concat)
// write win conditions 
// write voice selector for level 

// Extras:
// write category selector

import React, { Component } from 'react';
// import './App.css';
import axios from 'axios'
// import Speech from 'react-speech'
import SpeechRecognition from "react-speech-recognition"
import Questions from './quiz/Questions'
import Answers from './quiz/Answers'

const SpeechRec =  window.webkitSpeechRecognition
const recognition = new SpeechRec()
console.log(new SpeechRec)

recognition.continous = true
recognition.interimResults = true
recognition.lang = 'en-US'

class App extends Component {

state = {
  questions: null,
  levelChosen: 'Any',
  listening: true,
  interimTranscript: '',
  finalTranscript: '',
  count: 0,
  answerChosen: '',
}

componentDidMount = async () => {
  const res = await axios.get('https://opentdb.com/api.php?amount=50')
  // res.replace(/&quot;/g,'"')
  this.setState({ questions: res.data.results })
  console.log(res.data.results)
  // add in try and catch for error handling
}

// HANDLE CLICK FOR SELECTING LEVELS
handleClick = (e) => {
 this.setState({ [e.target.name]: e.target.value })
 console.log(e.target.value)
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
  let i = 0
  let j = 0
  let temp = 0
  for (let i = options.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      temp = options[i] // sets temp to last item in array
      // console.log(temp)
      options[i] = options[j] // sets options[i] to options[j] which is random multiplied by the length of the array minus 1
      // console.log(options[i])
      options[j] = temp // sets options[j] to temp to set random order
      // console.log(options[j])
  }
  return options
}
// randomOptions()
// TOGGLE LISTEN TO HANDLE CLICK ON LISTEN BUTTON
toggleListen = () => {
  this.setState = ({ listening: !this.state.listening })
  console.log(this.state.listening)
  this.handleListen()
}

// HANDLE LISTEN FUNCTION FOR ACTIONS TO TAKE WHILST LISTENING 
handleListen = () => {
  console.log('also listening')

  if (this.state.listening) {
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
    if (e.results[i].isFinal) finalTranscript += transcript + ' ';
    else interimTranscript += transcript;
    }
    this.setState = ({ interimTranscript })
    this.setState = ({ finalTranscript })
    document.getElementById('interim').innerHTML = interimTranscript
    document.getElementById('final').innerHTML = finalTranscript 
    // console.log(interimTranscript, finalTranscript)

    const finalTranscriptArr = finalTranscript.split(' ')
    const stopListening = finalTranscriptArr.slice(-3, -1) 
    console.log('stop listening', stopListening)

    if (stopListening[0] === 'stop' && stopListening[1] === 'listening' || this.state.listening === false) {
      recognition.stop()
      recognition.onend = () => {
        console.log('i have stopped listening')
        const finalText = finalTranscriptArr.slice(0, -3).join(' ')
        document.getElementById('final').innerHTML = finalText
      }
    } 
  }
  recognition.onerror = event => {
    console.log("Error occurred in recognition: " + event.error)
  }
}

render () {
  if (!this.state.questions) return null
  const questions = this.state.questions
  const { interimTranscript, finalTranscript } = this.state
  const randomQuestion = this.filteredLevels()[Math.floor(Math.random() * this.filteredLevels().length)]
  // console.log(questions)

  const options = randomQuestion.incorrect_answers.concat(randomQuestion.correct_answer)
  // console.log(options)
  const randomOptions = this.randomOptions(options)
  
  // console.log(randomOptions)
  return (
    <div className="App">
      <header className="App-header">
      <h1>Claire's Pub Quiz</h1>
      </header>
      <div className="difficulty">
        <h2>Choose Difficulty</h2>
        <button type="button" onClick={this.handleClick} name="levelChosen" value="easy">Easy</button>
        <button type="button" onClick={this.handleClick} name="levelChosen" value="medium">Medium</button>
        <button type="button" onClick={this.handleClick} name="levelChosen" value="hard">Hard</button>
        <button type="button" onClick={this.handleClick} name="levelChosen" value="Any">Any</button>
      </div> 
      <Questions 
      randomQuestion={randomQuestion}
      styles={styles}
      />
      <Answers
      randomQuestion={randomQuestion}
      styles={styles}
      questions={questions}
      randomOptions={randomOptions}
      handleClick={this.handleClick}
      />
      <div>
      <button onClick={this.resetTranscript}>Reset</button>
      <span>{this.transcript}</span>
      <div style={container}>
        <button id='microphone-btn' style={button} onClick={this.toggleListen} />
        <div id='interim' style={interim}>{interimTranscript} </div>
        <div id='final' style={final}>{finalTranscript}</div>
      </div>
    </div>
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
    textAlign: 'center'
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

const { container, button, interim, final } = styles