import React from 'react'
import * as XLSX from 'xlsx'

export default function FileLoader({ onLoad }) {
  const handleFile = async (e) => {
    const f = e.target.files[0]
    if (!f) return
    const buffer = await f.arrayBuffer()
    const wb = XLSX.read(buffer, { type: 'array' })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })
    // normalize keys to Spanish expected fields
    const rows = json.map(r => {
      const keys = Object.keys(r)
      const out = {}
      keys.forEach(k => {
        const lower = k.toString().toLowerCase()
        if (lower.includes('ip')) out.ip = String(r[k]).trim()
        else if (lower.includes('nombre') || lower.includes('host') || lower.includes('machine')) out.nombre = String(r[k]).trim()
        else if (lower.includes('grupo') || lower.includes('workgroup') || lower.includes('domain')) out.grupo = String(r[k]).trim()
        else if (lower.includes('estado') || lower.includes('state')) out.estado = String(r[k]).trim()
        else if (lower.includes('observ')) out.observaciones = String(r[k]).trim()
      })
      return out
    })
    onLoad(rows)
  }

  return (
    <div className="fileloader">
      <label className="btn btn--primary">
        Subir .xlsx / .csv
        <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} />
      </label>
      <a className="btn btn--success" href="/sample.csv" download>
        Descargar sample.csv
      </a>
    </div>
  )
}
