import { useState } from 'react'

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

  const filteredEntries = diary.filter(
    e => e.mealType === activeTab && e.date === selectedDate
  )

  // КБЖУ за выбранный день
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

  return (
    <>
      <h1>Дневник питания</h1>

      <div style={{ marginBottom: 20 }}>
        <label>Дата: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      <div className="counter">
        <strong>Итого за {selectedDate}:</strong>{' '}
        {dayTotals.calories} ккал |{' '}
        Б: {dayTotals.proteins.toFixed(1)}г |{' '}
        Ж: {dayTotals.fats.toFixed(1)}г |{' '}
        У: {dayTotals.carbs.toFixed(1)}г
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
