import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().split('T')[0]
}

function getWeekDays(monday) {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  return days.map((name, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    return { name, date: d.toISOString().split('T')[0] }
  })
}

function HistoryPage() {
  const navigate = useNavigate()
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))

  const diary = useMemo(() => {
    const saved = localStorage.getItem('diary')
    return saved ? JSON.parse(saved) : []
  }, [])

  const profile = useMemo(() => {
    const saved = localStorage.getItem('profile')
    return saved ? JSON.parse(saved) : null
  }, [])

  const targetCalories = useMemo(() => {
    if (!profile || !profile.weight || !profile.height || !profile.age) return null
    const w = parseFloat(profile.weight)
    const h = parseFloat(profile.height)
    const a = parseFloat(profile.age)
    let bmr = profile.gender === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161
    const tdee = Math.round(bmr * profile.activity)
    if (profile.goal === 'lose') return Math.round(tdee * 0.85)
    if (profile.goal === 'gain') return Math.round(tdee * 1.15)
    return tdee
  }, [profile])

  const weekDays = getWeekDays(weekStart)

  const weekData = weekDays.map(day => {
    const entries = diary.filter(e => e.date === day.date)
    return {
      ...day,
      calories: entries.reduce((s, e) => s + e.calories, 0),
      proteins: +entries.reduce((s, e) => s + e.proteins, 0).toFixed(1),
      fats: +entries.reduce((s, e) => s + e.fats, 0).toFixed(1),
      carbs: +entries.reduce((s, e) => s + e.carbs, 0).toFixed(1),
      isEmpty: entries.length === 0
    }
  })

  const maxMacro = Math.max(
    ...weekData.map(d => d.proteins + d.fats + d.carbs),
    50
  )

  const prevWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d.toISOString().split('T')[0])
  }

  const nextWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d.toISOString().split('T')[0])
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const isCurrentWeek = weekDays.some(d => d.date === todayStr)

  return (
    <>
      <h1>История питания</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={prevWeek} style={{ background: '#e0e0e0', color: '#333' }}>← Пред.</button>
        <span style={{ fontWeight: 600, fontSize: 15 }}>
          {weekDays[0].date} — {weekDays[6].date}
        </span>
        {!isCurrentWeek && (
          <button onClick={nextWeek} style={{ background: '#e0e0e0', color: '#333' }}>След. →</button>
        )}
      </div>

      <div className="card" style={{ padding: '24px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'end', gap: 12, height: 220, justifyContent: 'center' }}>
          {weekData.map(day => {
            const totalMacro = day.proteins + day.fats + day.carbs
            const barHeight = maxMacro > 0 ? (totalMacro / maxMacro) * 160 : 0
            const isOver = targetCalories && day.calories > targetCalories

            const pHeight = maxMacro > 0 ? (day.proteins / maxMacro) * 160 : 0
            const fHeight = maxMacro > 0 ? (day.fats / maxMacro) * 160 : 0
            const cHeight = maxMacro > 0 ? (day.carbs / maxMacro) * 160 : 0

            return (
              <div
                key={day.date}
                onClick={() => {
                  localStorage.setItem('selectedDate', day.date)
                  navigate('/')
                }}
                style={{
                  flex: 1,
                  maxWidth: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: day.isEmpty ? 'default' : 'pointer',
                  opacity: day.isEmpty ? 0.4 : 1,
                  transition: 'opacity 0.2s'
                }}
                title={day.isEmpty ? 'Нет данных' : `Б: ${day.proteins}г Ж: ${day.fats}г У: ${day.carbs}г`}
              >
                {/* Сумма макро сверху столбика */}
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: '#666', minHeight: 16 }}>
                  {totalMacro > 0 ? `${totalMacro}г` : ''}
                </div>

                {/* Столбик */}
                <div style={{
                  width: 36,
                  height: 160,
                  background: '#f0f0f0',
                  borderRadius: 6,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {totalMacro > 0 && (
                    <>
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: `${(pHeight / 160) * 100}%`,
                        background: '#2196f3',
                        borderRadius: '0 0 0 0'
                      }} />
                      <div style={{
                        position: 'absolute',
                        bottom: pHeight,
                        width: '100%',
                        height: `${(fHeight / 160) * 100}%`,
                        background: '#ff9800'
                      }} />
                      <div style={{
                        position: 'absolute',
                        bottom: pHeight + fHeight,
                        width: '100%',
                        height: `${(cHeight / 160) * 100}%`,
                        background: '#9c27b0',
                        borderRadius: '6px 6px 0 0'
                      }} />
                    </>
                  )}
                </div>

                {/* Калории под столбиком */}
                <div style={{
                  marginTop: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  color: day.isEmpty ? '#999' : isOver ? '#e53935' : '#4caf50'
                }}>
                  {day.calories > 0 ? day.calories : '—'}
                </div>

                {/* День недели */}
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  {day.name}
                </div>
              </div>
            )
          })}
        </div>

        {/* Легенда */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20, fontSize: 12, color: '#888' }}>
          <span>● Белки</span>
          <span style={{ color: '#ff9800' }}>● Жиры</span>
          <span style={{ color: '#9c27b0' }}>● Углеводы</span>
          {targetCalories && (
            <span>Цель: {targetCalories} ккал</span>
          )}
        </div>
      </div>
    </>
  )
}

export default HistoryPage
