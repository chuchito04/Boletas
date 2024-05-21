async function fetchJsonData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error en el fetch");
  
      }

      return await response.json();
      
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  const validarSesion = document.getElementById("validarSesion");
  function validarPin() {
    const pin = getCookieValue("pin");
    console.log(pin);
    if (pin === null || pin === "" || pin === undefined || !pin) {
        window.location.href = "/";
    }
  }
  
  document.addEventListener("DOMContentLoaded", function() {

    validarPin();  // Llamar a la función validarPin inmediatamente al cargar la página.

    
    if (validarSesion) {  // Verificar que el elemento existe antes de agregar el event listener.
        validarSesion.addEventListener("click", (e) => {
            e.preventDefault();
            validarPin();
        });
    }
    });

 



  function getCookieValue(name) {
    // Construir el nombre de la cookie seguido de "="
    let nameEQ = name + "=";
    // Obtener todas las cookies en un array
    let cookiesArray = document.cookie.split(';');
    
    // Iterar sobre cada cookie
    for(let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i];
        // Eliminar espacios en blanco al inicio
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        // Si la cookie empieza con el nombre buscado
        if (cookie.indexOf(nameEQ) == 0) {
            // Retornar el valor de la cookie
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    // Si no se encuentra la cookie, retornar null
    return null;
}

    const logout = document.getElementById("logout");
    logout.addEventListener("click", (e) => {
        e.preventDefault();
        document.cookie = "pin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/";
    });


    const partidos = document.getElementById("partidos");
    const formulario = document.getElementById("formulario");
    const tipoBoleta = document.getElementById("tipoBoleta");

    tipoBoleta.addEventListener("change", () => {
        partidos.click();
    });

    partidos.addEventListener("click", async (e) => {
        e.preventDefault();
        const tipoboleta = document.getElementById("tipoBoleta").value;
        const id_municipio = document.getElementById("municipio").value;

       // console.log("boleta", tipoboleta);
        //console.log("municipio: " , id_municipio);
    
        const partidosData = await fetchJsonData("https://contactocoahuila.purpuraamerida.com/atencion/boletas/consultaPartidos/" + tipoboleta + "-" + id_municipio);
    
        //console.log(partidosData);
        formulario.innerHTML = '';

        partidosData.forEach(partido => {
            const partidoElement = document.createElement('div');
            partidoElement.innerHTML = `
            <div class="p-10 bg-white rounded-xl flex flex-col justify-center items-center shadow-md">
                <img src="/${partido}.png" alt="${partido}" class=" w-32 h-32 object-cover" >
                <input type="checkbox" name="${partido}" id="${partido}" class="w-24 h-12 mt-4">
            </div>
            `;
            
            formulario.appendChild(partidoElement);
            
        });
        formulario.innerHTML += `<div class="p-2 bg-white rounded-xl flex flex-col justify-center items-center">
            <label for="libre" class="text-xl font-bold">Escriba acá si existe candidato libre:</label>
            <input class="border bg-gray-200 text-center" type="text" name="libre" id="libre">
            </div> `;
            
       
        document.getElementById("guardar").classList.remove("hidden");
        document.getElementById("folioInput").classList.remove("hidden");
        
    });

    const guardar = document.getElementById("guardar");
    guardar.addEventListener("click", async (e) => {
        e.preventDefault();

        let checked = document.querySelectorAll('input[type="checkbox"]:checked');
        console.log(checked);
        let datos = [];
        for (let i = 0; i < checked.length; i++) {
            console.log(checked[i].id);
            datos.push(checked[i].id);
        }

        const datosEnviar = {
            id_usuario: getCookieValue("pin"),
            tipo_boleta: document.getElementById("tipoBoleta").value,
            id_municipio: document.getElementById("municipio").value,
            partidos: datos,
            folio: document.getElementById("folio").value,
            libre: document.getElementById("libre").value

        }
        
        console.log(datosEnviar);

        if (folio.value === "") {
            alert("Favor de ingresar el folio");
            return;
        }
        try {
            const response = await fetch("https://contactocoahuila.purpuraamerida.com/atencion/boletas/capturar", {
                method: 'POST',
                body: JSON.stringify(datosEnviar)
            });

            if (!response.ok) {
                throw new Error("Error en la solicitud POST");
            }
            alert("Datos guardados correctamente");
            const result = await response;
            console.log('Datos guardados:', result);
        }   catch (error) {
            console.error("Error al guardar los datos:", error);
        }
    
            const inputs = formulario.querySelectorAll('input');
            const folioInput = document.getElementById("folio");
            inputs.forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else if (input.type === 'text'){
                    input.value = '';
                }
            });

            folioInput.value = '';
        
        

    });
    

