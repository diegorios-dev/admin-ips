import React, { useMemo } from 'react'
import { ipToInt, intToIp } from '../utils/ip'

function Cell({ ip, estado }) {
  const cls = estado === 'ocupada' ? 'occupied' : estado === 'libre' ? 'free' : 'nodata'
  return <div className={`cell ${cls}`} title={`${ip} - ${estado || 'sin datos'}`}>{ip.split('.').pop()}</div>
}

export default function IPGridMap({ rows, cidr, rowsAll, setCidr }) {
  // determine cidr if not provided: try /24 based on most common prefix
  const detected = useMemo(() => {
    if (cidr) return cidr
    const prefixes = {}
    rowsAll.forEach(r => {
      if (!r.ip) return
      const parts = r.ip.split('.')
      if (parts.length>=3) {
        const p = `${parts[0]}.${parts[1]}.${parts[2]}`
        prefixes[p] = (prefixes[p]||0)+1
      }
    })
    const most = Object.entries(prefixes).sort((a,b)=>b[1]-a[1])[0]
    if (most) return `${most[0]}.0/24`
    return ''
  }, [cidr, rowsAll])

  const useCidr = cidr || detected

  const cells = useMemo(() => {
    if (!useCidr) return []
    // only handle /24 simple
    const m = useCidr.match(/^(\d+\.\d+\.\d+)\.0\/(24)$/)
    if (!m) return []
    const base = m[1]
    const map = {}
    rows.forEach(r => { if (r.ip && r.ip.startsWith(base+'.')) map[r.ip]=r.estado })
    const all = []
    for (let i=0;i<256;i++){ const ip = base + '.' + i; all.push({ip, estado: map[ip]||'nodata'}) }
    return all
  }, [useCidr, rows])

  if (!useCidr) return (
    <div className="ipgrid empty">
      <p>No se detecta un rango. Carga datos o ingresa CIDR manualmente (ej. 192.168.1.0/24).</p>
      <button className="btn btn--warning" onClick={()=>setCidr(detected)}>
        Usar rango detectado
      </button>
    </div>
  )

  return (
    <div className="ipgrid">
      <h3>Mapa {useCidr}</h3>
      <div className="grid">
        {cells.map(c => <Cell key={c.ip} ip={c.ip} estado={c.estado} />)}
      </div>
      <div className="legend">
        <span><b>●</b> Libre</span>
        <span><b>●</b> Ocupada</span>
        <span><b>●</b> Sin datos</span>
      </div>
    </div>
  )
}
