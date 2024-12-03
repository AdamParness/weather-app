const API_Key = `4Y26WB33T73AWVRMVJTZJDR7Q`;
const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]/[date1]/[date2]?key=YOUR_API_KEY`;

async function getWeatherData(){
    const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/94401/next5days?unitGroup=us&key=4Y26WB33T73AWVRMVJTZJDR7Q',{mode: 'cors'});
    const data = await response.json();
    console.log(data)
    return data.currentConditions, data.days;
}

getWeatherData();