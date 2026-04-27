import { useParams } from "react-router";
import { useEffect, useState } from "react";

// Adaptamos la interfaz a la respuesta real de PokeAPI
interface PokemonData {
  name: string;
  id: number;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": { front_default: string };
    };
  };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string } }[];
  height: number;
  weight: number;
}

function PokemonDetalle() {
  // El parámetro ahora es 'name' (o el que hayas definido en tu Router)
  const { equipo: pokemonName } = useParams<{ equipo: string }>();

  const [data, setData] = useState<PokemonData | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!pokemonName) return;

    // Revisar si ya es favorito en localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorites.includes(pokemonName)) {
      setIsFavorite(true);
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
        );
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.error("Error cargando el Pokémon:", error);
      }
    };

    fetchData();
  }, [pokemonName]);

  const toggleFavorite = () => {
    if (!pokemonName) return;

    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (favorites.includes(pokemonName)) {
      favorites = favorites.filter((fav: string) => fav !== pokemonName);
      setIsFavorite(false);
    } else {
      favorites.push(pokemonName);
      setIsFavorite(true);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  if (!data) return <p>Cargando datos del Pokémon...</p>;

  return (
    <div className="pokemon-container">
      <header style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <img 
          src={data.sprites.other["official-artwork"].front_default} 
          alt={data.name} 
          style={{ width: '150px' }}
        />
        <div>
          <h1 style={{ textTransform: 'capitalize' }}>
            {data.name} #{data.id}
            <button onClick={toggleFavorite} style={{ marginLeft: '15px', cursor: 'pointer' }}>
              {isFavorite ? "❤️" : "🤍"}
            </button>
          </h1>
          <div className="types">
            {data.types.map(t => (
              <span key={t.type.name} className={`badge ${t.type.name}`} style={{ marginRight: '5px', padding: '5px 10px', borderRadius: '4px', background: '#eee' }}>
                {t.type.name.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section>
        <h2>Información Física</h2>
        <p><strong>Altura:</strong> {data.height / 10} m</p>
        <p><strong>Peso:</strong> {data.weight / 10} kg</p>
      </section>

      <section>
        <h2>Estadísticas Base</h2>
        <ul>
          {data.stats.map(s => (
            <li key={s.stat.name}>
              <strong style={{ textTransform: 'capitalize' }}>{s.stat.name}:</strong> {s.base_stat}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Habilidades</h2>
        <ul>
          {data.abilities.map(a => (
            <li key={a.ability.name} style={{ textTransform: 'capitalize' }}>
              {a.ability.name}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Sprites</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <img src={data.sprites.front_default} alt="Frente" />
          {/* Puedes agregar más variantes si quieres */}
        </div>
      </section>
    </div>
  );
}

export default PokemonDetalle;