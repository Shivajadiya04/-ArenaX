let questionIndex = 0;

function addQuestion() {
  const container = document.getElementById('question-container');

  const questionHTML = `
    <div class="question-block" id="q-${questionIndex}">
      <input type="text" name="questions[${questionIndex}][question]" placeholder="Question" required />
      <input type="text" name="questions[${questionIndex}][option1]" placeholder="Option 1" required />
      <input type="text" name="questions[${questionIndex}][option2]" placeholder="Option 2" required />
      <input type="text" name="questions[${questionIndex}][option3]" placeholder="Option 3" required />
      <input type="text" name="questions[${questionIndex}][option4]" placeholder="Option 4" required />
      <input type="text" name="questions[${questionIndex}][correctAnswer]" placeholder="Correct Answer" required />
      <input type="text" name="questions[${questionIndex}][hint]" placeholder="Hint (Optional)" />
    </div>
  `;

  container.insertAdjacentHTML('beforeend', questionHTML);

  // Animate new question block
  gsap.to(`#q-${questionIndex}`, {
    duration: 0.7,
    opacity: 1,
    y: -10,
    ease: "power2.out"
  });

  questionIndex++;
}

// Initial load animation
window.onload = () => {
  gsap.from("#form-title", {
    duration: 1,
    y: -50,
    opacity: 0,
    ease: "bounce.out"
  });

  gsap.from("#contest-form", {
    duration: 1,
    opacity: 0,
    y: 30,
    ease: "power2.out",
    delay: 0.2
  });

  addQuestion(); // Add 1 default question
};
