export function ipToInt(ip){
  if (!ip) return 0
  const parts = ip.split('.').map(p=>parseInt(p)||0)
  return ((parts[0]<<24) >>>0) + (parts[1]<<16) + (parts[2]<<8) + parts[3]
}

export function intToIp(num){
  return [(num>>>24)&255, (num>>>16)&255, (num>>>8)&255, num&255].join('.')
}

export function compareIPs(a,b){
  if (!a) return 1
  if (!b) return -1
  const ai = ipToInt(a)
  const bi = ipToInt(b)
  return ai - bi
}

export function normalizeRows(raw){
  return raw.map(r=>({
    ip: (r.ip||'').toString().trim(),
    nombre: (r.nombre||'').toString().trim(),
    grupo: (r.grupo||'').toString().trim(),
    estado: (r.estado||'').toString().trim(),
    observaciones: (r.observaciones||'').toString().trim()
  })).filter(r=>r.ip)
}

export function inferState(r){
  // inferir siempre por nombre de máquina: si hay nombre => ocupada
  if (r.nombre && r.nombre.trim()) return 'ocupada'
  return 'libre'
}
