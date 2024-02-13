import './App.css';
import StartScreen from './components/StartScreen'
import { useCallback, useEffect, useState } from "react"
import { wordsList, wordslist } from "./data/words"
import Game from './components/Game'
import GameOver from './components/GameOver'

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
]

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0)

  const PickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return {word, category}
  }, [words])


  // starts the game
  const startGame = useCallback(() => {
    cleatLetterStates()

    const {word, category } = PickWordAndCategory()

    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());


    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters);
    

    setGameStage(stages[1].name)
  }, [pickedWord]);

  // process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return
    }

    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWGuessedLetters) => [
        ...actualWGuessedLetters,
        normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const cleatLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {
    if(guesses <= 0){
      cleatLetterStates()
      setGameStage(stages[2].name)
    }
  }, [guesses])

  useEffect(()=>{
    const uniqueLetters = [...new Set(letters)]

    //win condition
    if(guessedLetters.length === uniqueLetters.length){
      setScore((actualScore) => actualScore += 100)
      startGame()
    }

  }, [guessedLetters, letters, startGame])

  // restarts the game
  const retry = () => {
    setScore(0)
    setGuesses(3)
    setGameStage(stages[0].name)
  }
  

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory}  letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses}  score={score} /> }
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;                                                                                                                                                         
