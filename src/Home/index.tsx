import { useParams } from 'react-router';
import "./style.css"
function Home() {
    const { home } = useParams<{ home: string }>()
  return (
    <>
      <p>{home}</p>
    </>
  )
}

export default Home