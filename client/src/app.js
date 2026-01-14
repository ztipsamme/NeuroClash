import "./components/index.js";
import { initEvents } from "./core/events.js";
import { initRouter } from "./router/index.js";

const initApp = async () => {
  console.log("App initialized");

  initEvents();
  initRouter();
};

document.addEventListener("DOMContentLoaded", initApp());
