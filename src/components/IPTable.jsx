import React from 'react'
import { ipToInt, compareIPs } from '../utils/ip'
import * as XLSX from 'xlsx'

function ExportButton({ rows }) {
  const doExport = () => {
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'IPs')
    XLSX.writeFile(wb, 'ips_export.xlsx')
  }
  return <button onClick={doExport}>Exportar visible</button>
}

export default function IPTable({ rows, allRows }) {
  const sorted = [...rows].sort((a,b)=> compareIPs(a.ip,b.ip))

  return (
    <div className="iptable">
      <div className="table-header">
        <h2>Tabla de IPs ({rows.length})</h2>
        <ExportButton rows={rows} />
      </div>
      <table>
        <thead>
          <tr>
            <th>IP</th>
            <th>Nombre</th>
            <th>Grupo</th>
            <th>Estado</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, i) => (
            <tr key={i}>
              <td>{r.ip}</td>
              <td>{r.nombre}</td>
              <td>{r.grupo}</td>
              <td><span className={`dot ${r.estado||'unknown'}`}></span> {r.estado}</td>
              <td>{r.observaciones}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
