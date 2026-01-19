import { navigate } from '../router/index.js'

const fetchData = async (path) => {
  const res = await fetch(path)
  const data = await res.json()
  return data
}

export const getQuizzes = async () =>
  await fetchData('http://localhost:8000/quizzes')

export const getQuizById = async (id) =>
  await fetchData(`http://localhost:8000/quizzes/${id}`)

const getQuizWithQuestionsById = async (id) =>
  await fetchData(`http://localhost:8000/quizzes/${id}/questions`)

export const createQuiz = async (id) => {
  const { Quiz, Questions } = await getQuizWithQuestionsById(id)

  if (!Questions || Questions.length === 0) {
    throw new Error('Quiz has no questions')
  }

  const qLength = Questions.length
  const timePerQuestion = 10
  let currentQuestionIdx = 0
  let correctAnswers = 0
  let intervalId = null
  let totalTimePlayed = 0
  let secondsLeft = timePerQuestion

  const shuffle = (arr) => {
    let i = arr.length,
      j,
      temp

    while (--i > 0) {
      j = Math.floor(Math.random() * (i + 1))
      temp = arr[j]
      arr[j] = arr[i]
      arr[i] = temp
    }

    return arr
  }

  const shuffledQuestions = shuffle(Questions).map((q) => ({
    ...q,
    Answers: shuffle(q.Answers),
  }))

  const getCurrentQuestion = () => shuffledQuestions[currentQuestionIdx]

  const startTimer = (onTick, onTimeOut) => {
    let seconds = timePerQuestion
    onTick(seconds)

    intervalId = setInterval(() => {
      seconds--
      secondsLeft = seconds
      onTick(seconds)

      if (seconds <= 0) {
        clearInterval(intervalId)
        onTimeOut()
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (intervalId) clearInterval(intervalId)

    totalTimePlayed += timePerQuestion - secondsLeft
  }

  const isCorrect = (answerIdx = null) => {
    if (intervalId) clearInterval(intervalId)

    const question = getCurrentQuestion()

    const answer =
      answerIdx !== null ? question.Answers[answerIdx] : { IsCorrect: false }

    if (answer.IsCorrect) {
      correctAnswers++
      return true
    } else {
      return false
    }
  }

  const result = () => {
    if (currentQuestionIdx < qLength - 1) {
      currentQuestionIdx++
      return getCurrentQuestion()
    }

    sessionStorage.setItem(
      `quiz-${id}-result`,
      JSON.stringify({
        correctAnswers,
        incorrectAnswers: qLength - correctAnswers,
        totalTimePlayed,
      })
    )

    navigate(`/quiz/${id}/result`)
  }

  return {
    title: Quiz.Title,
    getCurrentQuestion,
    IsCorrect: isCorrect,
    result,
    startTimer,
    stopTimer,
    timePerQuestion,
  }
}

export const getQuizResult = (id) => {
  return JSON.parse(sessionStorage.getItem(`quiz-${id}-result`))
}
