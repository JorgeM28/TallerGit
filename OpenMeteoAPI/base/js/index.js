/*
Consumir el endPoint de la API del clima Open-Meteo: 
- https://open-meteo.com/
- https://open-meteo.com/en/docs
- Ejemplo de petición
https://api.open-meteo.com/v1/forecast?latitude=7.1254&longitude=-73.1198&current=temperature_2m&hourly=temperature_2m&timezone=auto&past_days=3&forecast_days=3


Características para desarrollar: 
 - Cuando el sitio cargue se debe mostrar un gráfico con datos de prueba y la tabla sin datos
 - Cuando el usuario de click al botón buscar se debe hacer la solicitud de los datos a la API
 - Al recibir la respuesta del servidor se deben mapear los datos en la tabla y en el gráfico.
 - En caso de no encontrar datos o presentar un error se debe reportar por consola"
*/

// Selección de elementos del DOM
const buscarButton = document.getElementById('buscar_datos');
const latitudInput = document.getElementById('latitud');
const longitudInput = document.getElementById('longitud');

// Elementos de la tabla para actualizar
const vLat = document.getElementById('v_lat');
const vLong = document.getElementById('v_long');
const vAlt = document.getElementById('v_alt');
const vZone = document.getElementById('v_zone');
const vTemp = document.getElementById('v_temp');
const vHour = document.getElementById('v_hour');

// Inicialización del gráfico con datos de prueba
const ctx = document.getElementById('grafico');
let weatherChart;

// Función para inicializar el gráfico con datos de prueba
function initChart() {
  weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['2025-03-02T00:00', '2025-03-02T01:00', '2025-03-02T02:00', '2025-03-02T03:00', '2025-03-02T04:00'],
      datasets: [{
        label: 'Temperatura (°C)',
        data: [20.3, 20.5, 20.3, 20.1, 19.9, 19.7],
        borderWidth: 2,
        borderColor: 'rgb(22, 100, 23)',
        backgroundColor: 'rgba(74, 151, 40, 0.2)',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Temperatura (°C)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Tiempo'
          }
        }
      }
    }
  });
}

// Función para formatear la fecha y hora
function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  return date.toLocaleString();
}

// Función para formatear solo la hora de una fecha
function formatHourFromDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString();
}

// Función para formatear las etiquetas del gráfico (solo muestra la hora)
function formatTimeLabels(dateTimeArray) {
  return dateTimeArray.map(dateTime => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
}

// Función para actualizar el gráfico con nuevos datos
function updateChart(timeLabels, temperatureData) {
  // Destruir el gráfico anterior si existe
  if (weatherChart) {
    weatherChart.destroy();
  }
  
  // Crear un nuevo gráfico con los datos actualizados
  weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: formatTimeLabels(timeLabels),
      datasets: [{
        label: 'Temperatura (°C)',
        data: temperatureData,
        borderWidth: 2,
        borderColor: 'rgb(22, 100, 23)',
        backgroundColor: 'rgba(74, 151, 40, 0.2)',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Temperatura (°C)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Tiempo'
          }
        }
      }
    }
  });
}

// Función para actualizar la tabla con los datos actuales
function updateTable(data) {
  vLat.textContent = data.latitude.toFixed(4);
  vLong.textContent = data.longitude.toFixed(4);
  vAlt.textContent = data.elevation + ' m';
  vZone.textContent = data.timezone;
  vTemp.textContent = data.current.temperature_2m + ' ' + data.current_units.temperature_2m;
  vHour.textContent = formatDateTime(data.current.time);
}

// Función para obtener los datos del clima desde la API
async function fetchWeatherData(latitude, longitude) {
  try {
    // Construir la URL de la API con los parámetros
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&timezone=auto&past_days=1&forecast_days=2`;
    
    // Realizar la petición a la API
    const response = await fetch(apiUrl);
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }
    
    // Convertir la respuesta a JSON
    const data = await response.json();
    
    // Actualizar la tabla con los datos recibidos
    updateTable(data);
    
    // Actualizar el gráfico con los datos horarios
    // Tomamos los últimos 24 elementos del array (1 día)
    const hourlyTime = data.hourly.time.slice(-24);
    const hourlyTemp = data.hourly.temperature_2m.slice(-24);
    updateChart(hourlyTime, hourlyTemp);
    
    return data;
  } catch (error) {
    console.error('Error al obtener los datos del clima:', error);
    return null;
  }
}

// Event Listener para el botón de buscar
buscarButton.addEventListener('click', async () => {
  // Obtener los valores de latitud y longitud
  const latitude = parseFloat(latitudInput.value);
  const longitude = parseFloat(longitudInput.value);
  
  // Validar que los valores sean números válidos
  if (isNaN(latitude) || isNaN(longitude)) {
    console.error('Por favor, ingrese valores numéricos válidos para latitud y longitud.');
    return;
  }
  
  // Obtener los datos del clima
  const weatherData = await fetchWeatherData(latitude, longitude);
  
  if (!weatherData) {
    console.error('No se pudieron obtener los datos del clima.');
  }
});

// Inicializar el gráfico cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar el gráfico con datos de prueba
  initChart();
});