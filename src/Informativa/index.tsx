import { useNavigate } from 'react-router';
import "./style.css"

function Informativa() {
  const navigate = useNavigate();

  return (
    <div className="informativa-container">
      <header className="info-header">
        <h1>Centro de Información <span>PokéApp</span></h1>
        <p>¿Qué puedes hacer en esta plataforma?</p>
      </header>

      <div className="info-grid">
        {/* Tarjeta 1 */}
        <div className="info-card">
          <div className="icon">🔍</div>
          <h3>Explorar Pokédex</h3>
          <p>En el <strong>Home</strong>, puedes ver la lista completa de los 151 Pokémon originales, filtrarlos por tipo y buscar a tus favoritos por nombre.</p>
        </div>

        {/* Tarjeta 2 */}
        <div className="info-card">
          <div className="icon">⭐</div>
          <h3>Gestionar Favoritos</h3>
          <p>Guarda los Pokémon que más te gusten. Usamos <strong>LocalStorage</strong> para que tu lista de favoritos se mantenga guardada aunque cierres el navegador.</p>
        </div>

        {/* Tarjeta 3 */}
        <div className="info-card">
          <div className="icon">🎲</div>
          <h3>Modo Original</h3>
          <p>Nuestra sección <strong>Original</strong> te permite descubrir Pokémon de manera aleatoria, ideal para conocer nuevos especímenes y sus estadísticas base.</p>
        </div>

        {/* Tarjeta 4 */}
        <div className="info-card">
          <div className="icon">⚙️</div>
          <h3>Tecnología</h3>
          <p>Esta web está construida con <strong>React</strong>, utiliza <strong>React Router</strong> para la navegación y consume datos en tiempo real de la <strong>PokéAPI</strong>.</p>
        </div>
      </div>

      <footer className="info-footer">
        <button onClick={() => navigate("/")} className="btn-comenzar">
          ¡Empezar a Explorar!
        </button>
      </footer>
    </div>
  )
}

export default Informativa