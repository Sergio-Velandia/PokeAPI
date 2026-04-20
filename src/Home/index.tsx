import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router'
import { EquiposContext } from "../EquiposContext";

import "./style.css";

interface Ranking {
  rank: number
  contestantName: string
  points: number
  matchesPlayed: number
}

interface Estadistica {
  position: number
  name: string
  value: number
  appearances: number
  contestantName: string
  statName: string
}

type FiltroTipo = 'posiciones' | 'goleador' | 'asistencias' | 'amarillas' | 'atajadas'

function Home() {
  const [ranking, setRanking] = useState<Ranking[]>([])
  const [title, setTitle] = useState('')
  const [filtro, setFiltro] = useState<FiltroTipo>('posiciones')
  const [estadisticas, setEstadisticas] = useState<Estadistica[]>([])
  const [busqueda, setBusqueda] = useState('')

  const equiposMap = useContext(EquiposContext);
  const filtros: FiltroTipo[] = ['posiciones', 'goleador', 'asistencias', 'amarillas', 'atajadas'];

  useEffect(() => {
    setBusqueda('') 
    const fetchData = async () => {
      try {
        const res = await fetch(`https://raw.githubusercontent.com/sdtibata/dataliga/refs/heads/main/${filtro}.json`)
        const data = await res.json()

        if (filtro === 'posiciones') {
          setRanking(data.standings[0].ranking)
          setTitle(data.standings[0].competitionName)
        } else {
          setEstadisticas(data)
        }
      } catch (error) {
        console.error('Error cargando datos:', error)
      }
    }
    fetchData()
  }, [filtro])

  // 1. Lógica de filtrado para el buscador
  const rankingFiltrado = ranking.filter((equipo) =>
    busqueda.length < 3
      ? true 
      : equipo.contestantName.toLowerCase().includes(busqueda.toLowerCase())
  )

  const estadisticasFiltradas = estadisticas.filter((jugador) =>
    busqueda.length < 3
      ? true 
      : jugador.name.toLowerCase().includes(busqueda.toLowerCase()) ||
        jugador.contestantName.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <>
      <div className="filtros">
        {filtros.map((onestat) => (
          <button
            key={onestat}
            onClick={() => setFiltro(onestat)}
            className={filtro === onestat ? 'activo' : ''}
          >
            {onestat}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Buscar..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="tabla-container">
        <h2>{title}</h2>
        {filtro === 'posiciones' ? (
          <table className="tabla-posiciones">
            <thead>
              <tr>
                <th>#</th>
                <th>Equipo</th>
                <th>PJ</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {/* 2. USAR rankingFiltrado en lugar de ranking */}
              {rankingFiltrado.map((equipo) => (
                <tr key={equipo.rank}>
                  <td>{equipo.rank}</td>
                  <td>
                    <Link to={`/equipo/${equiposMap[equipo.contestantName] || "default"}`}>
                      {equipo.contestantName}
                    </Link>
                  </td>
                  <td>{equipo.matchesPlayed}</td>
                  <td>{equipo.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="tabla-estadisticas">
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>Equipo</th>
                <th>PJ</th>
                <th>{filtro}</th>
              </tr>
            </thead>
            <tbody>
              {/* 3. USAR estadisticasFiltradas en lugar de estadisticas */}
              {estadisticasFiltradas.map((jugador, index) => (
                <tr key={index}>
                  <td>{jugador.position}</td>
                  <td>{jugador.name}</td>
                  <td>{jugador.contestantName}</td>
                  <td>{jugador.appearances}</td>
                  <td>{jugador.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default Home