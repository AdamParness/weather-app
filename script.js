const API_Key = `4Y26WB33T73AWVRMVJTZJDR7Q`;
const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]/[date1]/[date2]?key=YOUR_API_KEY`;

async function getWeatherData(){
    const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/San Mateo,CA/next5days?unitGroup=us&key=4Y26WB33T73AWVRMVJTZJDR7Q',{mode: 'cors'});
    const data = await response.json();
    return { 
        days: data.days, 
        address: data.address 
    };
}

function setBackgroundByIcon(icon) {
    // Remove any existing background classes
    document.body.classList.remove(
        'bg-clear-day', 'bg-clear-night', 'bg-cloudy', 
        'bg-partly-cloudy-day', 'bg-partly-cloudy-night', 
        'bg-rain', 'bg-snow', 'bg-fog', 'bg-wind'
    );
    
    // Add the appropriate background class
    document.body.classList.add(`bg-${icon}`);
}

function displayWeatherData(dayData, location) {
    const weatherCard = document.querySelector(".weather-card");
    
    // Set background based on icon
    setBackgroundByIcon(dayData.icon);
    
    // Create HTML to display weather information
    const weatherHTML = `
        <div class="weather-details">
            <h2>Today's Weather</h2>
            <h3 class="location">${location}</h3>
            <p><strong>Conditions:</strong> ${dayData.conditions}</p>
            <p><strong>Temperature:</strong> ${dayData.temp}°F (${dayData.tempmin}°F - ${dayData.tempmax}°F)</p>
            <p><strong>UV Index:</strong> ${dayData.uvindex}</p>
            <p><strong>Wind Speed:</strong> ${dayData.windspeed} mph</p>
            <p><strong>Sunrise:</strong> ${dayData.sunrise}</p>
            <p><strong>Sunset:</strong> ${dayData.sunset}</p>
        </div>
    `;
    
    // Insert the HTML into the weather card
    weatherCard.innerHTML = weatherHTML;
}

// When the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const weatherData = await getWeatherData();
        // Display today's weather (first day in the array)
        if (weatherData.days && weatherData.days.length > 0) {
            displayWeatherData(weatherData.days[0], weatherData.address);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        const weatherCard = document.querySelector(".weather-card");
        weatherCard.innerHTML = "<p>Unable to load weather data</p>";
    }
});