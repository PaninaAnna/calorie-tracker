import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

function ProductsPage() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products')
    return saved ? JSON.parse(saved) : []
  })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', proteins: '', fats: '', carbs: '' })
  const [editError, setEditError] = useState('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useMemo(() => {
    let list = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    list.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name)
      if (sortBy === 'calories') cmp = a.calories - b.calories
      if (sortBy === 'proteins') cmp = a.proteins - b.proteins
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [products, search, sortBy, sortDir])

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <span style={{ color: '#ccc', marginLeft: 4 }}>⇅</span>
    return <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setEditForm({
      name: product.name,
      proteins: String(product.proteins),
      fats: String(product.fats),
      carbs: String(product.carbs)
    })
    setEditError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditError('')
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const saveEdit = () => {
    const proteins = parseFloat(editForm.proteins) || 0
    const fats = parseFloat(editForm.fats) || 0
    const carbs = parseFloat(editForm.carbs) || 0

    if (!editForm.name.trim()) {
      setEditError('Введите название')
      return
    }
    if (proteins < 0 || fats < 0 || carbs < 0) {
      setEditError('БЖУ не могут быть отрицательными')
      return
    }
    if (proteins + fats + carbs > 100) {
      setEditError('Сумма БЖУ на 100г не может превышать 100')
      return
    }

    const calories = proteins * 4 + fats * 9 + carbs * 4

    const updated = products.map(p =>
      p.id === editingId
        ? { ...p, name: editForm.name.trim(), proteins, fats, carbs, calories: Math.round(calories) }
        : p
    )
    setProducts(updated)
    localStorage.setItem('products', JSON.stringify(updated))
    setEditingId(null)
  }

  const deleteProduct = (id) => {
    const updated = products.filter(p => p.id !== id)
    setProducts(updated)
    localStorage.setItem('products', JSON.stringify(updated))
  }

  return (
    <>
      <h1>База продуктов</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'end' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по названию..."
            style={{ width: '100%' }}
          />
        </div>
        <Link to="/products/add" className="btn-link" style={{ marginBottom: 0 }}>+ Добавить</Link>
      </div>

      {products.length === 0 ? (
        <p className="empty">Нет продуктов. Добавьте первый!</p>
      ) : filtered.length === 0 ? (
        <p className="empty">Ничего не найдено по запросу «{search}»</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>
                Название <SortIcon field="name" />
              </th>
              <th onClick={() => toggleSort('proteins')} style={{ cursor: 'pointer' }}>
                Белки <SortIcon field="proteins" />
              </th>
              <th>Жиры</th>
              <th>Углеводы</th>
              <th onClick={() => toggleSort('calories')} style={{ cursor: 'pointer' }}>
                Ккал <SortIcon field="calories" />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              editingId === p.id ? (
                <tr key={p.id}>
                  <td>
                    <input name="name" value={editForm.name} onChange={handleEditChange} style={{ width: '100%' }} />
                  </td>
                  <td>
                    <input name="proteins" type="number" step="0.1" value={editForm.proteins} onChange={handleEditChange} style={{ width: 70 }} />
                  </td>
                  <td>
                    <input name="fats" type="number" step="0.1" value={editForm.fats} onChange={handleEditChange} style={{ width: 70 }} />
                  </td>
                  <td>
                    <input name="carbs" type="number" step="0.1" value={editForm.carbs} onChange={handleEditChange} style={{ width: 70 }} />
                  </td>
                  <td>
                    {Math.round((parseFloat(editForm.proteins) || 0) * 4 + (parseFloat(editForm.fats) || 0) * 9 + (parseFloat(editForm.carbs) || 0) * 4)}
                  </td>
                  <td style={{ width: 110 }}>
                    {editError && <span className="error" style={{ marginRight: 8 }}>{editError}</span>}
                    <div className="btn-group" style={{ display: 'inline-flex' }}>
                      <button className="btn-icon btn-edit" onClick={saveEdit} title="Сохранить" style={{ color: '#4caf50' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </button>
                      <button className="btn-icon btn-delete" onClick={cancelEdit} title="Отмена">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td>{p.proteins}</td>
                  <td>{p.fats}</td>
                  <td>{p.carbs}</td>
                  <td style={{ fontWeight: 600 }}>{p.calories}</td>
                  <td style={{ width: 80 }}>
                    <div className="btn-group">
                      <button className="btn-icon btn-edit" onClick={() => startEdit(p)} title="Редактировать">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className="btn-icon btn-delete" onClick={() => deleteProduct(p.id)} title="Удалить">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}

export default ProductsPage
