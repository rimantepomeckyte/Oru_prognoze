// https://api.meteo.lt/v1/places
//https://api.meteo.lt/v1/places/vilnius
// https://api.meteo.lt/v1/places/vilnius/forecasts/long-term

const searchInput = document.getElementById("searchCity");
const searchBtn = document.getElementById("searchBtn");
const cityNamePlace = document.getElementById("cityNamePlace");
const suggestionsList = document.getElementById("suggestionsList")
const dienuTevas = document.getElementById("dienuTevas")
const valanduTevas = document.getElementById("valandiniuTevas");

//-------Vietoves ikelimas pagal paieska i h4----------
const visiMiestai = async () => {
    console.log("Labas")
    console.log(searchInput.value)
    try {
        const response = await fetch(`https://api.meteo.lt/v1/places/${searchInput.value}`);
        const data = await response.json();
        // console.log(data);

        if (searchInput.value == data.code) {
            cityNamePlace.innerHTML = data.name
        }
    } catch (error) {
        console.log("KAzkas negerai!")
        console.log(error);
    }
}
searchBtn.addEventListener("click", visiMiestai);
visiMiestai();

//---------------Dienu ikelimas i html ------------------------
const oruPrognoze = async () => {
    try {
        console.log("labas orai!");
        console.log(searchInput.value)
        const response = await fetch(`https://api.meteo.lt/v1/places/${searchInput.value}/forecasts/long-term`);
        const data = await response.json();
        console.log(data);

        const naujosDatos = data.forecastTimestamps.map(diena => {
            const manoDatos = diena.forecastTimeUtc.split(" ")
            return manoDatos[0];
        })
        //console.log(naujosDatos);
        const uniq = naujosDatos.reduce(function (a, b) {
            if (a.indexOf(b) < 0) a.push(b);
            return a;
        }, []);
        console.log(uniq);
        uniq.forEach(a => {
            const finalDate = new Date(a).toDateString();
            console.log(finalDate);
            const divDays = document.createElement("div");
            divDays.id = a;
            divDays.setAttribute("class", "col-2 text-center");
            divDays.style.height = "4rem";
            divDays.style.borderRight = "1px gray solid";
            divDays.style.backgroundColor = "green"; // darbui tik
            dienuTevas.appendChild(divDays);
            if(divDays.id === uniq[0]){
                divDays.innerHTML = "Today";
            }else {
            divDays.innerHTML = finalDate;}
            /*divDays.addEventListener("click", rodykOrus)
            function rodykOrus (){
                 data.forecastTimestamps.forEach(oras => {
                     // console.log(oras);
                     for (let i=0, j=0; i<naujosDatos.length; i++){
                         if(naujosDatos[i] === uniq[j]){
                             console.log("krabas as gaslksdk")
                             const divHours = document.createElement("div");
                             divHours.innerHTML = `<p>${oras.forecastTimeUtc}</p>
                       <p>${oras.airTemperature}</p>
                       <p>Humidity: ${oras.relativeHumidity}%</p>
                       <p>${oras.totalPrecipitation}</p>`
                             valanduTevas.appendChild(divHours);
                         }
                     }
                 })
             }*/
        })



    } catch (error) {
        console.log(error);
    }
}
searchBtn.addEventListener("click", oruPrognoze);

//-----------------ikelia reiksmias i html bet visas------------

/* data.forecastTimestamps.forEach(oras => {
     // console.log(oras);
     if (naujosDatos == oras.forecastTimeUtc)
     const divHours = document.createElement("div");
     valanduTevas.appendChild(divHours);
     divHours.innerHTML = `<p>${oras.forecastTimeUtc}</p>
                      <p>${oras.airTemperature}</p>
                      <p>Humidity: ${oras.relativeHumidity}%</p>
                      <p>${oras.totalPrecipitation}</p>`
     //console.log(oras.forecastTimeUtc);
     //console.log(oras.airTemperature);
 })*/

//---------Suggestions-----------------
/*const  suggestions = async () => {
   console.log("Labas suggestion funkcija")
   console.log(searchInput.value)
   const reiksme = searchInput.value;
   try {
       const response = await fetch(`https://api.meteo.lt/v1/places/${reiksme}`);
       const data = await response.json();
       console.log(data);
       while (suggestionsList.firstChild){
           suggestionsList.removeChild(suggestionsList.firstChild);
       }
       for (let i=0; i<data.length; i++){
           const option = document.createElement("option");
           suggestionsList.appendChild(option);
           option.innerHTML = data[i].name;
       }
   }catch (error){
       console.log(error)
   }
}*/

//searchInput.addEventListener("keyup", suggestions);