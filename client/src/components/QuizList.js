export default async function QuizList(quizzes) {
  const url = window.location.pathname.includes('/my-quizzes')

  if (!quizzes || quizzes.length === 0)
    return /*html*/ `<p>No quizzes found</p>`

  const quizList = quizzes
    .map(
      (q) => /* html */ `
      <li>
        <quiz-card
            title="${q.title}"
            description="${q.description}"
            category="${q.category}"
            createdBy="${q.createdBy ? q.createdBy.username : ''}"
            url="${url ? `/my-quizzes/edit/${q._id}` : `/quiz/${q._id}`}"
            dialog="${url ? 'Edit quiz' : 'Play quiz'}"
            >
        </quiz-card>
      </li>
    `
    )
    .join('')

  return /*html*/ `<ul class="quiz-list">${quizList}</ul>`
}
