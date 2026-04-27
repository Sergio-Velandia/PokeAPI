import { useState, useEffect } from 'react';
import "./style.css";

// --- INTERFACES ---
interface PokemonBasic {
  name: string;
  id: number;
  imageUrl: string;
}

interface PokemonFull {
  name: string;
  id: number;
  height: number;
  weight: number;
  sprites: {
    other: { "official-artwork": { front_default: string } };
  };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

type FiltroTipo = 'all' | 'fire' | 'water' | 'grass' | 'electric' | 'psychic';

function PokedexHome() {
  // --- ESTADOS ---
  const [pokemonList, setPokemonList] = useState<PokemonBasic[]>([]);
  const [filtro, setFiltro] = useState<FiltroTipo>('all');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados para el Detalle
  const [nombreSeleccionado, setNombreSeleccionado] = useState<string | null>(null);
  const [detalle, setDetalle] = useState<PokemonFull | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // Estado para Favoritos
  const [favoritos, setFavoritos] = useState<string[]>([]);

  const filtros: FiltroTipo[] = ['all', 'fire', 'water', 'grass', 'electric', 'psychic'];

  // --- EFECTOS ---

  // 1. Cargar favoritos al iniciar
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavoritos(stored);
  }, []);

  // 2. Cargar lista principal de Pokémon
  useEffect(() => {
    const fetchLista = async () => {
      setLoading(true);
      try {
        const url = filtro === 'all' 
          ? 'https://pokeapi.co/api/v2/pokemon?limit=151' 
          : `https://pokeapi.co/api/v2/type/${filtro}`;
        
        const res = await fetch(url);
        const data = await res.json();
        const results = filtro === 'all' ? data.results : data.pokemon.map((p: any) => p.pokemon);

        const formatted = results.map((p: any) => {
          const id = p.url.split('/').filter(Boolean).pop();
          return {
            name: p.name,
            id: parseInt(id),
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
          };
        });
        setPokemonList(formatted);
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    };
    fetchLista();
  }, [filtro]);

  // 3. Cargar detalle cuando se selecciona uno
  useEffect(() => {
    if (!nombreSeleccionado) return;
    const fetchDetalle = async () => {
      setLoadingDetalle(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombreSeleccionado}`);
        const data = await res.json();
        setDetalle(data);
      } catch (e) { console.error(e); } 
      finally { setLoadingDetalle(false); }
    };
    fetchDetalle();
  }, [nombreSeleccionado]);

  // --- FUNCIONES ---
  const toggleFavorite = (e: React.MouseEvent, name: string) => {
    e.stopPropagation(); // Evita que al dar click al corazón se abra el detalle por error
    let newFavs: string[];
    if (favoritos.includes(name)) {
      newFavs = favoritos.filter(f => f !== name);
    } else {
      newFavs = [...favoritos, name];
    }
    setFavoritos(newFavs);
    localStorage.setItem("favorites", JSON.stringify(newFavs));
  };

  const pokemonFiltrados = pokemonList.filter(p => 
    busqueda.length < 3 ? true : p.name.includes(busqueda.toLowerCase())
  );

  // --- RENDERIZADO ---

  return (
    <div className="pokedex-main-container" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* VISTA DE DETALLE (MODAL O SUPERPUESTO) */}
      {nombreSeleccionado && (
        <div className="overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', maxWidth: '500px', width: '90%', position: 'relative' }}>
            <button onClick={() => { setNombreSeleccionado(null); setDetalle(null); }} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>✖ Cerrar</button>
            
            {loadingDetalle || !detalle ? <p>Cargando datos...</p> : (
              <div style={{ textAlign: 'center' }}>
                <img src={detalle.sprites.other["official-artwork"].front_default} alt={detalle.name} style={{ width: '150px' }} />
                <h2 style={{ textTransform: 'capitalize' }}>{detalle.name} #{detalle.id}</h2>
                <button 
                    onClick={(e) => toggleFavorite(e, detalle.name)} 
                    style={{ background: 'none', border: '1px solid #ddd', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' }}
                >
                    {favoritos.includes(detalle.name) ? "❤️ Quitar de Favoritos" : "🤍 Agregar a Favoritos"}
                </button>
                <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', textAlign: 'left' }}>
                  <p><strong>Altura:</strong> {detalle.height / 10} m</p>
                  <p><strong>Peso:</strong> {detalle.weight / 10} kg</p>
                </div>
                <div style={{ textAlign: 'left', marginTop: '10px' }}>
                    <strong>Stats:</strong>
                    {detalle.stats.slice(0,3).map(s => (
                        <div key={s.stat.name} style={{ fontSize: '0.8rem' }}>
                            {s.stat.name.toUpperCase()}: {s.base_stat}
                        </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DISEÑO DEL HOME */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
        
        {/* COLUMNA PRINCIPAL: LISTA */}
        <section>
          <h1>Pokédex Home</h1>
          
          <div className="filtros" style={{ marginBottom: '20px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {filtros.map(f => (
              <button 
                key={f} 
                onClick={() => setFiltro(f)} 
                className={filtro === f ? 'activo' : ''}
                style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: filtro === f ? '#ffcb05' : '#eee' }}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            value={busqueda} 
            onChange={e => setBusqueda(e.target.value)} 
            style={{ width: '100%', padding: '12px', marginBottom: '20px', boxSizing: 'border-box' }}
          />

          <div className="tabla-container">
            {loading ? <p>Cargando lista...</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Favorito</th>
                    <th>Info</th>
                  </tr>
                </thead>
                <tbody>
                  {pokemonFiltrados.map(poke => (
                    <tr key={poke.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td>#{poke.id}</td>
                      <td><img src={poke.imageUrl} width="50" alt={poke.name} /></td>
                      <td style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{poke.name}</td>
                      <td>
                        <button 
                            onClick={(e) => toggleFavorite(e, poke.name)} 
                            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                        >
                          {favoritos.includes(poke.name) ? '❤️' : '🤍'}
                        </button>
                      </td>
                      <td>
                        <button onClick={() => setNombreSeleccionado(poke.name)}>Detalles</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* COLUMNA LATERAL: FAVORITOS */}
        <aside style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', height: 'fit-content' }}>
          <h2 style={{ marginTop: 0 }}>⭐ Mis Favoritos</h2>
          {favoritos.length === 0 ? <p style={{ color: '#888' }}>No tienes favoritos guardados.</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {favoritos.map(favName => (
                <li key={favName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                  <span 
                    style={{ textTransform: 'capitalize', cursor: 'pointer', color: '#2a75bb' }} 
                    onClick={() => setNombreSeleccionado(favName)}
                  >
                    {favName}
                  </span>
                  <button 
                    onClick={(e) => toggleFavorite(e, favName)} 
                    style={{ fontSize: '0.7rem', color: 'red', border: '1px solid red', background: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

      </div>
    </div>
  );
}

export default PokedexHome;