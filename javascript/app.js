let btn = document.querySelector("#btn-test")

const success = (loc) =>{
    console.log(calculateDistance(loc.coords.latitude, loc.coords.longitude, 43.630362, 1.480419))
}

const getCurrentPos = () =>{
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
    navigator.geolocation.getCurrentPosition(
        success,
        console.error("erreur"),
        options
    )
}
btn.addEventListener("click", () => {
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