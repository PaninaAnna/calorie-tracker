import { useState, useMemo } from 'react'

const MEAL_TABS = ['Завтрак', 'Обед', 'Ужин', 'Перекус']

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function DiaryPage() {
  const [activeTab, setActiveTab] = useState('Завтрак')
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = localStorage.getItem('selectedDate')
    return saved || getToday()
  })
  const [diary, setDiary] = useState(() => {
    const saved = localStorage.getItem('diary')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedProduct, setSelectedProduct] = useState('')
  const [grams, setGrams] = useState('')
  const [error, setError] = useState('')

  const products = JSON.parse(localStorage.getItem('products') || '[]')

  // Профиль и цели
  const profile = useMemo(() => {
    const saved = localStorage.getItem('profile')
    return saved ? JSON.parse(saved) : null
  }, [])

  const targets = useMemo(() => {
    if (!profile || !profile.weight || !profile.height || !profile.age) return null
    const w = parseFloat(profile.weight)
    const h = parseFloat(profile.height)
    const a = parseFloat(profile.age)
    let bmr = profile.gender === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161
    const tdee = Math.round(bmr * profile.activity)
    let targetCalories = tdee
    if (profile.goal === 'lose') targetCalories = Math.round(tdee * 0.85)
    if (profile.goal === 'gain') targetCalories = Math.round(tdee * 1.15)
    return {
      calories: targetCalories,
      proteins: Math.round(targetCalories * 0.25 / 4),
      fats: Math.round(targetCalories * 0.25 / 9),
      carbs: Math.round(targetCalories * 0.5 / 4)
    }
  }, [profile])

  const filteredEntries = diary.filter(
    e => e.mealType === activeTab && e.date === selectedDate
  )

  const dayEntries = diary.filter(e => e.date === selectedDate)
  const dayTotals = dayEntries.reduce((acc, e) => {
    acc.calories += e.calories
    acc.proteins += e.proteins
    acc.fats += e.fats
    acc.carbs += e.carbs
    return acc
  }, { calories: 0, proteins: 0, fats: 0, carbs: 0 })

  const handleDateChange = (e) => {
    const date = e.target.value
    setSelectedDate(date)
    localStorage.setItem('selectedDate', date)
  }

  const handleAdd = (e) => {
    e.preventDefault()

    if (!selectedProduct) {
      setError('Выберите продукт')
      return
    }
    const gramsNum = parseFloat(grams)
    if (!gramsNum || gramsNum <= 0) {
      setError('Введите количество граммов (> 0)')
      return
    }

    const product = products.find(p => p.id === parseInt(selectedProduct))
    const coefficient = gramsNum / 100

    const entry = {
      id: Date.now(),
      date: selectedDate,
      mealType: activeTab,
      productId: product.id,
      productName: product.name,
      grams: gramsNum,
      proteins: +(product.proteins * coefficient).toFixed(1),
      fats: +(product.fats * coefficient).toFixed(1),
      carbs: +(product.carbs * coefficient).toFixed(1),
      calories: +(product.calories * coefficient).toFixed(0)
    }

    const updated = [...diary, entry]
    setDiary(updated)
    localStorage.setItem('diary', JSON.stringify(updated))
    setSelectedProduct('')
    setGrams('')
    setError('')
  }

  const deleteEntry = (id) => {
    const updated = diary.filter(e => e.id !== id)
    setDiary(updated)
    localStorage.setItem('diary', JSON.stringify(updated))
  }

  const getRemainColor = (current, target) => {
    if (!target) return '#333'
    const percent = current / target
    if (percent > 1) return '#e53935'
    if (percent > 0.9) return '#f9a825'
    return '#4caf50'
  }

  return (
    <>
      <h1>Дневник питания</h1>

      <div style={{ marginBottom: 20 }}>
        <label>Дата: </label>
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </div>

      <div className="counter">
        <strong>Итого за {selectedDate}:</strong>{' '}
        {dayTotals.calories} ккал |{' '}
        Б: {dayTotals.proteins.toFixed(1)}г |{' '}
        Ж: {dayTotals.fats.toFixed(1)}г |{' '}
        У: {dayTotals.carbs.toFixed(1)}г

        {targets && (
          <div style={{ marginTop: 8, fontSize: 14 }}>
            <span>Цель: {targets.calories} ккал</span>
            {' | '}
            <span style={{ color: getRemainColor(dayTotals.calories, targets.calories) }}>
              Осталось: {Math.max(0, targets.calories - dayTotals.calories)} ккал
            </span>
            {dayTotals.calories > targets.calories && (
              <span style={{ color: '#e53935', marginLeft: 8 }}>Перебор на {dayTotals.calories - targets.calories} ккал</span>
            )}
            <div style={{ marginTop: 4, color: '#666' }}>
              Б: {targets.proteins}г | Ж: {targets.fats}г | У: {targets.carbs}г (цель)
            </div>
          </div>
        )}

        {!targets && (
          <div style={{ marginTop: 8, fontSize: 14, color: '#888' }}>
            Заполните <a href="/profile">профиль</a> для расчёта норм
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {MEAL_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              setError('')
            }}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleAdd} style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'end', flexWrap: 'wrap' }}>
        <div>
          <label>Продукт:</label><br />
          <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
            <option value="">-- Выбрать --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.calories} ккал)</option>
            ))}
          </select>
        </div>
        <div>
          <label>Граммы:</label><br />
          <input
            type="number"
            value={grams}
            onChange={e => setGrams(e.target.value)}
            placeholder="150"
            style={{ width: 80 }}
          />
        </div>
        <button type="submit">Добавить</button>
        {error && <span className="error">{error}</span>}
      </form>

      <h3>{activeTab}</h3>
      {filteredEntries.length === 0 ? (
        <p className="empty">Пока ничего не добавлено</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Продукт</th>
              <th>Граммы</th>
              <th>Белки</th>
              <th>Жиры</th>
              <th>Углеводы</th>
              <th>Ккал</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map(e => (
              <tr key={e.id}>
                <td>{e.productName}</td>
                <td>{e.grams}г</td>
                <td>{e.proteins}г</td>
                <td>{e.fats}г</td>
                <td>{e.carbs}г</td>
                <td>{e.calories}ккал</td>
                <td>
                  <button className="btn-delete" onClick={() => deleteEntry(e.id)}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}

export default DiaryPage
