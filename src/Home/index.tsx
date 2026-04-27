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

function PokedexCompleta() {
  // Estados para la Lista
  const [pokemonList, setPokemonList] = useState<PokemonBasic[]>([]);
  const [filtro, setFiltro] = useState<FiltroTipo>('all');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados para el Detalle (Lo que permite "Ver Detalles" sin cambiar de página)
  const [nombreSeleccionado, setNombreSeleccionado] = useState<string | null>(null);
  const [detalle, setDetalle] = useState<PokemonFull | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  const filtros: FiltroTipo[] = ['all', 'fire', 'water', 'grass', 'electric', 'psychic'];

  // 1. Cargar la lista principal
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
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLista();
  }, [filtro]);

  // 2. Cargar el detalle cuando se hace clic en un nombre
  useEffect(() => {
    if (!nombreSeleccionado) return;

    const fetchDetalle = async () => {
      setLoadingDetalle(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombreSeleccionado}`);
        const data = await res.json();
        setDetalle(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingDetalle(false);
      }
    };
    fetchDetalle();
  }, [nombreSeleccionado]);

  // Filtrado por buscador
  const pokemonFiltrados = pokemonList.filter(p => 
    busqueda.length < 3 ? true : p.name.includes(busqueda.toLowerCase())
  );

  // --- RENDERIZADO CONDICIONAL ---
  
  // Vista 1: Detalle del Pokémon
  if (nombreSeleccionado) {
    return (
      <div className="detalle-view" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => { setNombreSeleccionado(null); setDetalle(null); }} className="btn-volver">
          ⬅ Volver a la lista
        </button>

        {loadingDetalle || !detalle ? (
          <p>Cargando datos de {nombreSeleccionado}...</p>
        ) : (
          <div className="card-detalle" style={{ textAlign: 'center', marginTop: '20px', border: '1px solid #ddd', padding: '20px', borderRadius: '15px' }}>
            <img 
              src={detalle.sprites.other["official-artwork"].front_default} 
              alt={detalle.name} 
              style={{ width: '200px' }} 
            />
            <h1 style={{ textTransform: 'capitalize' }}>{detalle.name} #{detalle.id}</h1>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {detalle.types.map(t => (
                <span key={t.type.name} className={`badge ${t.type.name}`} style={{ padding: '5px 10px', background: '#eee', borderRadius: '5px' }}>
                  {t.type.name.toUpperCase()}
                </span>
              ))}
            </div>

            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: '#f4f4f4', padding: '10px', borderRadius: '8px' }}>
                <strong>Peso:</strong> {detalle.weight / 10} kg
              </div>
              <div style={{ background: '#f4f4f4', padding: '10px', borderRadius: '8px' }}>
                <strong>Altura:</strong> {detalle.height / 10} m
              </div>
            </div>

            <h3 style={{ marginTop: '20px' }}>Estadísticas Base</h3>
            <div style={{ textAlign: 'left' }}>
              {detalle.stats.map(s => (
                <div key={s.stat.name} style={{ marginBottom: '5px' }}>
                  <small style={{ textTransform: 'capitalize' }}>{s.stat.name}</small>
                  <div style={{ background: '#eee', height: '10px', borderRadius: '5px' }}>
                    <div style={{ background: '#ffcb05', width: `${(s.base_stat / 150) * 100}%`, height: '100%', borderRadius: '5px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vista 2: Lista Principal (Home)
  return (
    <div style={{ padding: '20px' }}>
      <div className="filtros">
        {filtros.map(f => (
          <button key={f} onClick={() => setFiltro(f)} className={filtro === f ? 'activo' : ''}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <input 
        type="text" 
        placeholder="Buscar Pokémon..." 
        value={busqueda} 
        onChange={e => setBusqueda(e.target.value)} 
        className="search-input"
      />

      <div className="tabla-container">
        <h2>{filtro === 'all' ? 'Primera Generación' : `Tipo: ${filtro}`}</h2>
        {loading ? <p>Cargando Pokédex...</p> : (
          <table className="tabla-posiciones">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sprite</th>
                <th>Nombre</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pokemonFiltrados.map(poke => (
                <tr key={poke.id}>
                  <td>#{poke.id}</td>
                  <td><img src={poke.imageUrl} alt={poke.name} width="50" /></td>
                  <td style={{ textTransform: 'capitalize' }}>{poke.name}</td>
                  <td>
                    {/* CAMBIO CLAVE: Aquí disparamos el estado en lugar de navegar */}
                    <button onClick={() => setNombreSeleccionado(poke.name)} className="btn-detalle">
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PokedexCompleta;