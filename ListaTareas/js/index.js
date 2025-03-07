/* Codigo javascript gestionar una lista de tareas 
1. El usuario debe poder ingresar tareas.
2. El usuario debe poder marcar tareas como completadas al hacer click en ellas.
3. El usuario debe poder marcar tareas como no completadas al hacer click en ellas cuando estan completadas 
(por defecto las tareas agregadas están no completadas).
4. El usuario debe poder ver la lista de tareas.
*/

let listaTareas = [];
let estadoTareas = []; // Array para guardar el estado de las tareas (completada o no)

//Función para agregar una tarea a la lista
function agregarTarea() {
    let tarea = document.getElementById("inputTarea").value;
    
    // Validar que la tarea no esté vacía
    if (tarea.trim() === "") {
        alert("Por favor, ingresa una tarea válida");
        return;
    }
    
    listaTareas.push(tarea);
    estadoTareas.push(false); // Por defecto, la tarea está no completada (false)
    document.getElementById("inputTarea").value = "";
    mostrarTareas();
}

//Función para mostrar la lista de tareas
function mostrarTareas() {
    let lista = document.getElementById("listaTareas");
    lista.innerHTML = "";
    
    for (let i = 0; i < listaTareas.length; i++) {
        let item = document.createElement("li");
        item.innerText = listaTareas[i];
        
        // Verificar el estado de la tarea y aplicar la clase correspondiente
        if (estadoTareas[i]) {
            item.classList.add("completada");
        } else {
            item.classList.add("noCompletada");
        }
        
        // Agregar el índice como atributo personalizado para identificar la tarea
        item.setAttribute("data-index", i);
        
        // Agregar evento de clic para cambiar el estado de la tarea
        item.addEventListener("click", cambiarEstadoTarea);
        
        lista.appendChild(item);
    }
}

//Función para cambiar el estado de una tarea (completada/no completada)
function cambiarEstadoTarea(event) {
    // Obtener el índice de la tarea
    let indice = event.target.getAttribute("data-index");
    
    // Cambiar el estado de la tarea (toggle)
    estadoTareas[indice] = !estadoTareas[indice];
    
    // Actualizar la visualización
    mostrarTareas();
}

// Evento para agregar tarea al presionar Enter en el input
document.getElementById("inputTarea").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        agregarTarea();
    }
});

//Agregar el evento click al botón
document.getElementById("btnAgregarTarea").addEventListener("click", agregarTarea);