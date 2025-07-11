/*gsap.from(".dashboard-container", { opacity: 0, y: 50, duration: 1 });
gsap.from(".card", { opacity: 0, scale: 0.9, stagger: 0.2, duration: 0.8 });

// Chart: Category-wise
const categoryCanvas = document.getElementById("categoryChart");
const categoryLabels = JSON.parse(categoryCanvas.dataset.labels);
const categoryData = JSON.parse(categoryCanvas.dataset.values);

new Chart(categoryCanvas, {
  type: "bar",
  data: {
    labels: categoryLabels,
    datasets: [{
      label: "Contests",
      data: categoryData,
      backgroundColor: ['#9b5de5', '#f15bb5', '#00bbf9', '#00f5d4', '#ffab00'],
      borderRadius: 10,
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }
});

// Chart: Date-wise
const dateCanvas = document.getElementById("dateChart");
const dateLabels = JSON.parse(dateCanvas.dataset.labels);
const dateData = JSON.parse(dateCanvas.dataset.values);

new Chart(dateCanvas, {
  type: "line",
  data: {
    labels: dateLabels,
    datasets: [{
      label: "Contests Created",
      data: dateData,
      borderColor: "#9b5de5",
      backgroundColor: "rgba(155, 93, 229, 0.2)",
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }
});*/




