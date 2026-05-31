import { useState } from 'react'

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Сидячий (мало движения)' },
  { value: 1.375, label: 'Лёгкая активность (1-3 раза в неделю)' },
  { value: 1.55, label: 'Умеренная (3-5 раз в неделю)' },
  { value: 1.725, label: 'Высокая (6-7 раз в неделю)' },
  { value: 1.9, label: 'Экстремальная (спортсмен)' },
]

const GOALS = [
  { value: 'lose', label: 'Похудеть (-15%)' },
  { value: 'maintain', label: 'Сохранить вес' },
  { value: 'gain', label: 'Набрать вес (+15%)' },
]

function ProfilePage() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('profile')
    return saved ? JSON.parse(saved) : {
      weight: '',
      height: '',
      age: '',
      gender: 'female',
      activity: 1.2,
      goal: 'maintain'
    }
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: name === 'activity' ? parseFloat(value) : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('profile', JSON.stringify(profile))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Расчёт BMR (Миффлин-Сан Жеор)
  const w = parseFloat(profile.weight) || 0
  const h = parseFloat(profile.height) || 0
  const a = parseFloat(profile.age) || 0
  let bmr = 0
  if (w > 0 && h > 0 && a > 0) {
    if (profile.gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161
    }
  }

  const tdee = Math.round(bmr * profile.activity)

  let targetCalories = tdee
  if (profile.goal === 'lose') targetCalories = Math.round(tdee * 0.85)
  if (profile.goal === 'gain') targetCalories = Math.round(tdee * 1.15)

  // БЖУ: белки 25%, жиры 25%, углеводы 50%
  const targetProteins = Math.round(targetCalories * 0.25 / 4)
  const targetFats = Math.round(targetCalories * 0.25 / 9)
  const targetCarbs = Math.round(targetCalories * 0.5 / 4)

  return (
    <>
      <h1>Профиль</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: 10 }}>
          <label>Пол:</label><br />
          <select name="gender" value={profile.gender} onChange={handleChange}>
            <option value="female">Женский</option>
            <option value="male">Мужской</option>
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Вес (кг):</label><br />
          <input name="weight" type="number" step="0.1" value={profile.weight} onChange={handleChange} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Рост (см):</label><br />
          <input name="height" type="number" value={profile.height} onChange={handleChange} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Возраст:</label><br />
          <input name="age" type="number" value={profile.age} onChange={handleChange} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Уровень активности:</label><br />
          <select name="activity" value={profile.activity} onChange={handleChange}>
            {ACTIVITY_LEVELS.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Цель:</label><br />
          <select name="goal" value={profile.goal} onChange={handleChange}>
            {GOALS.map(g => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>

        <button type="submit">Сохранить</button>
        {saved && <span style={{ marginLeft: 10, color: '#4caf50' }}>Сохранено!</span>}
      </form>

      {w > 0 && h > 0 && a > 0 && (
        <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8, maxWidth: 400 }}>
          <h3>Ваши нормы на день</h3>
          <p><strong>BMR:</strong> {Math.round(bmr)} ккал (базальный метаболизм)</p>
          <p><strong>TDEE:</strong> {tdee} ккал (с учётом активности)</p>
          <p><strong>Цель:</strong> {targetCalories} ккал</p>
          <hr style={{ margin: '10px 0' }} />
          <p><strong>Белки:</strong> {targetProteins} г</p>
          <p><strong>Жиры:</strong> {targetFats} г</p>
          <p><strong>Углеводы:</strong> {targetCarbs} г</p>
        </div>
      )}
    </>
  )
}

export default ProfilePage
