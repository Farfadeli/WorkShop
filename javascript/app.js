var btn_search = document.querySelector(".search-img")
const jawg_token = "N1uVYnPVmj0iA07z8SwayLjB16RYD5UAAT9pO95rx9onVXITuIkxTOnefZKasAVl"

const success = (loc) => {
    var current_lat = loc.coords.latitude
    var current_lon = loc.coords.longitude
    parseaddress(document.querySelector("input").value, current_lat, current_lon)
    //calculateItineraire(loc.coords.latitude, loc.coords.longitude, 43.629410, 1.481505)
}

const getCurrentPos = () => {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(
        success
        ,
        console.error("erreur"),
        options
    )
}
btn_search.addEventListener("click", () => {
    getCurrentPos()
})

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Convertir les degrés en radians
    const deg2rad = (deg) => deg * (Math.PI / 180);

    // Rayon de la Terre en kilomètres
    const R = 6371;

    // Convertir les latitudes et longitudes en radians
    const radLat1 = deg2rad(lat1);
    const radLon1 = deg2rad(lon1);
    const radLat2 = deg2rad(lat2);
    const radLon2 = deg2rad(lon2);

    // Différence de latitudes et de longitudes
    const dLat = radLat2 - radLat1;
    const dLon = radLon2 - radLon1;

    // Formule de la haversine pour calculer la distance
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}


async function calculateItineraire(lat1, lon1, lat2, lon2) {
    const url = `https://trueway-directions2.p.rapidapi.com/FindDrivingRoute?stops=${lat1}%2C${lon1}%3B${lat2}%2C${lon2}`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '666972faa6msh21f2578098d6f57p1682f0jsna6288611fea3',
            'X-RapidAPI-Host': 'trueway-directions2.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options);
        var geometry = await response.json();
        var elem = geometry.route.geometry.coordinates
    } catch (error) {
        console.error(error);
    }
    var res = []
    for (let e = 0; e != elem.length; e++) {
        res.push([elem[e][1], elem[e][0]])
    }
    console.log(res[1])


    document.getElementById("map").classList.remove("none")
    const map = new maplibregl.Map({
        container: "map",
        style: `https://api.jawg.io/styles/jawg-dark.json?access-token=${jawg_token}`,
        zoom: 10,
        center: [res[0][1], res[0][0]],
        hash: true,
    }).addControl(new maplibregl.NavigationControl(), "top-right");
    maplibregl.setRTLTextPlugin("https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js");
    const geoJsonFeature = {
        type: "Feature",
        properties: {},
        geometry: {
            type: "LineString",
            coordinates: res,
        },
    };

    console.log(geoJsonFeature)
    map.on("load", function () {
        map.addLayer({
            id: "route",
            type: "line",
            source: {
                type: "geojson",
                data: geoJsonFeature,
            },
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": "steelblue",
                "line-width": 4,
            },
        });
    });
}

const parseaddress = (address, current_lat, current_lon) => {
    var n = address.split(" ")
    var res = ""
    for (let e = 0; e != n.length; e++) {
        res += n[e]
        if (e != n.length - 1) {
            res += "+"
        }
    }
    console.log(res)
    return getAdresseCoord(res, current_lat, current_lon)
}

async function getAdresseCoord(adresse, current_lat, current_lon) {


    fetch(`https://api-adresse.data.gouv.fr/search/?q=${adresse}`)
        .then(res => {
            if(!res.ok){
                console.error("erreur 1")
            }
            return res.json()
        })
        .then(
            r => {
                latitude = r.features[0].geometry.coordinates[0]
                longitude = r.features[0].geometry.coordinates[1]
                console.log(latitude,longitude," and ", current_lat, current_lon)


                const url = `https://trueway-directions2.p.rapidapi.com/FindDrivingRoute?stops=${current_lat}%2C${current_lon}%3B${longitude}%2C${latitude}`;

                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '666972faa6msh21f2578098d6f57p1682f0jsna6288611fea3',
                        'X-RapidAPI-Host': 'trueway-directions2.p.rapidapi.com'
                    }
                };

                return fetch(url,options)
            }
        ).then( async rep => {

            return rep.json();

        })
        .then(data =>{
            var geo = data.route.geometry.coordinates

            try {
                var res = []
                for (let e = 0; e != geo.length; e++) {
                    res.push([geo[e][1], geo[e][0]])
                }
                console.log(res[1])
        
                document.querySelector("header").classList.add("none")
                document.getElementById("map").classList.remove("none")
                const map = new maplibregl.Map({
                    container: "map",
                    style: `https://api.jawg.io/styles/jawg-dark.json?access-token=${jawg_token}`,
                    zoom: 10,
                    center: [current_lon, current_lat],
                    hash: true,
                }).addControl(new maplibregl.NavigationControl(), "top-right");
                maplibregl.setRTLTextPlugin("https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js");
                const geoJsonFeature = {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: res,
                    },
                };
        
                console.log(geoJsonFeature)
                map.on("load", function () {
                    map.addLayer({
                        id: "route",
                        type: "line",
                        source: {
                            type: "geojson",
                            data: geoJsonFeature,
                        },
                        layout: {
                            "line-join": "round",
                            "line-cap": "round",
                        },
                        paint: {
                            "line-color": "steelblue",
                            "line-width": 4,
                        },
                    });
                });
            } catch (error) {
                console.error(error);
            }
        })

    
}
