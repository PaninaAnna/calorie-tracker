import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DiaryPage from './pages/DiaryPage'
import ProductsPage from './pages/ProductsPage'
import AddProductPage from './pages/AddProductPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DiaryPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/add" element={<AddProductPage />} />
      </Routes>
    </Layout>
  )
}

export default App
