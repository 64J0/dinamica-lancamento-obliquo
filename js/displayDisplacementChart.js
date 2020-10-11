let chart;

function displayDisplacementChart({
  array_posicao_horizontal,
  array_posicao_vertical
}) {
  const ctx = document.querySelector('#deslocamentoYx');
  ctx.className = "";

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: array_posicao_horizontal,
      datasets: [{
        label: 'Posição vertical (y)',
        borderColor: 'rgb(119, 221, 119)',
        data: array_posicao_vertical
      }]
    },
    options: {
      title: {
        display: true,
        fontSize: 24,
        text: 'Deslocamento da partícula'
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Posição horizontal (x)'
          }
        }]
      }
    }
  });

  return console.log('Gráfico do deslocamento atualizado.');
}

export default displayDisplacementChart;