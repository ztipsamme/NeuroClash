import { QuizCard } from './QuizCard.js'

export default async function QuizList(quizzes) {
  const url = window.location.pathname.includes('/my-quizzes')

  if (!quizzes || quizzes.length === 0)
    return /*html*/ `<p>No quizzes found</p>`

  const quizCard = ({ title, description, category, createdBy, _id }) =>
    QuizCard({
      title,
      description,
      category,
      createdBy: createdBy?.username,
      url: url ? `/my-quizzes/edit/${_id}` : `/quiz/${_id}`,
      actionText: url ? 'Edit quiz' : 'Play quiz',
    })

  const quizList = quizzes
    .map(
      (q) => /* html */ `
      <li>${quizCard(q)}</li>
    `
    )
    .join('')

  return /*html*/ `<ul class="quiz-list">${quizList}</ul>`
}
