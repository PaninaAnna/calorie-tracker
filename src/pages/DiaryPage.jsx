import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const MEAL_TYPES = ['Завтрак', 'Обед', 'Ужин', 'Перекус']

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function DiaryPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = localStorage.getItem('selectedDate')
    return saved || getToday()
  })
  const [diary, setDiary] = useState(() => {
    const saved = localStorage.getItem('diary')
    return saved ? JSON.parse(saved) : []
  })
  const [addingTo, setAddingTo] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [productSearch, setProductSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [grams, setGrams] = useState('')
  const [error, setError] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const products = JSON.parse(localStorage.getItem('products') || '[]')

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  const selectedProductData = products.find(p => p.id === parseInt(selectedProduct))

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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

  const dayEntries = diary.filter(e => e.date === selectedDate)
  const dayTotals = dayEntries.reduce((acc, e) => {
    acc.calories += e.calories
    acc.proteins += e.proteins
    acc.fats += e.fats
    acc.carbs += e.carbs
    return acc
  }, { calories: 0, proteins: 0, fats: 0, carbs: 0 })

  const getEntriesByMeal = (mealType) =>
    dayEntries.filter(e => e.mealType === mealType)

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
    localStorage.setItem('selectedDate', e.target.value)
  }

  const handleSave = (mealType) => {
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
    if (!product) return
    const coefficient = gramsNum / 100

    if (editingId) {
      const updated = diary.map(e => {
        if (e.id === editingId) {
          return {
            ...e,
            productId: product.id,
            productName: product.name,
            grams: gramsNum,
            proteins: +(product.proteins * coefficient).toFixed(1),
            fats: +(product.fats * coefficient).toFixed(1),
            carbs: +(product.carbs * coefficient).toFixed(1),
            calories: +(product.calories * coefficient).toFixed(0)
          }
        }
        return e
      })
      setDiary(updated)
      localStorage.setItem('diary', JSON.stringify(updated))
    } else {
      const entry = {
        id: Date.now(),
        date: selectedDate,
        mealType,
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
    }

    setAddingTo(null)
    setEditingId(null)
    setSelectedProduct('')
    setProductSearch('')
    setGrams('')
    setError('')
  }

  const handleEdit = (entry) => {
    setEditingId(entry.id)
    setAddingTo(entry.mealType)
    setSelectedProduct(String(entry.productId))
    setProductSearch(entry.productName)
    setGrams(String(entry.grams))
    setError('')
  }

  const handleCancel = () => {
    setAddingTo(null)
    setEditingId(null)
    setSelectedProduct('')
    setProductSearch('')
    setGrams('')
    setError('')
  }

  const deleteEntry = (id) => {
    const updated = diary.filter(e => e.id !== id)
    setDiary(updated)
    localStorage.setItem('diary', JSON.stringify(updated))
  }

  const ProgressBar = ({ current, target, label, unit, color }) => {
    const percent = target ? Math.min((current / target) * 100, 100) : 0
    const over = target && current > target
    return (
      <div style={{ flex: 1, minWidth: 120 }}>
        <div style={{ fontSize: 12, marginBottom: 2, color: '#666' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>
          {current}{unit} / {target || '?'}{unit}
        </div>
        <div style={{ height: 8, background: '#e0e0e0', borderRadius: 4, marginTop: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${percent}%`,
            background: over ? '#e53935' : color,
            borderRadius: 4,
            transition: 'width 0.3s'
          }} />
        </div>
      </div>
    )
  }

  return (
    <>
      <h1>Дневник питания</h1>

      <div style={{ marginBottom: 20 }}>
        <label>Дата: </label>
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </div>

      {targets && (
        <div className="counter" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <ProgressBar current={dayTotals.calories} target={targets.calories} label="Калории" unit=" ккал" color="#4caf50" />
          <ProgressBar current={+dayTotals.proteins.toFixed(1)} target={targets.proteins} label="Белки" unit="г" color="#2196f3" />
          <ProgressBar current={+dayTotals.fats.toFixed(1)} target={targets.fats} label="Жиры" unit="г" color="#ff9800" />
          <ProgressBar current={+dayTotals.carbs.toFixed(1)} target={targets.carbs} label="Углеводы" unit="г" color="#9c27b0" />
        </div>
      )}

      {!targets && (
        <div className="counter">
          <span style={{ color: '#888' }}>Заполните <Link to="/profile">профиль</Link> для отображения целей</span>
        </div>
      )}

      {MEAL_TYPES.map(mealType => {
        const entries = getEntriesByMeal(mealType)
        const isAdding = addingTo === mealType

        return (
          <div key={mealType} style={{
            marginBottom: 20,
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            overflow: 'visible',
            position: 'relative'
          }}>
            <div style={{
              background: '#fafafa',
              padding: '12px 16px',
              fontWeight: 600,
              fontSize: 16,
              borderBottom: '1px solid #e0e0e0'
            }}>
              {mealType}
              {entries.length > 0 && (
                <span style={{ fontWeight: 400, fontSize: 13, color: '#888', marginLeft: 8 }}>
                  {entries.reduce((s, e) => s + e.calories, 0)} ккал
                </span>
              )}
            </div>

            {entries.length > 0 && (
              <table style={{ margin: 0 }}>
                <tbody>
                  {entries.map(e => (
                    <tr key={e.id}>
                      <td>{e.productName}</td>
                      <td>{e.grams}г</td>
                      <td>Б: {e.proteins} Ж: {e.fats} У: {e.carbs}</td>
                      <td>{e.calories} ккал</td>
                      <td style={{ width: 80 }}>
                        <div className="btn-group">
                          <button className="btn-icon btn-edit" onClick={() => handleEdit(e)} title="Редактировать">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button className="btn-icon btn-delete" onClick={() => deleteEntry(e.id)} title="Удалить">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"/>
                              <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {isAdding ? (
              <div style={{ padding: 12, background: '#f9f9f9', display: 'flex', gap: 8, alignItems: 'end', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
                <div ref={dropdownRef} style={{ position: 'relative', minWidth: 200 }}>
                  <input
                    type="text"
                    value={productSearch}
                    onChange={e => {
                      setProductSearch(e.target.value)
                      setSelectedProduct('')
                      setShowDropdown(true)
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Поиск продукта..."
                    style={{ width: '100%' }}
                  />
                  {showDropdown && filteredProducts.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      maxHeight: 200,
                      overflowY: 'auto',
                      background: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: 4,
                      zIndex: 20,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      {filteredProducts.map(p => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedProduct(String(p.id))
                            setProductSearch(p.name)
                            setShowDropdown(false)
                          }}
                          style={{
                            padding: '8px 10px',
                            cursor: 'pointer',
                            background: String(p.id) === selectedProduct ? '#e8f5e9' : 'transparent'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                          onMouseLeave={e => {
                            if (String(p.id) !== selectedProduct) e.currentTarget.style.background = 'transparent'
                          }}
                        >
                          {p.name} <span style={{ color: '#888', fontSize: 12 }}>{p.calories} ккал</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    value={grams}
                    onChange={e => setGrams(e.target.value)}
                    placeholder="г"
                    min="1"
                    max="10000"
                    style={{ width: 70 }}
                  />
                </div>
                <button onClick={() => handleSave(mealType)}>
                  {editingId ? 'Сохранить' : 'Добавить'}
                </button>
                <button onClick={handleCancel} style={{ background: '#999' }}>Отмена</button>
                {error && <span className="error">{error}</span>}
              </div>
            ) : (
              <div style={{ padding: 10, textAlign: 'center' }}>
                <button
                  onClick={() => {
                    setAddingTo(mealType)
                    setEditingId(null)
                    setSelectedProduct('')
                    setProductSearch('')
                    setGrams('')
                    setError('')
                  }}
                  style={{ background: 'none', color: '#4caf50', fontSize: 14 }}
                >
                  + Добавить продукт
                </button>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

export default DiaryPage
