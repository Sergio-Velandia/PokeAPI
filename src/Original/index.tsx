import { useParams } from 'react-router';
import "./style.css"
function Original() {
    const { original } = useParams<{ original: string }>()
  return (
    <>
      <p>{original}</p>
    
    </>
  )
}

export default Original