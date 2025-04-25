const categorySelect = document.getElementById("category");
const formContainer = document.getElementById("formContainer");

categorySelect.addEventListener("change", function () {
  const selected = this.value;
  formContainer.style.display = selected ? "block" : "none";

  if (!selected) {
    formContainer.innerHTML = "";
    return;
  }

  const formHTML = `
    <label>Contest Title</label>
    <input type="text" placeholder="Enter Contest Title" />

    <label>Contest Description</label>
    <textarea rows="3" placeholder="Write a short description..."></textarea>

    <label>Time Limit (minutes)</label>
    <input type="number" placeholder="e.g., 60" />

    <label>Hint</label>
    <input type="text" placeholder="Any hint for participants" />

    <label>Question</label>
    <textarea rows="4" placeholder="Write your ${selected} question here..."></textarea>

    <label>Lifeline (optional)</label>
    <input type="text" placeholder="e.g., 50-50, Skip, etc." />

    <label>Timer Countdown</label>
    <input type="number" placeholder="Enter timer per question (in seconds)" />

    <button>Create ${selected.charAt(0).toUpperCase() + selected.slice(1)} Contest</button>
  `;

  formContainer.innerHTML = formHTML;
});
