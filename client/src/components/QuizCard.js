import { addStylesheet } from '../core/utils.js'

export const QuizCard = ({
  title,
  description,
  category,
  createdBy,
  url,
  actionText,
}) => {
  addStylesheet('quiz-card-css', '/components/quiz-card.css')

  return /*html*/ `
    <a href="${url}" class="quiz-card card quiz-link">
      <header>
        <h3 class="quiz-title">${title}</h3>
        <p class="quiz-category">${category}</p>
      </header>

      <p class="quiz-description">${description}</p>

      ${
        createdBy
          ? /*html*/ `
          <footer>
            <p class="quiz-created-by-container">
              <span>Created by</span>
              <span class="quiz-created-by">${createdBy}</span>
            </p>
          </footer>`
          : ''
      }
      <div class="quiz-actionText">${actionText}</div>
    </a>
  `
}
