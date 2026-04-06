import { useParams } from 'react-router';
import "./style.css"
function Equipo() {
    const { equipo } = useParams<{ equipo: string }>()
  return (
    <>
      <p>{equipo}</p>
    </>
  )
}

export default Equipo