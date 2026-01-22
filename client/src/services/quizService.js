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

export const createQuiz = async (quiz) => {
  try {
    const res = await fetch('http://localhost:8000/quizzes/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(quiz),
    })

    let data
    try {
      data = await res.json()
    } catch {
      data = await res.text()
    }

    return { ok: res.ok, data }
  } catch (err) {
    console.error('Fetch failed', err)
    return { ok: false, data: null, error: err.message }
  }
}

export const createPlayableQuiz = async (id) => {
  const { quiz, questions } = await getQuizWithQuestionsById(id)

  if (!questions || questions.length === 0) {
    throw new Error('Quiz has no questions')
  }

  const qLength = questions.length
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

  const shuffledQuestions = shuffle(questions).map((q) => ({
    ...q,
    answers: shuffle(q.answers),
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
      answerIdx !== null ? question.answers[answerIdx] : { isCorrect: false }

    if (answer.isCorrect) {
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
    title: quiz.title,
    getCurrentQuestion,
    isCorrect: isCorrect,
    result,
    startTimer,
    stopTimer,
    timePerQuestion,
  }
}

export const getQuizResult = (id) => {
  return JSON.parse(sessionStorage.getItem(`quiz-${id}-result`))
}
