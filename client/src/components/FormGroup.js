export const FormGroup = ({
  label,
  name,
  description,
  type = 'text',
  value = '',
}) => /*html*/ `
  <div class="input-container">
    <label for="${name}">
      <span>${label}*</span>
      ${description ? /*html*/ `<span class="description">${description}</span>` : ''}
    </label>
    <input type="${type}" name="${name}" value="${value}" />
  </div>
`
