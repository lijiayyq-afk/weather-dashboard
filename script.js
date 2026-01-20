// Weather API Configuration
const API_KEY = '0eaf65646fa4f7cb0fbf1db33693e320';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Default city configurations
const DEFAULT_CITIES = [
    {
        id: 'city_' + Date.now() + '_1',
        name: '石首',
        province: '湖北荆州',
        lat: 29.7209,
        lon: 112.4255
    },
    {
        id: 'city_' + Date.now() + '_2',
        name: '中江',
        province: '四川德阳',
        lat: 31.0356,
        lon: 104.6761
    },
    {
        id: 'city_' + Date.now() + '_3',
        name: '周浦',
        province: '上海',
        lat: 31.1783,
        lon: 121.4947
    }
];

// Current cities list (loaded from localStorage or defaults)
let cities = JSON.parse(localStorage.getItem('weather_cities')) || DEFAULT_CITIES;

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
 * Save cities to localStorage
 */
function saveCities() {
    localStorage.setItem('weather_cities', JSON.stringify(cities));
}

/**
 * Fetch weather data for a specific city
 */
async function fetchWeatherData(city) {
    const url = `${API_BASE_URL}?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric&lang=zh_cn`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

/**
 * Create a weather card element for a city
 */
function createCityCard(city, index) {
    const card = document.createElement('div');
    card.className = 'weather-card';
    card.id = `${city.id}-card`;
    card.innerHTML = `
        <div class="city-tools">
            <button class="tool-btn move-up" onclick="moveCity(${index}, -1)" title="向上移动">↑</button>
            <button class="tool-btn move-down" onclick="moveCity(${index}, 1)" title="向下移动">↓</button>
            <button class="tool-btn delete-btn" onclick="deleteCity('${city.id}')" title="删除城市">✕</button>
        </div>
        <div class="city-header">
            <h2 class="city-name">${city.name}</h2>
            <span class="province">${city.province}</span>
        </div>
        <div class="weather-content">
            <div class="loading-spinner"></div>
            <div class="weather-data" style="display: none;">
                <div class="weather-icon-container">
                    <img class="weather-icon" src="" alt="天气图标">
                </div>
                <div class="temperature-display">
                    <span class="temperature"></span>
                    <span class="temp-unit">°C</span>
                </div>
                <div class="weather-description"></div>
                <div class="weather-details">
                    <div class="detail-item">
                        <span class="detail-icon">💧</span>
                        <span class="detail-label">湿度</span>
                        <span class="detail-value humidity"></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">💨</span>
                        <span class="detail-label">风速</span>
                        <span class="detail-value wind"></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">🌡️</span>
                        <span class="detail-label">体感</span>
                        <span class="detail-value feels-like"></span>
                    </div>
                </div>
            </div>
        </div>
    `;
    return card;
}

/**
 * Update the weather card UI with fetched data
 */
function updateWeatherCardUI(cityId, data) {
    const card = document.getElementById(`${cityId}-card`);
    if (!card) return;

    const weatherData = card.querySelector('.weather-data');
    const loadingSpinner = card.querySelector('.loading-spinner');

    if (loadingSpinner) loadingSpinner.style.display = 'none';
    if (weatherData) weatherData.style.display = 'block';

    const iconCode = data.weather[0].icon;
    const iconImg = weatherData.querySelector('.weather-icon');
    iconImg.src = WEATHER_ICONS[iconCode] || `http://openweathermap.org/img/wn/${iconCode}@4x.png`;

    weatherData.querySelector('.temperature').textContent = Math.round(data.main.temp);
    weatherData.querySelector('.weather-description').textContent = data.weather[0].description;
    weatherData.querySelector('.humidity').textContent = `${data.main.humidity}%`;
    weatherData.querySelector('.wind').textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
    weatherData.querySelector('.feels-like').textContent = `${Math.round(data.main.feels_like)}°C`;
}

/**
 * Show error state on weather card
 */
function showErrorState(cityId) {
    const card = document.getElementById(`${cityId}-card`);
    if (!card) return;

    const weatherData = card.querySelector('.weather-data');
    const loadingSpinner = card.querySelector('.loading-spinner');

    if (loadingSpinner) loadingSpinner.style.display = 'none';
    if (weatherData) {
        weatherData.style.display = 'block';
        weatherData.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #f87171;">
                <p style="font-size: 3rem; margin-bottom: 1rem;">⚠️</p>
                <p style="font-size: 1.125rem; font-weight: 500;">加载失败</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem; color: #94a3b8;">请检查坐标或网络</p>
            </div>
        `;
    }
}

/**
 * Load weather for a single city
 */
async function loadCityWeather(city) {
    try {
        const data = await fetchWeatherData(city);
        updateWeatherCardUI(city.id, data);
    } catch (error) {
        console.error(`Failed to load weather for ${city.name}:`, error);
        showErrorState(city.id);
    }
}

/**
 * Render all cities in the grid
 */
function renderCities() {
    const grid = document.getElementById('weatherGrid');
    grid.innerHTML = '';
    cities.forEach((city, index) => {
        grid.appendChild(createCityCard(city, index));
        loadCityWeather(city);
    });
    updateLastUpdateTime();
}

/**
 * Delete a city
 */
function deleteCity(cityId) {
    if (confirm('确定要删除这个城市吗？')) {
        cities = cities.filter(c => c.id !== cityId);
        saveCities();
        renderCities();
    }
}

/**
 * Move city (custom sort)
 */
function moveCity(index, direction) {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < cities.length) {
        const temp = cities[index];
        cities[index] = cities[newIndex];
        cities[newIndex] = temp;
        saveCities();
        renderCities();
    }
}

/**
 * Add a new city with geocoding validation
 */
async function handleAddCity() {
    const query = document.getElementById('cityQuery').value.trim();
    if (!query) {
        showFormError('请输入城市名称');
        return;
    }

    showFormError('正在搜索并解析城市地址...', 'info');
    const searchResult = document.getElementById('searchResult');
    const resolvedAddress = document.getElementById('resolvedAddress');

    searchResult.style.display = 'none';

    try {
        // 1. Call Geocoding API (Limit to China)
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)},CN&limit=10&appid=${API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        if (!geoResponse.ok) throw new Error('Geocoding failed');

        const geoData = await geoResponse.json();
        const results = geoData.filter(item => item.country === 'CN');

        if (results.length === 0) {
            showFormError('未找到匹配的国内城市，请确保输入正确（如：北京、上海、周浦）');
            return;
        }

        // 2. Perform precise Chinese matching
        // We prioritize results where the Chinese name (local_names.zh) exactly matches or heavily includes the query
        let match = results.find(item =>
            (item.local_names?.zh && (item.local_names.zh === query || query.includes(item.local_names.zh) || item.local_names.zh.includes(query)))
        );

        // Fallback to name match or the first result
        if (!match) {
            match = results.find(item => item.name.toLowerCase() === query.toLowerCase()) || results[0];
        }

        const cityName = match.local_names?.zh || match.name;
        const state = match.state || '';
        const fullAddress = `${state} ${cityName}`.trim();

        // 3. Show preview output
        searchResult.style.display = 'flex';
        resolvedAddress.textContent = fullAddress;

        // 4. Verify weather data works for these coordinates
        showFormError('正在验证天气数据...', 'info');
        const testCity = {
            name: cityName,
            province: state,
            lat: match.lat,
            lon: match.lon
        };
        await fetchWeatherData(testCity);

        // 5. Success - Add to list
        const newCity = {
            ...testCity,
            id: 'city_' + Date.now()
        };

        cities.push(newCity);
        saveCities();
        renderCities();

        // Success feedback
        showFormError('添加成功！', 'info');
        setTimeout(() => {
            toggleAddForm();
            document.getElementById('cityQuery').value = '';
            searchResult.style.display = 'none';
            document.getElementById('formError').style.display = 'none';
        }, 1500);

    } catch (error) {
        console.error('Error in handleAddCity:', error);
        showFormError('处理失败：找不到该城市的天气数据或网络错误');
    }
}

function showFormError(message, type = 'error') {
    const errorEl = document.getElementById('formError');
    errorEl.textContent = message;
    errorEl.style.color = type === 'info' ? '#94a3b8' : 'var(--color-danger)';
    errorEl.style.display = 'block';
}

function toggleAddForm() {
    const form = document.getElementById('addCityForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

/**
 * Update the last update timestamp
 */
function updateLastUpdateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
    document.getElementById('lastUpdate').textContent = `最后更新: ${timeStr}`;
}

/**
 * Initialize the application
 */
function init() {
    // Event listeners
    document.getElementById('addCityBtn').addEventListener('click', toggleAddForm);
    document.getElementById('cancelAdd').addEventListener('click', toggleAddForm);
    document.getElementById('submitCity').addEventListener('click', handleAddCity);

    // Support Enter key in query input
    document.getElementById('cityQuery').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddCity();
    });

    // Initial render
    renderCities();

    // Auto refresh every 5 minutes
    setInterval(() => {
        console.log('Auto-refreshing weather data...');
        cities.forEach(city => loadCityWeather(city));
        updateLastUpdateTime();
    }, 300000);
}

// Start the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
