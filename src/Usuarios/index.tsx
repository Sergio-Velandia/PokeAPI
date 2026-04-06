import { useParams } from 'react-router';
import "./style.css"
function Usuarios() {
    const { usuarios } = useParams<{ usuarios: string }>()
  return (
    <>
      <p>{usuarios}</p>
    </>
  )
}

export default Usuarios