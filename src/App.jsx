import React, { useState, useMemo } from 'react'
import FileLoader from './components/FileLoader'
import IPTable from './components/IPTable'
import IPGridMap from './components/IPGridMap'
import { normalizeRows, inferState } from './utils/ip'

export default function App() {
  const [rows, setRows] = useState([])
  const [filterState, setFilterState] = useState('all')
  const [filterGroup, setFilterGroup] = useState('All')
  const [query, setQuery] = useState('')
  const [cidr, setCidr] = useState('')

  const onLoad = (raw) => {
    const n = normalizeRows(raw)
    // infer estado by nombre de maquina
    n.forEach(r => { r.estado = inferState(r) })
    setRows(n)
  }

  const groups = useMemo(() => {
    const s = new Set(rows.map(r => r.grupo || '').filter(Boolean))
    return ['All', ...Array.from(s).sort()]
  }, [rows])

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (filterState !== 'all') {
        if (filterState === 'ocupada' && r.estado !== 'ocupada') return false
        if (filterState === 'libre' && r.estado !== 'libre') return false
      }
      if (filterGroup !== 'All' && r.grupo !== filterGroup) return false
      if (query) {
        const q = query.toLowerCase()
        if (!((r.ip || '').includes(q) || (r.nombre||'').toLowerCase().includes(q) || (r.grupo||'').toLowerCase().includes(q))) return false
      }
      return true
    })
  }, [rows, filterState, filterGroup, query])

  return (
    <div className="app">
      <header>
        <h1>Admin IPs — Gestión local</h1>
      </header>
      <div className="controls">
        <FileLoader onLoad={onLoad} />
        <div className="filters">
          <label>Estado:
            <select value={filterState} onChange={e => setFilterState(e.target.value)}>
              <option value="all">Todas</option>
              <option value="ocupada">Ocupadas</option>
              <option value="libre">Libres</option>
            </select>
          </label>
          <label>Grupo:
            <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)}>
              {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
          <label>Buscar:
            <input placeholder="IP, nombre o grupo" value={query} onChange={e=>setQuery(e.target.value)} />
          </label>
          <label>Rango CIDR (opcional):
            <input placeholder="e.g. 192.168.1.0/24" value={cidr} onChange={e=>setCidr(e.target.value)} />
          </label>
        </div>
      </div>

      <main>
        <section className="left">
          <IPTable rows={filtered} allRows={rows} />
        </section>
        <section className="right">
          <IPGridMap rows={filtered} cidr={cidr} rowsAll={rows} setCidr={setCidr} />
        </section>
      </main>

      <footer>
        <small>Procesamiento local en el navegador. No se envían datos a servidores.</small>
      </footer>
    </div>
  )
}
