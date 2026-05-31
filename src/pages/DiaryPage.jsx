import { useState } from 'react'

const MEAL_TABS = ['Завтрак', 'Обед', 'Ужин', 'Перекус']

function DiaryPage() {
  const [activeTab, setActiveTab] = useState('Завтрак')
  const [diary, setDiary] = useState(() => {
    const saved = localStorage.getItem('diary')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedProduct, setSelectedProduct] = useState('')
  const [grams, setGrams] = useState('')
  const [error, setError] = useState('')

  const products = JSON.parse(localStorage.getItem('products') || '[]')

  const filteredEntries = diary.filter(e => e.mealType === activeTab)

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

      {/* Счётчик за день */}
      <div style={{ background: '#e8f5e9', padding: 12, borderRadius: 8, marginBottom: 20 }}>
        <strong>Итого за день:</strong>{' '}
        {diary.reduce((acc, e) => acc + e.calories, 0)} ккал |{' '}
      Б: {diary.reduce((acc, e) => acc + e.proteins, 0).toFixed(1)}г |{' '}
      Ж: {diary.reduce((acc, e) => acc + e.fats, 0).toFixed(1)}г |{' '}
      У: {diary.reduce((acc, e) => acc + e.carbs, 0).toFixed(1)}г
      </div>
      
      {/* Вкладки */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {MEAL_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              setError('')
            }}
            style={{
              padding: '8px 16px',
              background: activeTab === tab ? '#4caf50' : '#e0e0e0',
              color: activeTab === tab ? 'white' : '#333',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Форма добавления */}
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
        {error && <span style={{ color: 'red' }}>{error}</span>}
      </form>

      {/* Список съеденного */}
      <h3>{activeTab}</h3>
      {filteredEntries.length === 0 ? (
        <p>Пока ничего не добавлено</p>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
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
                  <button onClick={() => deleteEntry(e.id)}>×</button>
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
