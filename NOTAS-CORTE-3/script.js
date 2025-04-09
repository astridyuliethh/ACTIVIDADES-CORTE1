// Esperar a que el contenido del DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // Obtener referencias a los elementos del DOM
    const primerCorteInput = document.getElementById("primerCorte");
    const segundoCorteInput = document.getElementById("segundoCorte");
    const calculateButton = document.getElementById("calculateButton");
    const resultadoDiv = document.getElementById("resultado");

    // Función para calcular la nota necesaria
    function calcularNota() {
        // Limpiar clases de estilo previas del resultado
        resultadoDiv.classList.remove('error', 'success');

        // Obtener y convertir los valores de los inputs a números flotantes
        const primerCorte = parseFloat(primerCorteInput.value);
        const segundoCorte = parseFloat(segundoCorteInput.value);

        // Validar que las notas estén dentro del rango permitido (0 a 5)
        if (isNaN(primerCorte) || isNaN(segundoCorte) || primerCorte < 0 || primerCorte > 5 || segundoCorte < 0 || segundoCorte > 5) {
            resultadoDiv.textContent = "Error: Las notas deben ser números entre 0 y 5.";
            resultadoDiv.classList.add('error'); // Añadir clase de error
            return; // Detener la ejecución si hay error
        }

        // Calcular los porcentajes acumulados
        const porcentajePrimerCorte = primerCorte * 0.3;
        const porcentajeSegundoCorte = segundoCorte * 0.3;

        // Calcular la nota necesaria en el tercer corte (que vale 40% -> 0.4)
        // La nota final mínima para aprobar es 3.0
        // NotaFinal = (Nota1 * 0.3) + (Nota2 * 0.3) + (Nota3 * 0.4)
        // 3.0 = porcentajePrimerCorte + porcentajeSegundoCorte + (Nota3 * 0.4)
        // Nota3 = (3.0 - porcentajePrimerCorte - porcentajeSegundoCorte) / 0.4
        const notaNecesaria = (3.0 - porcentajePrimerCorte - porcentajeSegundoCorte) / 0.4;

        // Mostrar el resultado según la nota necesaria calculada
        if (notaNecesaria > 5) {
            resultadoDiv.textContent = `No es posible pasar la materia incluso con un 5. Necesitarías un ${notaNecesaria.toFixed(2)} en el tercer corte.`;
            resultadoDiv.classList.add('error'); // Añadir clase de error
        } else if (notaNecesaria <= 0) {
            resultadoDiv.textContent = "¡Felicidades! Ya has aprobado la materia (nota necesaria <= 0).";
            resultadoDiv.classList.add('success'); // Añadir clase de éxito
        } else {
            resultadoDiv.textContent = `Necesitas sacar ${notaNecesaria.toFixed(2)} en el Tercer Corte para aprobar con 3.0.`;
            resultadoDiv.classList.add('success'); // Añadir clase de éxito/informativa
        }
    }

    // Añadir el 'escuchador' de eventos al botón
    // Cuando se haga clic en el botón, se ejecutará la función calcularNota
    if (calculateButton) {
        calculateButton.addEventListener('click', calcularNota);
    } else {
        console.error("Error: Botón con id 'calculateButton' no encontrado.");
    }

    // Opcional: Calcular al presionar Enter en los campos de nota
    primerCorteInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            calcularNota();
        }
    });
    segundoCorteInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            calcularNota();
        }
    });

}); // Fin del DOMContentLoaded