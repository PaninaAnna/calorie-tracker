import { Link } from 'react-router-dom'

function ProductsPage() {
  return (
    <>
      <h1>База продуктов</h1>
      <Link to="/products/add">+ Добавить продукт</Link>
    </>
  )
}

export default ProductsPage
