export const QuestionCard = (index) => /* html */ `
  <li class="card">
    <fieldset>
      <legend>Question ${index + 1}</legend>
      <div class="input-container">
        <label>Statement*</label>
        <input name="statement" />
      </div>
      <div class="input-container">
        <label>Correct answer*</label>
        <input name="correct" />
      </div>
      <div class="input-container">
        <label>Incorrect answers*</label>
        <input name="incorrect" />
        <input name="incorrect" />
        <input name="incorrect" />
      </div>
      <button type="button" data-delete class="delete-question-button">Delete question</button>
    </fieldset>
  </li>
`
