let map;

document.addEventListener("DOMContentLoaded", function () {
    const tabla_datos = document.getElementById('tabla_datos').getElementsByTagName('tbody')[0].rows;

    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
            }),
        ],
        view: new ol.View({
            center: ol.proj.transform([-72.265911, 3.7644111], 'EPSG:4326', 'EPSG:3857'),
            zoom: 5,
        }),
    });

    map.on('click', function (evt) {
        let coordinates = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
        let latitud = coordinates[1];
        let longitud = coordinates[0];

        console.log("Latitud:", latitud);
        console.log("Longitud:", longitud);

        fetchWeatherData(latitud, longitud);
    });

    const historialBusquedas = [];

    async function fetchWeatherData(latitude, longitude) {
        try {
            const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status}`);
            }

            const data = await response.json();

            console.log("Datos recibidos:", data);

            updateTable(data, latitude, longitude);

            return data;
        } catch (error) {
            console.error('Error al obtener los datos del clima:', error);
            alert('Error al obtener los datos del clima. Intente nuevamente.');
            return null;
        }
    }

    function updateTable(data, latitude, longitude) {
        tabla_datos[0].cells[1].textContent = latitude.toFixed(4);
        tabla_datos[1].cells[1].textContent = longitude.toFixed(4);
        const { temperature_2m: currentTemp, relative_humidity_2m: currentHum } = data.current;
        const { temperature_2m: tempUnit, relative_humidity_2m: humUnit } = data.current_units;

        tabla_datos[2].cells[1].textContent = `${currentTemp} ${tempUnit}`;
        tabla_datos[3].cells[1].textContent = `${currentHum} ${humUnit}`;

        addToHistorial(latitude, longitude, currentTemp, currentHum);
    }

    function addToHistorial(lat, lon, temp, hum) {
        const busqueda = {
            latitud: lat.toFixed(4),
            longitud: lon.toFixed(4),
            temperatura: temp,
            humedad: hum
        };

        historialBusquedas.unshift(busqueda);
        updateHistorialUI();
    }

    function updateHistorialUI() {
        const tabla_historial = document.getElementById('tabla_historial');
        let tbody = tabla_historial.querySelector('tbody') || document.createElement('tbody');
        if (!tabla_historial.contains(tbody)) {
            tabla_historial.appendChild(tbody);
        }

        tbody.innerHTML = '';
        historialBusquedas.forEach(({ latitud, longitud, temperatura, humedad }) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `<td>${latitud}</td><td>${longitud}</td><td>${temperatura}</td><td>${humedad}</td>`;
            tbody.appendChild(fila);
        });
    }
});
