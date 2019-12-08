import React, { Component } from 'react';
// import './App.css';
import axios from 'axios'
import Speech from 'react-speech'
import SpeechRecognition from "react-speech-recognition"
import PropTypes from "prop-types"

// const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
const recognition = new SpeechRecognition()

recognition.continous = true
recognition.interimResults = true
recognition.lang = 'en-GB'

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
}

const Dictaphone = ({
  // transcript,
  // resetTranscript,
  // browserSupportsSpeechRecognition
})

class App extends Component {

state = {
  questions: null,
  levelChosen: 'Any',
  transcript: null,
  resetTranscript: null,
  browserSupportsSpeechRecognition: true,
  listening: false
}

componentDidMount = async () => {
  let res = await axios.get('https://opentdb.com/api.php?amount=50')
  this.setState({ questions: res.data.results })
  console.log(res.data.results)
}

handleClick = (e) => {
 this.setState({ [e.target.name]: e.target.value })
//  console.log(e.target.value)
}

filteredLevels = () => {
  const { questions, levelChosen } = this.state
  return questions.filter(question => {
    return question.difficulty === levelChosen || levelChosen === 'Any'
  } )
}

onClick = () => {
  this.toggleListen()
}

toggleListen = () => {
  this.setState = ({ listening: !this.state.listening }, this.handleListen)
}

handleListen = () => {

} 


render () {

  if (!this.state.questions) return null
  const questions = this.state.questions.results
  // console.log(this.filteredLevels()[Math.floor(Math.random() * this.filteredLevels().length)])
  const randomQuestion = this.filteredLevels()[Math.floor(Math.random() * this.filteredLevels().length)]
  console.log(this.state.transcript)

    if (!this.state.browserSupportsSpeechRecognition) {
      return null;
    }
  
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
      <div className="question">
      <Speech 
      text={randomQuestion.question}
      voice="Google UK English Female"
      textAsButton={true}
      resume={true} 
      styles={this.style}
      />
      </div>
      <div>
      <button onClick={this.resetTranscript}>Reset</button>
      <span>{this.transcript}</span>
      <div style={container}>
        <button id='microphone-btn' style={button} onClick={this.toggleListen} />
        <div id='interim' style={interim}></div>
        <div id='final' style={final}></div>
      </div>
    </div>
    </div>
    )
  }
// write if statements for type of question - boolean or multiple choice 


}

// Dictaphone.propTypes = propTypes;

// export default SpeechRecognition(Dictaphone)
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