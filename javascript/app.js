let btn = document.querySelector("#btn-test")

const success = (loc) =>{
    console.log(loc.coords)
}

const getCurrentPos = () =>{
    navigator.geolocation.getCurrentPosition(
        success
    )
}
btn.addEventListener("click", () => {
    getCurrentPos()
})