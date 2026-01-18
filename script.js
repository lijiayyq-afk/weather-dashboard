// Weather API Configuration
const API_KEY = '0eaf65646fa4f7cb0fbf1db33693e320';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// City configurations with coordinates
const CITIES = [
    {
        id: 'jingzhou',
        name: '石首',
        province: '湖北荆州',
        lat: 29.7209,
        lon: 112.4255
    },
    {
        id: 'deyang',
        name: '中江',
        province: '四川德阳',
        lat: 31.0356,
        lon: 104.6761
    },
    {
        id: 'shanghai',
        name: '周浦',
        province: '上海',
        lat: 31.1783,
        lon: 121.4947
    }
];

// Weather icon mapping
const WEATHER_ICONS = {
    '01d': 'http://openweathermap.org/img/wn/01d@4x.png',
    '01n': 'http://openweathermap.org/img/wn/01n@4x.png',
    '02d': 'http://openweathermap.org/img/wn/02d@4x.png',
    '02n': 'http://openweathermap.org/img/wn/02n@4x.png',
    '03d': 'http://openweathermap.org/img/wn/03d@4x.png',
    '03n': 'http://openweathermap.org/img/wn/03n@4x.png',
    '04d': 'http://openweathermap.org/img/wn/04d@4x.png',
    '04n': 'http://openweathermap.org/img/wn/04n@4x.png',
    '09d': 'http://openweathermap.org/img/wn/09d@4x.png',
    '09n': 'http://openweathermap.org/img/wn/09n@4x.png',
    '10d': 'http://openweathermap.org/img/wn/10d@4x.png',
    '10n': 'http://openweathermap.org/img/wn/10n@4x.png',
    '11d': 'http://openweathermap.org/img/wn/11d@4x.png',
    '11n': 'http://openweathermap.org/img/wn/11n@4x.png',
    '13d': 'http://openweathermap.org/img/wn/13d@4x.png',
    '13n': 'http://openweathermap.org/img/wn/13n@4x.png',
    '50d': 'http://openweathermap.org/img/wn/50d@4x.png',
    '50n': 'http://openweathermap.org/img/wn/50n@4x.png'
};

// Chinese weather descriptions
const WEATHER_DESCRIPTIONS_CN = {
    'clear sky': '晴朗',
    'few clouds': '少云',
    'scattered clouds': '多云',
    'broken clouds': '阴',
    'overcast clouds': '阴天',
    'shower rain': '阵雨',
    'rain': '雨',
    'light rain': '小雨',
    'moderate rain': '中雨',
    'heavy intensity rain': '大雨',
    'thunderstorm': '雷暴',
    'snow': '雪',
    'mist': '薄雾',
    'haze': '霾',
    'fog': '雾'
};

/**
 * Fetch weather data for a specific city
 */
async function fetchWeatherData(city) {
    try {
        const url = `${API_BASE_URL}?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric&lang=zh_cn`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching weather for ${city.name}:`, error);
        throw error;
    }
}

/**
 * Translate weather description to Chinese
 */
function getChineseDescription(englishDesc) {
    const lowerDesc = englishDesc.toLowerCase();
    return WEATHER_DESCRIPTIONS_CN[lowerDesc] || englishDesc;
}

/**
 * Update the weather card UI with fetched data
 */
function updateWeatherCard(cityId, data) {
    const card = document.getElementById(`${cityId}-card`);
    if (!card) return;

    const weatherData = card.querySelector('.weather-data');
    const loadingSpinner = card.querySelector('.loading-spinner');

    // Hide loading spinner
    loadingSpinner.style.display = 'none';
    weatherData.style.display = 'block';

    // Update weather icon
    const iconCode = data.weather[0].icon;
    const iconImg = weatherData.querySelector('.weather-icon');
    iconImg.src = WEATHER_ICONS[iconCode] || `http://openweathermap.org/img/wn/${iconCode}@4x.png`;
    iconImg.alt = data.weather[0].description;

    // Update temperature
    const temperature = weatherData.querySelector('.temperature');
    temperature.textContent = Math.round(data.main.temp);

    // Update description
    const description = weatherData.querySelector('.weather-description');
    description.textContent = getChineseDescription(data.weather[0].description);

    // Update humidity
    const humidity = weatherData.querySelector('.humidity');
    humidity.textContent = `${data.main.humidity}%`;

    // Update wind speed
    const wind = weatherData.querySelector('.wind');
    wind.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

    // Update feels like temperature
    const feelsLike = weatherData.querySelector('.feels-like');
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
}

/**
 * Show error state on weather card
 */
function showErrorState(cityId) {
    const card = document.getElementById(`${cityId}-card`);
    if (!card) return;

    const weatherData = card.querySelector('.weather-data');
    const loadingSpinner = card.querySelector('.loading-spinner');

    loadingSpinner.style.display = 'none';
    weatherData.style.display = 'block';
    weatherData.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #f87171;">
            <p style="font-size: 3rem; margin-bottom: 1rem;">⚠️</p>
            <p style="font-size: 1.125rem; font-weight: 500;">加载失败</p>
            <p style="font-size: 0.875rem; margin-top: 0.5rem; color: #94a3b8;">请稍后重试</p>
        </div>
    `;
}

/**
 * Update the last update timestamp
 */
function updateLastUpdateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const lastUpdateElement = document.getElementById('lastUpdate');
    lastUpdateElement.textContent = `最后更新: ${hours}:${minutes}:${seconds}`;
}

/**
 * Load weather data for all cities
 */
async function loadAllWeatherData() {
    console.log('Loading weather data for all cities...');

    for (const city of CITIES) {
        try {
            const data = await fetchWeatherData(city);
            updateWeatherCard(city.id, data);
            console.log(`Weather data loaded for ${city.name}`);
        } catch (error) {
            console.error(`Failed to load weather for ${city.name}:`, error);
            showErrorState(city.id);
        }
    }

    updateLastUpdateTime();
}

/**
 * Initialize the application
 */
function init() {
    console.log('Initializing Weather Dashboard...');

    // Load initial weather data
    loadAllWeatherData();

    // Set up automatic refresh every 5 minutes (300,000 milliseconds)
    setInterval(() => {
        console.log('Auto-refreshing weather data...');
        loadAllWeatherData();
    }, 300000); // 5 minutes

    console.log('Weather Dashboard initialized. Auto-refresh set to every 5 minutes.');
}

// Start the application when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
