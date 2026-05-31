import { useState } from 'react'

const MEAL_TABS = ['Завтрак', 'Обед', 'Ужин', 'Перекус']

function DiaryPage() {
  const [activeTab, setActiveTab] = useState('Завтрак')

  return (
    <>
      <h1>Дневник питания</h1>

      {/* Вкладки */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {MEAL_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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

      <p>Активная вкладка: <strong>{activeTab}</strong></p>
    </>
  )
}

export default DiaryPage
