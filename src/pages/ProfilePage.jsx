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

  const targetProteins = Math.round(targetCalories * 0.25 / 4)
  const targetFats = Math.round(targetCalories * 0.25 / 9)
  const targetCarbs = Math.round(targetCalories * 0.5 / 4)

  const hasData = w > 0 && h > 0 && a > 0

  return (
    <>
      <h1>Профиль</h1>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {/* Форма */}
        <form onSubmit={handleSubmit} style={{ flex: '1 1 320px', maxWidth: 400 }}>
          <div className="form-group">
            <label>Пол</label>
            <select name="gender" value={profile.gender} onChange={handleChange}>
              <option value="female">Женский</option>
              <option value="male">Мужской</option>
            </select>
          </div>

          <div className="form-group">
            <label>Вес (кг)</label>
            <input name="weight" type="number" step="0.1" min="0.1" max="500" value={profile.weight} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Рост (см)</label>
            <input name="height" type="number" min="1" max="300" value={profile.height} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Возраст</label>
            <input name="age" type="number" min="1" max="150" value={profile.age} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Уровень активности</label>
            <select name="activity" value={profile.activity} onChange={handleChange}>
              {ACTIVITY_LEVELS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Цель</label>
            <select name="goal" value={profile.goal} onChange={handleChange}>
              {GOALS.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
            <button type="submit">Сохранить</button>
            {saved && <span className="success">✓ Сохранено!</span>}
          </div>
        </form>

        {/* Результаты справа */}
        {hasData && (
          <div className="profile-result" style={{ flex: '1 1 280px', alignSelf: 'start' }}>
            <h3>Ваши нормы на день</h3>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 13, color: '#888' }}>Базальный метаболизм (BMR)</div>
              <div style={{ fontWeight: 600, fontSize: 20 }}>{Math.round(bmr)} <span style={{ fontSize: 14, fontWeight: 400 }}>ккал</span></div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 13, color: '#888' }}>С учётом активности (TDEE)</div>
              <div style={{ fontWeight: 600, fontSize: 18 }}>{tdee} <span style={{ fontSize: 14, fontWeight: 400 }}>ккал</span></div>
            </div>
            <hr />
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 13, color: '#888' }}>Целевой калораж</div>
              <div style={{ fontWeight: 700, fontSize: 24, color: '#4caf50' }}>{targetCalories} <span style={{ fontSize: 14, fontWeight: 400 }}>ккал</span></div>
            </div>
            <hr />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: '#2196f3', fontWeight: 600 }}>Белки</div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{targetProteins} <span style={{ fontSize: 13, fontWeight: 400 }}>г</span></div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#ff9800', fontWeight: 600 }}>Жиры</div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{targetFats} <span style={{ fontSize: 13, fontWeight: 400 }}>г</span></div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#9c27b0', fontWeight: 600 }}>Углеводы</div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{targetCarbs} <span style={{ fontSize: 13, fontWeight: 400 }}>г</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!hasData && (
        <p className="empty" style={{ marginTop: 16 }}>Заполните данные для расчёта норм</p>
      )}
    </>
  )
}

export default ProfilePage
