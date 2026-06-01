import { useState } from 'react'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('请输入城市名称')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // 使用免费的天气API (Open-Meteo)
      const response = await fetch(
        `https://wttr.in/${encodeURIComponent(city)}?format=j1`
      )
      
      if (!response.ok) {
        throw new Error('获取天气信息失败')
      }
      
      const data = await response.json()
      
      const current = data.current_condition[0]
      const nearestArea = data.nearest_area[0]
      
      setWeather({
        city: nearestArea.areaName[0].value,
        country: nearestArea.country[0].value,
        temperature: current.temp_C + '°C',
        condition: current.weatherDesc[0].value,
        humidity: current.humidity + '%',
        windSpeed: current.windspeedKmph + ' km/h',
        feelsLike: current.FeelsLikeC + '°C',
        visibility: current.visibility + ' km',
        pressure: current.pressure + ' mb',
        uvIndex: current.UVIndex,
        icon: getWeatherIcon(current.weatherCode)
      })
    } catch (err) {
      setError('无法获取天气数据，请检查城市名称是否正确')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (code) => {
    const icons = {
      '113': '☀️', // Sunny
      '116': '⛅', // Partly cloudy
      '119': '☁️', // Cloudy
      '122': '☁️', // Overcast
      '143': '🌫️', // Mist
      '176': '🌦️', // Light rain
      '179': '🌨️', // Light snow
      '200': '⛈️', // Thunderstorm
      '227': '🌨️', // Blowing snow
      '230': '❄️', // Heavy snow
    }
    return icons[code] || '🌤️'
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather()
    }
  }

  return (
    <div className="app">
      <div className="container">
        <h1>🌤️ 天气查询</h1>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="请输入城市名称..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={fetchWeather} disabled={loading}>
            {loading ? '查询中...' : '查询'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {weather && (
          <div className="weather-card">
            <div className="weather-header">
              <div className="location">
                <h2>{weather.city}</h2>
                <span>{weather.country}</span>
              </div>
              <div className="icon">{weather.icon}</div>
            </div>
            
            <div className="temperature">
              <span className="temp-value">{weather.temperature}</span>
              <span className="condition">{weather.condition}</span>
            </div>

            <div className="details">
              <div className="detail-item">
                <span className="label">体感温度</span>
                <span className="value">{weather.feelsLike}</span>
              </div>
              <div className="detail-item">
                <span className="label">湿度</span>
                <span className="value">{weather.humidity}</span>
              </div>
              <div className="detail-item">
                <span className="label">风速</span>
                <span className="value">{weather.windSpeed}</span>
              </div>
              <div className="detail-item">
                <span className="label">能见度</span>
                <span className="value">{weather.visibility}</span>
              </div>
              <div className="detail-item">
                <span className="label">气压</span>
                <span className="value">{weather.pressure}</span>
              </div>
              <div className="detail-item">
                <span className="label">紫外线指数</span>
                <span className="value">{weather.uvIndex}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App