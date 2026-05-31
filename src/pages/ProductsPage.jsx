import { useState } from 'react'
import { Link } from 'react-router-dom'

function ProductsPage() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products')
    return saved ? JSON.parse(saved) : []
  })

  const deleteProduct = (id) => {
    const updated = products.filter(p => p.id !== id)
    setProducts(updated)
    localStorage.setItem('products', JSON.stringify(updated))
  }

  return (
    <>
      <h1>База продуктов</h1>
      <Link to="/products/add">+ Добавить продукт</Link>

      {products.length === 0 ? (
        <p>Нет продуктов. Добавьте первый!</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: 16, borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Название</th>
              <th>Белки</th>
              <th>Жиры</th>
              <th>Углеводы</th>
              <th>Ккал</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.proteins}</td>
                <td>{p.fats}</td>
                <td>{p.carbs}</td>
                <td>{p.calories}</td>
                <td>
                  <button onClick={() => deleteProduct(p.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}

export default ProductsPage
