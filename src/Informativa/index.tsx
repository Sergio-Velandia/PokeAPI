import { useParams } from 'react-router';
import "./style.css"
function Informativa() {
    const { informativa } = useParams<{ informativa: string }>()
  return (
    <>
      <p>{informativa}</p>
    </>
  )
}

export default Informativa