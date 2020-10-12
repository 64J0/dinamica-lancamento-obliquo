const g = Number(9.81); // m/s^2

function calculateAndPlot() {
  const { h0, h1, v0, theta_deg } = getValuesFromInterface();

  //Transformando em radianos
  const theta_rad = (theta_deg * Math.PI / 180);

  const hmax = calculateMaxHeight({ v0, theta_rad, h0 });
  document.querySelector('#hmax').value = hmax;

  const { t_subida, t_descida, t_total } = calculateTotalTime({ v0, theta_rad, hmax, h1 });
  document.querySelector('#t-total').value = t_total;

  const xmax = v0 * Math.cos(theta_rad) * t_total;
  document.querySelector('#xmax').value = xmax.toFixed(5);

  // ==================================================
  // Gráficos

  const pointsQuantity = document.querySelector('#pointsQuantity').value;
  const incremento = t_total / pointsQuantity;

  plotDisplacement({ t_subida, t_total, v0, theta_rad, h0, hmax, incremento });
  plotVelocities({ t_subida, t_total, v0, theta_rad, incremento });

  return { ok: true };
}

function getValuesFromInterface() {
  let h0 = document.getElementById('h0').value || 0;
  h0 = Number(h0.trim());

  let h1 = document.getElementById('h1').value || 0;
  h1 = Number(h1.trim());

  let v0 = document.getElementById('v0').value || 0;
  v0 = Number(v0.trim());

  let theta_deg = document.getElementById('theta').value || 0;
  theta_deg = Number(theta_deg.trim());

  return { h0, h1, v0, theta_deg };
}

function calculateMaxHeight({ v0, theta_rad, h0 }) {
  let hmax = Math.pow((v0 * Math.sin(theta_rad)), 2);
  hmax = hmax / (2 * g);
  hmax = Number(hmax) + Number(h0);

  return hmax.toFixed(5);
}

function calculateTotalTime({ v0, theta_rad, hmax, h1 }) {
  let t_subida = v0 * Math.sin(theta_rad) / g;

  let t_descida;
  t_descida = (hmax - h1) * 2 / g;

  if (t_descida < 0) {
    return errorFound();
  }

  t_descida = Math.sqrt(t_descida);

  let t_total = Number(t_subida) + Number(t_descida);
  t_total = t_total.toFixed(5);

  return { t_subida, t_descida, t_total };
}

function plotDisplacement({ t_subida, t_total, v0, theta_rad, h0, hmax, incremento }) {
  const velocidade_horizontal = v0 * Math.cos(theta_rad);
  let array_posicao_horizontal = new Array();

  const velocidade_vertical = v0 * Math.sin(theta_rad);
  let array_posicao_vertical = new Array();

  for (let cont = 0; cont <= t_total; cont += incremento) {
    let resultX = 0;
    let resultY = 0;
    resultX = Number(velocidade_horizontal * cont);
    array_posicao_horizontal.push(resultX.toFixed(2));

    if (cont <= t_subida) {
      resultY = h0 + (velocidade_vertical * cont);
      resultY -= (0.5 * g * Math.pow(cont, 2));
    } else {
      let customTime = cont - t_subida;
      resultY = hmax - (0.5 * g * Math.pow(customTime, 2));
    }
    array_posicao_vertical.push(resultY.toFixed(2));
  }

  return displayDisplacementChart({
    array_posicao_horizontal,
    array_posicao_vertical
  });
}

function plotVelocities({ t_subida, t_total, v0, theta_rad, incremento }) {
  const array_tempo = new Array();
  const array_velocidade_horizontal = new Array();
  const array_velocidade_vertical = new Array();
  const velocidade_horizontal = v0 * Math.cos(theta_rad);
  const velocidade_vertical_inicial = v0 * Math.sin(theta_rad);

  for (let cont = 0; cont <= t_total; cont += incremento) {
    array_tempo.push(cont.toFixed(2));
    array_velocidade_horizontal.push(velocidade_horizontal.toFixed(2));

    let velocidadeVertical = 0;
    if (cont <= t_subida) {
      velocidadeVertical = velocidade_vertical_inicial - (g * cont);
    } else {
      let customTime = cont - t_subida;
      velocidadeVertical = g * customTime;
    }
    array_velocidade_vertical.push(velocidadeVertical.toFixed(2));
  }

  return displayVelocitiesChart({
    array_tempo,
    array_velocidade_horizontal,
    array_velocidade_vertical
  })
}

function errorFound() {
  return alert('Parâmetros incorretos');
}

document.querySelector('#calcular').addEventListener('click', calculateAndPlot);

document.querySelector('#pointsQuantity').addEventListener('change', () => {
  const rangeValue = document.querySelector('#pointsQuantity').value;
  const inputRangeString = `Quantidade de pontos nos gráficos: ${rangeValue}`;
  return document.querySelector('#showInputRangeValue').innerHTML = inputRangeString;
});

// ================================
// Gráficos

let chartVelocity;

function displayVelocitiesChart({
  array_tempo,
  array_velocidade_horizontal,
  array_velocidade_vertical
}) {
  const ctx = document.querySelector('#velocidades');
  ctx.className = '';

  if (chartVelocity) {
    chartVelocity.destroy();
  }

  chartVelocity = new Chart(ctx, {
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

  return { ok: true };
}

let chartDisplacement;

function displayDisplacementChart({
  array_posicao_horizontal,
  array_posicao_vertical
}) {
  const ctx = document.querySelector('#deslocamento');
  ctx.className = '';

  if (chartDisplacement) {
    chartDisplacement.destroy();
  }

  chartDisplacement = new Chart(ctx, {
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

  return { ok: true };
}