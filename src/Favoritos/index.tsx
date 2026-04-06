import { useParams } from 'react-router';
import "./style.css"
function Favoritos() {
    const { favoritos } = useParams<{ favoritos: string }>()
  return (
    <>
      <p>{favoritos}</p>
    </>
  )
}

export default Favoritos