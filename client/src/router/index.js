import { routes } from "./routes.js";
import { render } from "../core/render.js";
import NotFound from "../views/NotFound.js";

export function initRouter() {
  window.addEventListener("popstate", handleRoute);
  handleRoute();
}

function handleRoute() {
  const path = window.location.pathname;
  const route = routes.find((r) => r.path === path) || {
    view: NotFound,
  };
  render(route);
}

export function navigate(url) {
  history.pushState(null, null, url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
