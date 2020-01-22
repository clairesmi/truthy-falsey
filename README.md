![CS Icon](/src/assets/favicon.ico) 

# Truthy or Falsey ?

This is a web app project that I challenged myself with as another chance to practice React, game logic and error handling. 

It is a true or false quiz with a selection of 5 questions. The user can select a difficulty level and then they can select categories from that difficulty level. 

![Main Page screenshot](/src/assets/home-page.png)

## Deployment

This project is deployed online with Netlify and can be found here:

https://truthy-falsey-quiz.netlify.com/

## Getting Started

Use the clone button to download the source code. Enter the following commands in the CLI:

<!— To install all the packages listed in the package.json: —> $ yarn 

<!— Run the app on localhost:3000 : —> $ yarn start 

<!— Check the console for any issues and if there are check the package.json for any dependancies missing —>

<!- Navigate to http://localhost:3000/>


## Technologies Used:
JavaScript

React

HTML5

CSS3

Node.js

Axios

Yarn

## External APIs
OpenTrivia DB API

## User Experience
The user arrives on a landing page where they can view the leaderboard - created using localStorgage to save the top 5 scores. From here, the user has the option to select a level (they must select a level as the categories are disabled until they do so). Once they have selected a level, they can either leave the categories set to 'Any' or they can select multiple categories from the multi-select (made using the multi-select component from react-select). 


After they have made these selections, the start game button is activated and they can click to start the game. The user is then taken through 5 questions, they can select true or false to answer, and as they go through - their score is updated and they can also see which number question they are on. 

![Questions screenshot](/src/assets/questions.png)

Once the user has answered the fifth question, a modal pops up to tell them their final score and to ask them to enter their name. If they have made it into the top 5, the leaderboard is then populated with their name and score.

![End Page screenshot](/src/assets/end-page.png)

## Error Handling

The API call was limited to 50 questions per call so I had to add some error handling in when the user either selected a level that didn't have eough questions available or if they selected a category that didn't have enough questions available. If this is the case, then I ask the user to select another level, or select more categories.


```
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
```

I used conditional rendering to display the modal asking the user to add more categories: 

```
   {notEnoughInCategory &&
      <div>
        <p>
          Oops, we don't have enough questions in that category, please add some more! 
        </p>
        <button style={styles.startButton} type="button" onClick={chooseMoreCategories} name="chooseAnotherLevel">OK</button>
      </div>
      }
```

## Reflection and Future Improvements 

I was happy overall with how this project turned out, however I would like to do some testing on it and also I would like to try refactoring it into React Hooks or another JS framework.  