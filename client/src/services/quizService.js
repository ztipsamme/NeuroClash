export const getQuizzes = async () => {
  const res = await fetch("http://localhost:8000/quizzes");
  const data = await res.json();
  return data;
};
