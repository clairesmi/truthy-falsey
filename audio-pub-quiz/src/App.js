import React, { Component } from 'react';
// import './App.css';
import axios from 'axios'
import Speech from 'react-speech'
import SpeechRecognition from "react-speech-recognition"

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
  count: 0
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

toggleListen = () => {
  this.setState = ({ listening: !this.state.listening })
  console.log(this.state.listening)
  this.handleListen()
}

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
  const questions = this.state.questions.results
  const { interimTranscript, finalTranscript } = this.state
  const randomQuestion = this.filteredLevels()[Math.floor(Math.random() * this.filteredLevels().length)]

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
        <>
      {randomQuestion.type === 'boolean' &&
      <>
      <h3>True or False</h3>
      <Speech 
      text="True or False"
      voice="Google UK English Female"
      textAsButton={true}
      resume={true} 
      styles={this.style}
      />
      <Speech 
      text={randomQuestion.question}
      voice="Google UK English Female"
      textAsButton={true}
      resume={true} 
      styles={this.style}
      />
      </>}
      {randomQuestion.type === 'multiple' &&
        <>
        <h3>Multiple Choice</h3>
        <Speech 
        text="Multiple Choice"
        voice="Google UK English Female"
        textAsButton={true}
        resume={true} 
        styles={this.style}
        />
        <Speech 
        text={randomQuestion.question}
        voice="Google UK English Female"
        textAsButton={true}
        resume={true} 
        styles={this.style}
        />
        </>
      }
      </>
      </div>
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