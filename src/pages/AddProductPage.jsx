import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddProductPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    proteins: '',
    fats: '',
    carbs: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const proteins = parseFloat(form.proteins) || 0
  const fats = parseFloat(form.fats) || 0
  const carbs = parseFloat(form.carbs) || 0
  const calories = (proteins * 4 + fats * 9 + carbs * 4).toFixed(0)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      setError('Введите название продукта')
      return
    }
    if (proteins < 0 || fats < 0 || carbs < 0) {
      setError('Значения БЖУ не могут быть отрицательными')
      return
    }
    if (proteins + fats + carbs > 100) {
      setError('Сумма БЖУ на 100г не может превышать 100')
      return
    }

    const newProduct = {
      id: Date.now(),
      name: form.name.trim(),
      proteins,
      fats,
      carbs,
      calories: parseInt(calories)
    }

    const saved = localStorage.getItem('products')
    const products = saved ? JSON.parse(saved) : []
    products.push(newProduct)
    localStorage.setItem('products', JSON.stringify(products))

    navigate('/products')
  }

  return (
    <>
      <h1>Добавить продукт</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        {error && <p className="error" style={{ marginBottom: 16 }}>{error}</p>}

        <div className="form-group">
          <label>Название</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Белки (г на 100г)</label>
          <input name="proteins" type="number" step="0.1" value={form.proteins} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Жиры (г на 100г)</label>
          <input name="fats" type="number" step="0.1" value={form.fats} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Углеводы (г на 100г)</label>
          <input name="carbs" type="number" step="0.1" value={form.carbs} onChange={handleChange} />
        </div>

        <p style={{ marginBottom: 16 }}><strong>Калорийность:</strong> {calories} ккал / 100г</p>

        <button type="submit">Сохранить</button>
      </form>
    </>
  )
}

export default AddProductPage
