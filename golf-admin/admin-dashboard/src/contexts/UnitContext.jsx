import { createContext, useContext, useState, useEffect } from 'react'

const UnitContext = createContext(null)

export function UnitProvider({ children }) {
  const [units, setUnits] = useState(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem('preferred_units')
    return saved || 'imperial'
  })

  // Persist to localStorage when changed
  useEffect(() => {
    localStorage.setItem('preferred_units', units)
  }, [units])

  const toggleUnits = () => {
    setUnits(prev => prev === 'imperial' ? 'metric' : 'imperial')
  }

  const value = {
    units,
    setUnits,
    toggleUnits,
    isImperial: units === 'imperial',
    isMetric: units === 'metric',
  }

  return (
    <UnitContext.Provider value={value}>
      {children}
    </UnitContext.Provider>
  )
}

export function useUnits() {
  const context = useContext(UnitContext)
  if (!context) {
    throw new Error('useUnits must be used within a UnitProvider')
  }
  return context
}

// Helper functions for formatting values based on unit preference
export const formatters = {
  // Temperature formatting
  temperature: (data, units) => {
    if (!data) return '-'
    if (typeof data === 'object') {
      return units === 'imperial'
        ? `${data.fahrenheit}°F`
        : `${data.celsius}°C`
    }
    // Legacy single value (assume Fahrenheit)
    return `${data}°F`
  },

  // Distance formatting (yards/meters)
  distance: (data, units) => {
    if (!data && data !== 0) return '-'
    if (typeof data === 'object') {
      return units === 'imperial'
        ? `${data.yards} yds`
        : `${data.meters} m`
    }
    // Legacy single value (assume yards)
    return `${data} yds`
  },

  // Distance with sign (for adjustments)
  distanceWithSign: (data, units) => {
    if (!data && data !== 0) return '-'
    if (typeof data === 'object') {
      const val = units === 'imperial' ? data.yards : data.meters
      const unit = units === 'imperial' ? 'yds' : 'm'
      const sign = val > 0 ? '+' : ''
      return `${sign}${val} ${unit}`
    }
    // Legacy single value
    const sign = data > 0 ? '+' : ''
    return `${sign}${data} yds`
  },

  // Speed formatting (mph/km/h)
  speed: (data, units) => {
    if (!data && data !== 0) return '-'
    if (typeof data === 'object') {
      return units === 'imperial'
        ? `${data.mph} mph`
        : `${data.kmh} km/h`
    }
    // Legacy single value (assume mph)
    return `${data} mph`
  },

  // Altitude formatting (feet/meters)
  altitude: (data, units) => {
    if (!data && data !== 0) return '-'
    if (typeof data === 'object') {
      return units === 'imperial'
        ? `${data.feet} ft`
        : `${data.meters} m`
    }
    // Legacy single value (assume feet)
    return `${data} ft`
  },

  // Pressure formatting (inHg/hPa)
  pressure: (data, units) => {
    if (!data && data !== 0) return '-'
    if (typeof data === 'object') {
      return units === 'imperial'
        ? `${data.inhg} inHg`
        : `${data.hpa} hPa`
    }
    // Legacy single value (assume inHg)
    return `${data} inHg`
  },
}

export default UnitContext
