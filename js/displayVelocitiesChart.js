let chart;

function displayVelocitiesChart({
  array_tempo,
  array_velocidade_horizontal,
  array_velocidade_vertical
}) {
  const ctx = document.querySelector('#velocidades');
  ctx.className = "";

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: array_tempo,
      datasets: [{
        label: 'Velocidade horizontal',
        borderColor: 'rgb(132, 99, 255)',
        data: array_velocidade_horizontal
      }, {
        label: 'Velocidade vertical',
        borderColor: 'rgb(99, 255, 132)',
        data: array_velocidade_vertical
      }]
    },
    options: {
      title: {
        display: true,
        fontSize: 24,
        text: 'Velocidades'
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Tempo (s)'
          }
        }]
      }
    }
  });

  return console.log('Gráfico das velocidades foi atualizado');
}

export default displayVelocitiesChart;