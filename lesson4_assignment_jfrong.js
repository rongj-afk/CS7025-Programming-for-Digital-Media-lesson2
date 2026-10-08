let datasource="https://api.open-meteo.com/v1/forecast?latitude=31.2222&longitude=121.4581&hourly=temperature_2m,weather_code&current=temperature_2m,weather_code&forecast_days=1";

let element;

function addElement(parent, tag, text){
    let newElement=document.createElement(tag);
    newElement.textContent=text;
    parent.appendChild(newElement);
    return newElement;
}

function Showweather(data){
    addElement(element,"h1","Shanghai Weather Today");
    addElement(element,"p","Current temperature:"+ data.current.temperature_2m+"degrees,weather code:"+data.current.weather_code);
    
    let list=addElement(element,"ul","");

    data.hourly.time.forEach((time,index)=>{
    let hour=time.slice(11);
    addElement(list,"li",hour+""+data.hourly.temperature_2m[index]+"degrees")
    });
}

function getWeather(){
    fetch(datasource)
        .then(response =>{
            if(!response.ok){
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            Showweather(data); 
        })
        .catch(err => {
            console.error(err);
            addElement(element,"p","Error fetching weather data");
        });
}

document.addEventListener("DOMContentLoaded",()=>{
    element=document.getElementById("weather");
    getWeather();
});


