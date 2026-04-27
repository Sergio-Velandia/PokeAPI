import { useEffect, useState } from 'react';
import "./style.css";

function Original() {
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Función estrella: busca un Pokémon aleatorio entre los 151 originales
  const obtenerAleatorio = async () => {
    setLoading(true);
    const idRandom = Math.floor(Math.random() * 151) + 1;
    
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idRandom}`);
      const data = await res.json();
      setPokemon(data);
    } catch (error) {
      console.error("Error al buscar el Pokémon", error);
    } finally {
      setLoading(false);
    }
  };

  // Carga uno al azar nada más entrar a la página
  useEffect(() => {
    obtenerAleatorio();
  }, []);

  return (
    <div className="original-simple-container">
      <div className="controls">
        <h1>Generador Aleatorio</h1>
        <button className="btn-random-big" onClick={obtenerAleatorio} disabled={loading}>
          {loading ? "Buscando..." : "🎲 ¡OTRO POKÉMON!"}
        </button>
      </div>

      {pokemon && !loading && (
        <div className="poke-display-card">
          <div className="poke-header">
            <span className="poke-id">#{pokemon.id}</span>
            <h2 className="poke-name-main">{pokemon.name}</h2>
          </div>

          <div className="poke-image-container">
            <img 
              src={pokemon.sprites.other["official-artwork"].front_default} 
              alt={pokemon.name} 
            />
          </div>

          <div className="poke-stats-simple">
            <div className="badge-row">
              {pokemon.types.map((t: any) => (
                <span key={t.type.name} className={`tag-type ${t.type.name}`}>
                  {t.type.name}
                </span>
              ))}
            </div>
            
            <div className="extra-info">
              <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
              <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Original;