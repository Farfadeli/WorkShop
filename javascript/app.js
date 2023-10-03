let btn = document.querySelector("#btn-test")

const success = (loc) =>{
    console.log(lo.coords)
}

const getCurrentPos = () =>{
    navigator.geolocation.getCurrentPosition(
        success
    )
}
btn.addEventListener("click", () => {
    getCurrentPos()
})