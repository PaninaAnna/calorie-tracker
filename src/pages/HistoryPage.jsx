import { useMemo } from 'react'
import { Link } from 'react-router-dom'

function HistoryPage() {
  const diary = useMemo(() => {
    const saved = localStorage.getItem('diary')
    return saved ? JSON.parse(saved) : []
  }, [])

  // Группируем по датам
  const grouped = useMemo(() => {
    const map = {}
    diary.forEach(e => {
      if (!map[e.date]) {
        map[e.date] = { calories: 0, proteins: 0, fats: 0, carbs: 0, meals: 0 }
      }
      map[e.date].calories += e.calories
      map[e.date].proteins += e.proteins
      map[e.date].fats += e.fats
      map[e.date].carbs += e.carbs
      map[e.date].meals += 1
    })
    // Сортируем по датам (сначала новые)
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
  }, [diary])

  return (
    <>
      <h1>История питания</h1>

      {grouped.length === 0 ? (
        <p className="empty">Нет записей. Добавьте приёмы пищи в дневнике.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Приёмов</th>
              <th>Ккал</th>
              <th>Белки</th>
              <th>Жиры</th>
              <th>Углеводы</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {grouped.map(([date, totals]) => (
              <tr key={date}>
                <td>{date}</td>
                <td>{totals.meals}</td>
                <td>{totals.calories}</td>
                <td>{totals.proteins.toFixed(1)}г</td>
                <td>{totals.fats.toFixed(1)}г</td>
                <td>{totals.carbs.toFixed(1)}г</td>
                <td>
                  <Link to={`/?date=${date}`}>Открыть</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}

export default HistoryPage
