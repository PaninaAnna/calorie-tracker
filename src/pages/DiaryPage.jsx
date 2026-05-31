import { useState } from 'react'

const MEAL_TABS = ['Завтрак', 'Обед', 'Ужин', 'Перекус']

function DiaryPage() {
  const [activeTab, setActiveTab] = useState('Завтрак')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [grams, setGrams] = useState('')
  const [error, setError] = useState('')

  const products = JSON.parse(localStorage.getItem('products') || '[]')

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

    console.log('Добавлена запись:', entry)

    setSelectedProduct('')
    setGrams('')
    setError('')
  }

  return (
    <>
      <h1>Дневник питания</h1>

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

      <p>Активная вкладка: <strong>{activeTab}</strong></p>
    </>
  )
}

export default DiaryPage
