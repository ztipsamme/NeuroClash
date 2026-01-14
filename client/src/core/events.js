import { navigate } from "../router/index.js";

export function initEvents() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-link");
    if (!link) return;

    e.preventDefault();
    navigate(link.getAttribute("href"));
  });
}
