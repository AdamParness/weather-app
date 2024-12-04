const API_Key = `4Y26WB33T73AWVRMVJTZJDR7Q`;

function setBackgroundByIcon(icon) {
    // Create the pseudo-element if it doesn't exist
    let pseudoElement = document.body.querySelector('.background-transition');
    if (!pseudoElement) {
        pseudoElement = document.createElement('div');
        pseudoElement.className = 'background-transition';
        document.body.appendChild(pseudoElement);
    }
    
    // Get current background class
    const currentBackgroundClass = Array.from(document.body.classList)
        .find(cls => cls.startsWith('bg-'));
    
    // Remove any existing background classes
    document.body.classList.remove(
        'bg-clear-day', 'bg-clear-night', 'bg-cloudy', 
        'bg-partly-cloudy-day', 'bg-partly-cloudy-night', 
        'bg-rain', 'bg-snow', 'bg-fog', 'bg-wind'
    );
    
    // If there's a current background, set it as the transition background
    if (currentBackgroundClass) {
        pseudoElement.style.backgroundColor = getComputedStyle(document.body).backgroundColor;
        document.body.classList.add('transitioning');
    }
    
    // Add the new background class
    document.body.classList.add(`bg-${icon}`);
    
    // Remove transition class after animation
    setTimeout(() => {
        document.body.classList.remove('transitioning');
    }, 1000);
}

async function getWeatherData(location = 'San Mateo,CA'){
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next5days?unitGroup=us&key=${API_Key}`, {mode: 'cors'});
    const data = await response.json();
    return { 
        days: data.days, 
        address: data.address 
    };
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

function displayFiveDayForecast(days) {
    const weatherCard = document.querySelector(".weather-card");
    
    // Create HTML for 5-day forecast
    const forecastHTML = `
        <div class="five-day-forecast">
            <h2>5-Day Forecast</h2>
            ${days.slice(1, 6).map((day, index) => `
                <div class="forecast-day">
                    <h3>${new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'short' })}</h3>
                    <p><strong>Conditions:</strong> ${day.conditions}</p>
                    <p><strong>Temperature:</strong> ${day.temp}°F (${day.tempmin}°F - ${day.tempmax}°F)</p>
                </div>
            `).join('')}
        </div>
    `;
    
    // Append the forecast to the existing weather card
    weatherCard.innerHTML += forecastHTML;
}

async function updateWeatherDisplay(location) {
    try {
        const weatherData = await getWeatherData(location);
        // Clear previous content
        const weatherCard = document.querySelector(".weather-card");
        weatherCard.innerHTML = '';
        
        // Display today's weather (first day in the array)
        if (weatherData.days && weatherData.days.length > 0) {
            displayWeatherData(weatherData.days[0], weatherData.address);
            
            // Display 5-day forecast
            displayFiveDayForecast(weatherData.days);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        const weatherCard = document.querySelector(".weather-card");
        weatherCard.innerHTML = "<p>Unable to load weather data. Please check the location and try again.</p>";
    }
}

// When the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wrap everything in an app container
    const body = document.body;
    const appContainer = document.createElement('div');
    appContainer.className = 'app-container';
    
    // Create search bar
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="location-search" placeholder="Enter city, country (e.g., London,UK)">
        <button id="search-button">Search</button>
    `;
    
    // Move existing weather card into the app container
    const weatherCard = document.querySelector(".weather-card");
    
    // Append search container and weather card to app container
    appContainer.appendChild(searchContainer);
    appContainer.appendChild(weatherCard);
    
    // Replace body contents with app container
    body.innerHTML = '';
    body.appendChild(appContainer);
    
    // Initial load with default location
    updateWeatherDisplay('San Mateo,CA');
    
    // Search functionality
    const searchInput = document.getElementById('location-search');
    const searchButton = document.getElementById('search-button');
    
    searchButton.addEventListener('click', () => {
        const location = searchInput.value.trim();
        if (location) {
            updateWeatherDisplay(location);
        }
    });
    
    // Allow enter key to trigger search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const location = searchInput.value.trim();
            if (location) {
                updateWeatherDisplay(location);
            }
        }
    });
});