// Parse CSV text into array of objects
export function parseCSV(text) {
  const lines = text.split('\n')
  const headers = parseCSVLine(lines[0]).map(h => h.trim())
  const data = []

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i])
      const row = {}
      headers.forEach((h, idx) => {
        row[h] = (values[idx] || '').trim()
      })
      data.push(row)
    }
  }
  return data
}

// Parse a single CSV line handling quoted fields
function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

// Count occurrences and return sorted array of [key, count]
export function countBy(arr, fn) {
  const counts = {}
  arr.forEach(item => {
    const key = fn(item)
    if (Array.isArray(key)) {
      key.forEach(k => {
        if (k.trim()) counts[k.trim()] = (counts[k.trim()] || 0) + 1
      })
    } else if (key) {
      counts[key] = (counts[key] || 0) + 1
    }
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
}

// Get Swiss author names as an array
export function getSwissAuthorNames(swissAuthors) {
  if (!swissAuthors) return []

  return swissAuthors.split('; ').map(a => {
    const match = a.match(/^([^(]+)/)
    return match ? match[1].trim() : ''
  }).filter(n => n)
}
