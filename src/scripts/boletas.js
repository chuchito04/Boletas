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


    const partidos = document.getElementById("partidos");
    const formulario = document.getElementById("formulario");
    partidos.addEventListener("click", async (e) => {
        e.preventDefault();
        const tipoboleta = document.getElementById("tipoBoleta").value;
        const id_municipio = document.getElementById("municipio").value;

        console.log("boleta", tipoboleta);
        console.log("municipio: " , id_municipio);
    
        const partidosData = await fetchJsonData("https://contactocoahuila.purpuraamerida.com/atencion/boletas/consultaPartidos/" + tipoboleta + "-" + id_municipio);
    
        console.log(partidosData);
        formulario.innerHTML = '';

        partidosData.forEach(partido => {
            const partidoElement = document.createElement('div');
            partidoElement.className = 'partido';
            
            partidoElement.innerHTML = `
               
            `;
            
            formulario.appendChild(partidoElement);
        });
        
    
    });
    

