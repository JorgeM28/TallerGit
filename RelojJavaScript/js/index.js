// Función para mostrar y actualizar el reloj
function reloj() {
    let fecha = new Date();
    let hora = fecha.getHours();
    let minutos = fecha.getMinutes();
    let segundos = fecha.getSeconds();

    document.getElementById("reloj").innerText = ""+ hora + ":" + minutos + ":" + segundos;

    setTimeout(reloj, 1000);
}
reloj();
setInterval(reloj, 1000);
