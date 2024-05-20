import "./GoogleMapsAPI.js";

// inicializa mapa
let map;
let marker;
let pos = {
    lat: 20.84394190349989,
    lng: -89.02014292770954
};
let arrayPoligonos = [];
let arrayPoligonosSecciones = [];

let municipio;
let distrito_f;
let distrito_l;



obtenerUbicacion()
//initMap();
async function initMap() {
    const position = pos;
    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
        mapId: "PROYECTO_MAPS",
        zoom: 18,
        center: position,
        gestureHandling: 'greedy'
    });

    // Agregar marcador inicial
    const iconMarker = document.createElement("img");
    iconMarker.src = "/corazon.webp";
    iconMarker.width = "30";

    marker = new AdvancedMarkerElement({
        map,
        position: pos,
        gmpDraggable: true,
        content: iconMarker,
        title: "Esta es su ubicación actual"
    });

    marker.addListener("dragend", (event) => {
        const positionMarker = marker.position;        
        consultaMunicipios(map, positionMarker);
    });


    map.data.loadGeoJson('/geojson/municipios.geojson');

    map.data.setStyle({
        visible: false
    });
    setTimeout(function () {
        //consultaMunicipios(map, position);

        fetch('/geojson/seccionesINE.geojson')
                .then(response => response.json())
                .then(data => {
                    //console.log(data);
                    for (const feature of data.features) {
                        // Acceder a las propiedades de cada característica
                        const properties = feature.properties;
                        const geometry = feature.geometry;
                        //console.log(geometry)
                        var municipioINE = feature.properties.MUNICIPIO;
                            var pathPoligonosSecciones = []
                            var coordinates = geometry.coordinates[0];

                            for(var x = 0; x < coordinates[0].length; x++){
                                pathPoligonosSecciones.push({ lat: coordinates[0][x][1], lng: coordinates[0][x][0] });
                            }

                            // Crear Polígono
                            var poligonoSeccion = new google.maps.Polygon({
                                paths: pathPoligonosSecciones,
                                strokeColor: "#27AE60",
                                strokeWeight: 2,
                                fillColor: "#73C6B6",
                            });
                            arrayPoligonosSecciones.push(poligonoSeccion);

                            if (google.maps.geometry.poly.containsLocation(position, poligonoSeccion)) {
                                poligonoSeccion.setMap(map);
                                console.log(feature.properties.MUNICIPIO, feature.properties.DISTRITO_F, feature.properties.DISTRITO_L)
                                recolectarDatos(feature.properties.MUNICIPIO, feature.properties.DISTRITO_F, feature.properties.DISTRITO_L)
                                break;
                            }
                    };
                })
                .catch(error => {
                    console.error('Error al cargar el archivo GeoJSON:', error);
                });
    }, 1000);
    
}

// Función para resaltar un solo municipio
function consultaMunicipios(map, position) {
    if (arrayPoligonos.length > 0) {
        borrarPoligonos(arrayPoligonos);
        borrarPoligonos(arrayPoligonosSecciones);
    }
    map.data.forEach(function (feature) {
        var description = feature.getProperty('NOMBRE');
        var id_municipio = feature.getProperty('MUNICIPIO');
        var geometry = feature.getGeometry();
        var seccion = feature.getProperty('SECCION');
        var distrito_f = feature.getProperty('DISTRITO_F');
        var distrito_l = feature.getProperty('DISTRITO_L');
        var pathPoligonos = [];

        if (geometry.getType() === 'MultiPolygon') {
            geometry.getArray().forEach(function (polygon) {
                polygon.getArray().forEach(function (path) {
                    path.getArray().forEach(function (coord) {
                        pathPoligonos.push({ lat: coord.lat(), lng: coord.lng() });
                    });
                });
            });

            // Crear Polígono
            var poligono = new google.maps.Polygon({
                paths: pathPoligonos,
                strokeColor: "#FF5733",
                strokeWeight: 2,
                fillColor: "#FFC300",
            });

            arrayPoligonos.push(poligono);

            // Verificar si el punto se encuentra dentro de qué municipio
            if (google.maps.geometry.poly.containsLocation(position, poligono)) {
                /* console.log("El punto se encuentra dentro de Municipio: " + description + " id: " + id_municipio + " sección: " + seccion + " distrito federal: " + distrito_f + " distrito local: " + distrito_l); */
                poligono.setMap(map);
                recolectarDatos(description,distrito_f,distrito_l);

                fetch('/geojson/seccionesINE.geojson')
                .then(response => response.json())
                .then(data => {
                    //console.log(data);
                    for (const feature of data.features) {
                        // Acceder a las propiedades de cada característica
                        const properties = feature.properties;
                        const geometry = feature.geometry;
                        //console.log(geometry)
                        var municipioINE = feature.properties.MUNICIPIO;
                        if(municipioINE == id_municipio){
                            var pathPoligonosSecciones = []
                            var coordinates = geometry.coordinates[0];

                            for(var x = 0; x < coordinates[0].length; x++){
                                pathPoligonosSecciones.push({ lat: coordinates[0][x][1], lng: coordinates[0][x][0] });
                            }

                            // Crear Polígono
                            var poligonoSeccion = new google.maps.Polygon({
                                paths: pathPoligonosSecciones,
                                strokeColor: "#27AE60",
                                strokeWeight: 2,
                                fillColor: "#73C6B6",
                            });
                            arrayPoligonosSecciones.push(poligonoSeccion);

                            if (google.maps.geometry.poly.containsLocation(position, poligonoSeccion)) {
                                poligonoSeccion.setMap(map);
                                console.log(feature.properties.MUNICIPIO, feature.properties.DISTRITO_F, feature.properties.DISTRITO_L)
                                recolectarDatos(feature.properties.MUNICIPIO, feature.properties.DISTRITO_F, feature.properties.DISTRITO_L)
                                break;
                            }
                        }
                    };
                })
                .catch(error => {
                    console.error('Error al cargar el archivo GeoJSON:', error);
                });

            }
        }
    });
}

function recolectarDatos(datamunicipio, datadistrito_f, datadistrito_l) {
    //console.log("inicio recolectar datos");

    if (datamunicipio !== null) {
        municipio = datamunicipio;
        document.cookie = "municipio=" + municipio + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    }
    if (datadistrito_f !== undefined) {
        distrito_f = datadistrito_f;
        document.cookie = "distrito_f=" + distrito_f + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    }
    if (datadistrito_l !== undefined) {
        distrito_l = datadistrito_l;
        document.cookie = "distrito_l=" + distrito_l + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    }
}


function borrarPoligonos(arrayPol) {
    arrayPol.forEach(function (poligono) {
        poligono.setMap(null);
    });
}

//Obtener la ubicación por medio del navegador

function obtenerUbicacion() {
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
            (position) => {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                initMap()
            },
            () => {
                handleLocationError(true, map.getCenter());
            }
        );
    } else {
        handleLocationError(false, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    console.log('The Geolocation service failed.')
    obtenerUbicacion();
}

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

async function getCasillas(){
    const data = await fetchJsonData(
        "https://contactocoahuila.purpuraamerida.com/atencion/politica/casillas2024/1184",
    );
    console.log(data);}
getCasillas();