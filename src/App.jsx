import { useState , useEffect} from 'react'
import {clsx} from 'clsx'
import { nanoid } from 'nanoid'

function App() {
  const [startQuizz, setStartQuizz] = useState(false)
  const [categories,setCategories]=useState([])
  const [quizzTemplate,setQuizzTemplate]=useState({category:"any category",questionNbr:5,difficulty:"",questionType:""})
  const [createQuizz,setCreateQuizz]=useState(false)
  const [quizz, setQuizz]=useState([])
  const [answers,setAnswers]=useState([{'questionNbr':0,ans:""},{'questionNbr':1,ans:""},{'questionNbr':2,ans:""},{'questionNbr':3,ans:""},{'questionNbr':4,ans:""},{'questionNbr':5,ans:""},{'questionNbr':6,ans:""},{'questionNbr':7,ans:""},{'questionNbr':8,ans:""},{'questionNbr':9,ans:""},{'questionNbr':10,ans:""},{'questionNbr':11,ans:""},{'questionNbr':12,ans:""},{'questionNbr':13,ans:""},{'questionNbr':14,ans:""},{'questionNbr':15,ans:""},{'questionNbr':16,ans:""},{'questionNbr':17,ans:""},{'questionNbr':18,ans:""},{'questionNbr':19,ans:""}])
  const [checkAnswers,setCheckAnswers]=useState(false)
  const [playAgain,setPlayAgain]=useState(false)
  useEffect(()=>{
    fetch("https://opentdb.com/api_category.php")
      .then(res=>res.json())
      .then(data=>{setCategories(data.trivia_categories)})
  },[])
  useEffect(()=>{
    if(createQuizz){
      fetch(`https://opentdb.com/api.php?amount=${quizzTemplate.questionNbr}${typeof quizzTemplate.category==='object'? `&category=${quizzTemplate.category.id}`:""}${quizzTemplate.difficulty?`&difficulty=${quizzTemplate.difficulty}`:""}${quizzTemplate.questionType?`&type=${quizzTemplate.questionType}`:""}&encode=url3986`)
      .then(res=>res.json())
      .then(data=>setQuizz(data.results.map(question=>
      { const randomIndex = Math.floor(Math.random() * question.incorrect_answers.length + 1);
        question.incorrect_answers.splice(randomIndex, 0,question.correct_answer)
        return question
      })))
    } 
  },[createQuizz,playAgain])
  console.log(`https://opentdb.com/api.php?amount=${quizzTemplate.questionNbr}${typeof quizzTemplate.category==='object'? `&category=${quizzTemplate.category.id}`:""}${quizzTemplate.difficulty?`&difficulty=${quizzTemplate.difficulty}`:""}${quizzTemplate.questionType?`&type=${quizzTemplate.questionType}`:""}&encode=url3986`)
  function handleClick(){
    const {value,name}=event.target
    setAnswers(prev=>prev.map(answer=>answer.questionNbr===Number(name) ?{questionNbr:answer.questionNbr , ans:value}:answer))
  }

  function correctAnswers(){
    return answers.filter(answer=>quizz[answer.questionNbr] && answer.ans===quizz[answer.questionNbr].correct_answer).length
  }

  return (
    <>
      <svg width="194" height="197" viewBox="0 0 194 197" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M99.4095 81.3947C71.1213 50.8508 33.3179 21.7816 37.1727 -19.6933C41.4394 -65.599 75.854 -105.359 118.419 -123.133C158.797 -139.994 206.035 -130.256 241.822 -105.149C271.947 -84.0141 272.823 -43.8756 282.141 -8.27104C292.17 30.0508 318.521 70.8106 296.501 103.779C273.538 138.159 224.991 143.432 183.931 138.768C148.318 134.723 123.751 107.677 99.4095 81.3947Z" fill="#FFFAD1"/>
      </svg>

      <svg width="148" height="118" viewBox="0 0 148 118" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M-5.55191 4.90596C35.9614 1.77498 82.2425 -9.72149 112.306 19.1094C145.581 51.0203 155.282 102.703 142.701 147.081C130.767 189.18 93.7448 220.092 51.8208 232.476C16.5281 242.902 -15.4332 218.605 -49.1007 203.738C-85.3375 187.737 -133.641 182.993 -145.741 145.239C-158.358 105.868 -132.269 64.5881 -103.064 35.3528C-77.7328 9.99541 -41.2727 7.60006 -5.55191 4.90596Z" fill="#DEEBF8"/>
      </svg>


      {!startQuizz ?
        /* intro page  */
        <main className='intro'>
          <h1>Quizzical</h1>
          <p>Some description if needed</p>
          <button onClick={()=>setStartQuizz(prev=>!prev)}>Start quiz</button>
        </main>
      : createQuizz ? 
          /* quizz page */
          <main className='quizz'>
            {quizz.map((question,index)=>
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
              <button className='btn' onClick={checkAnswers ?()=>{ setPlayAgain(prev=>!prev); setCheckAnswers(prev=>!prev); setAnswers([{'questionNbr':0,ans:""},{'questionNbr':1,ans:""},{'questionNbr':2,ans:""},{'questionNbr':3,ans:""},{'questionNbr':4,ans:""},{'questionNbr':5,ans:""},{'questionNbr':6,ans:""},{'questionNbr':7,ans:""},{'questionNbr':8,ans:""},{'questionNbr':9,ans:""},{'questionNbr':10,ans:""},{'questionNbr':11,ans:""},{'questionNbr':12,ans:""},{'questionNbr':13,ans:""},{'questionNbr':14,ans:""},{'questionNbr':15,ans:""},{'questionNbr':16,ans:""},{'questionNbr':17,ans:""},{'questionNbr':18,ans:""},{'questionNbr':19,ans:""}]);}
                :()=>setCheckAnswers(prev=>!prev)}>
                {checkAnswers ?"Play Again":"Check answers"}
              </button> 
            </div> 
          </main>
        :
          /* choosing quizz template page  */
          <main className='create-quizz'>
            <h1>CHOOSE TYPE OF QUIZZ</h1>
            <section className='categories'>
              <button className={clsx(quizzTemplate.category==="any category"&&'chosen')} onClick={()=>setQuizzTemplate("any category")}>Any Category</button>
              {categories.map(category=><button className={clsx(quizzTemplate.category===category&&'chosen')}  key= {category.id} onClick={()=>setQuizzTemplate(prev=>({...prev,category:category}))}>
              {category.name}</button>  )}
            </section>
            <section className='amount'>
              <button onClick={()=>setQuizzTemplate(prev=>({...prev,questionNbr:5}))}  className={clsx(quizzTemplate.questionNbr===5&&'chosen')}>5</button>
              <button onClick={()=>setQuizzTemplate(prev=>({...prev,questionNbr:10}))} className={clsx(quizzTemplate.questionNbr===10&&'chosen')}>10</button>
              <button onClick={()=>setQuizzTemplate(prev=>({...prev,questionNbr:15}))} className={clsx(quizzTemplate.questionNbr===15&&'chosen')}>15</button>
              <button onClick={()=>setQuizzTemplate(prev=>({...prev,questionNbr:20}))} className={clsx(quizzTemplate.questionNbr===20&&'chosen')}>20</button>
            </section>
            <section className='difficulty'>
              <button onClick={()=>setQuizzTemplate(prev=>({...prev,difficulty:''}))}  className={clsx(quizzTemplate.difficulty===""&&'chosen')}>Any Difficulty</button>
              <button onClick={()=>setQuizzTemplate(prev=>({...prev,difficulty:'easy'}))}  className={clsx(quizzTemplate.difficulty==="easy"&&'chosen')}>Easy</button>
              <button onClick={()=>setQuizzTemplate(prev=>({...prev,difficulty:'medium'}))} className={clsx(quizzTemplate.difficulty==="medium"&&'chosen')}>Medium</button>
              <button onClick={()=>setQuizzTemplate(prev=>({...prev,difficulty:'hard'}))} className={clsx(quizzTemplate.difficulty==="hard"&&'chosen')}>Hard</button>
            </section>
            <section className='question-type'>
              <button onClick={()=>setQuizzTemplate(prev=>({...prev,questionType:''}))}  className={clsx(quizzTemplate.questionType==""&&'chosen')}>Any Type</button>
              <button onClick={()=>setQuizzTemplate(prev=>({...prev,questionType:'boolean'}))} className={clsx(quizzTemplate.questionType==="boolean"&&'chosen')}>True/false</button>
              <button onClick={()=>setQuizzTemplate(prev=>({...prev,questionType:'multiple'}))} className={clsx(quizzTemplate.questionType==="multiple"&&'chosen')}>Multiple choice</button>
            </section>
            <button className='btn' onClick={()=>setCreateQuizz(true)}>Create Quizz</button>
          </main>
        }   
    </>
  )
}

export default App
