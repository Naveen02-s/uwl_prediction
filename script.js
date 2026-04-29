let chart;

// 🔮 Prediction function (Linear Regression)
function predictNextValue(years, levels) {
  const n = years.length;

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += years[i];
    sumY += levels[i];
    sumXY += years[i] * levels[i];
    sumXX += years[i] * years[i];
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const nextYear = Math.max(...years) + 1;
  const predicted = slope * nextYear + intercept;

  return { nextYear, predicted: parseFloat(predicted.toFixed(2)) };
}

// 🔍 Search Function
function searchCity() {
  const input = document.getElementById("cityInput").value.toLowerCase();
  const resultDiv = document.getElementById("result");

  if (waterData[input]) {
    const city = waterData[input];

    const years = city.history.map(item => item.year);
    const levels = city.history.map(item => item.level);

    // Prediction
    const prediction = predictNextValue(years, levels);

    resultDiv.innerHTML = `
      <h2>${input.toUpperCase()}</h2>
      <p><strong>Current Water Level:</strong> ${city.current} meters</p>
      <p style="color:green;">
        🔮 Predicted (${prediction.nextYear}): ${prediction.predicted} meters
      </p>
    `;

    const ctx = document.getElementById('waterChart').getContext('2d');

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [...years, prediction.nextYear],
        datasets: [
          {
            label: 'Actual Data',
            data: levels,
            borderColor: 'blue',
            fill: false
          },
          {
            label: 'Prediction',
            data: [...levels, prediction.predicted],
            borderColor: 'red',
            borderDash: [5, 5],
            fill: false
          }
        ]
      },
      options: {
        responsive: true
      }
    });

  } else {
    resultDiv.innerHTML = "<p>❌ City not found</p>";
    if (chart) chart.destroy();
  }
}