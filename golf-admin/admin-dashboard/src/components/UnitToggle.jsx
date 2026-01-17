import { useUnits } from '../contexts/UnitContext'

export default function UnitToggle() {
  const { units, toggleUnits, isImperial } = useUnits()

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs ${isImperial ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
        °F / yds
      </span>
      <button
        onClick={toggleUnits}
        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        style={{ backgroundColor: isImperial ? '#9CA3AF' : '#3B82F6' }}
        aria-label={`Switch to ${isImperial ? 'metric' : 'imperial'} units`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
            isImperial ? 'translate-x-1' : 'translate-x-[18px]'
          }`}
        />
      </button>
      <span className={`text-xs ${!isImperial ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
        °C / m
      </span>
    </div>
  )
}
