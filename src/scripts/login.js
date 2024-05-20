

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



const login = document.getElementById("login");
login.addEventListener("click", async (e) => {
    e.preventDefault();
    
    const pin = document.getElementById("pin").value;

    const data = await fetchJsonData("https://contactocoahuila.purpuraamerida.com/atencion/boletas/validaPin/" + pin);

    console.log(data);

    if (data.resultado == "1") {
        document.cookie = "pin=" + pin + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
        window.location.href = "/capturaBoleta";
    }
    else {
        alert("Credenciales incorrectas");
    }

});
