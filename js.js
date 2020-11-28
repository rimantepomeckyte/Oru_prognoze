"use strict"

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
        //console.log(data);

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

//---------------Dienu ir orų ikelimas i html------------------------
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
        }, [])
        console.log(uniq);
        dienuTevas.innerHTML = "";
        uniq.forEach(a => {
            const finalDate = new Date(a).toDateString();
            console.log(finalDate);
            const divDays = document.createElement("div");
            divDays.id = a;
            divDays.setAttribute("class", "col-2 text-center");
            divDays.style.height = "4rem";
            divDays.style.borderRight = "1px gray solid";
            dienuTevas.appendChild(divDays);
            if (divDays.id === uniq[0]) {
                divDays.innerHTML = "Today";
            } else {
                divDays.innerHTML = finalDate;
            }
            divDays.addEventListener("click", rodykOrus);

            function rodykOrus() {
                valanduTevas.innerHTML = "";
                data.forecastTimestamps.forEach(oras => {
                    console.log(oras)
                    const dienos = oras.forecastTimeUtc.split(" ");
                    if (dienos[0] === divDays.id) {
                        // console.log("Tinka");
                        const divHours = document.createElement("div");
                        divHours.style.border = "1px gray solid";
                        divHours.setAttribute("class", "col-2 text-center");
                        valanduTevas.appendChild(divHours);
                        const hoursArray = dienos[1].split(":");
                        // console.log(hoursArray);
                        divHours.innerHTML = `<p class="mt-3">${hoursArray[0]}:${hoursArray[1]}</p>
                                              <p class="mb-5">${oras.airTemperature} °C</p>
                                              <img src="img/rain-drops.png" width="20">
                                              <p>${oras.totalPrecipitation} %</p>
                                               <p>Vėjo greitis: ${oras.windSpeed}m/s</p> `
                        let condition = oras.conditionCode;
                        //console.log(condition)
                        const iconImage = document.createElement("img");
                        iconImage.width = "50";
                        divHours.insertBefore(iconImage, divHours.childNodes[1]);
                        switch (condition) {
                            case "clear":
                                console.log("Giedra");
                                iconImage.src = "img/clear.png";
                                break;
                            case "isolated-clouds":
                            case "scattered-clouds":
                                iconImage.src = "img/isolated-clouds-scattered-clouds.png";
                                break;
                            case "overcast":
                                iconImage.src = "img/overcast.png";
                                break;
                            case "light-rain":
                                iconImage.src = "img/light-rain.png";
                                break;
                            case "moderate-rain":
                                iconImage.src = "img/moderate-rain.png";
                                break;
                            case "heavy-rain":
                                iconImage.src = "img/heavy-rain.png";
                                break;
                            case "sleet":
                                iconImage.src = "img/sleet.png";
                                break;
                            case "light-snow":
                                iconImage.src = "img/light-snow.png";
                                break;
                            case "moderate-snow":
                            case "heavy-snow":
                                iconImage.src = "img/moderate-snow-heavy-snow.png";
                                break;
                            case "fog":
                                iconImage.src = "img/fog.png"
                        }
                    } else {
                        //console.log("netinka")
                    }
                });
            }
        })
    } catch (error) {
        console.log(error);
    }
}
searchBtn.addEventListener("click", oruPrognoze);

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
}
searchInput.addEventListener("keyup", suggestions);*/