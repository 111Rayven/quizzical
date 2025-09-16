import { useState , useEffect} from 'react'
import {clsx} from 'clsx'
import { nanoid } from 'nanoid'

function App() {
  const [startQuizz, setStartQuizz] = useState(false)
  const [quizz, setQuizz]=useState([])
  const [answers,setAnswers]=useState([{'questionNbr':0,ans:""},{'questionNbr':1,ans:""},{'questionNbr':2,ans:""},{'questionNbr':3,ans:""},{'questionNbr':4,ans:""}])
  const [checkAnswers,setCheckAnswers]=useState(false)

  useEffect(()=>{
    fetch("https://opentdb.com/api.php?amount=5&encode=url3986")
      .then(res=>res.json())
      .then(data=>setQuizz(data.results.map(question=>
      { const randomIndex = Math.floor(Math.random() * question.incorrect_answers.length + 1);
        question.incorrect_answers.splice(randomIndex, 0,question.correct_answer)
        return question
      })))
  },[quizz])
  
  function handleClick(){
    const {value,name}=event.target
    setAnswers(prev=>prev.map(answer=>answer.questionNbr===Number(name) ?{questionNbr:answer.questionNbr , ans:value}:answer))
  }

  function correctAnswers(){
    return answers.filter(answer=>answer.ans===quizz[answer.questionNbr].correct_answer).length
  }

  return (
    <main>
        <svg width="188" height="145" viewBox="0 0 188 145" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M63.4095 85.3947C35.1213 54.8508 -2.68208 25.7816 1.17277 -15.6933C5.43944 -61.599 39.8541 -101.359 82.4192 -119.133C122.797 -135.994 170.035 -126.256 205.822 -101.149C235.947 -80.0141 236.823 -39.8756 246.141 -4.27104C256.17 34.0508 282.521 74.8106 260.501 107.779C237.539 142.159 188.991 147.432 147.931 142.768C112.318 138.723 87.7505 111.677 63.4095 85.3947Z" fill="#FFFAD1"/>
        </svg>
        <svg width="148" height="118" viewBox="0 0 148 118" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M-5.55191 4.90596C35.9614 1.77498 82.2425 -9.72149 112.306 19.1094C145.581 51.0203 155.282 102.703 142.701 147.081C130.767 189.18 93.7448 220.092 51.8208 232.476C16.5281 242.902 -15.4332 218.605 -49.1007 203.738C-85.3375 187.737 -133.641 182.993 -145.741 145.239C-158.358 105.868 -132.269 64.5881 -103.064 35.3528C-77.7328 9.99541 -41.2727 7.60006 -5.55191 4.90596Z" fill="#DEEBF8"/>
        </svg>

        {!startQuizz ?
        <section className='intro'>
          <h1>Quizzical</h1>
          <p>Some description if needed</p>
          <button onClick={()=>setStartQuizz(prev=>!prev)}>Start quiz</button>
        </section>
        : 
        <section className='quizz'>{quizz.map((question,index)=>
          <section key={index} className='question'>
            <h1>{ decodeURIComponent(question.question)}</h1>
            <div className='answers'>
            {question.incorrect_answers.map(choice=>
            <button value={choice} name={index} key={nanoid()} 
            className={clsx(answers[index].ans===choice && !checkAnswers && 'answer', checkAnswers && choice===question.correct_answer && 'right-answer', answers[index].ans===choice && checkAnswers && choice!==question.correct_answer && 'wrong-answer' )}  
            onClick={handleClick} 
            disabled={checkAnswers}>
              {decodeURIComponent(choice)}
            </button>)}
            </div>
          </section>)} 
          
          <div className='footer'>
            {checkAnswers &&  <span>{`You scored ${correctAnswers()}/5 correct answers`}</span>}
            <button className='btn' onClick={checkAnswers ?()=>{ setQuizz([]); setCheckAnswers(prev=>!prev);}:()=>setCheckAnswers(prev=>!prev)}>
              {checkAnswers ?"Play Again":"Check answers"}
            </button> 
          </div> 
        </section> 
        }   
    </main>
  )
}

export default App
