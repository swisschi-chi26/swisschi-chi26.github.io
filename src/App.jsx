import { useState, useEffect, useMemo } from 'react'
import Header from './components/Header'
import Filters from './components/Filters'
import PaperList from './components/PaperList'
import Loading from './components/Loading'
import Error from './components/Error'
import { parseCSV, countBy } from './utils/dataUtils'
import './App.css'

// ============================================================
// CONFIGURATION: Replace with your published Google Sheet URL
// ============================================================
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnb_tSBK7JTyvJ6Z_uINUjdPuPW2JCi_IxOJm3_BkMdxbwUM0Ql_YpG7UK0hkVwD0UkGSAbo5phKrk/pub?gid=469446089&single=true&output=csv'
// Example: 'https://docs.google.com/spreadsheets/d/1ABC.../pub?output=csv'

// Parse URL hash for filter parameters
// Supports: #filter:value or #search=x&institute=y&type=z&award=w
function parseHashFilters() {
  const hash = window.location.hash.slice(1) // Remove #
  if (!hash) return {}
  
  // Support simple format: filter:value
  if (hash.startsWith('filter:')) {
    return { search: decodeURIComponent(hash.slice(7)) }
  }
  
  // Support query-string format: search=x&institute=y
  const params = new URLSearchParams(hash)
  return {
    search: params.get('search') || '',
    type: params.get('type') || '',
    institute: params.get('institute') || '',
    award: params.get('award') || ''
  }
}

// Build URL hash from filter state
function buildHashFromFilters(search, type, institute, award) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (type) params.set('type', type)
  if (institute) params.set('institute', institute)
  if (award) params.set('award', award)
  return params.toString()
}

function App() {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Initialize filters from URL hash
  const initialFilters = parseHashFilters()
  const [search, setSearch] = useState(initialFilters.search || '')
  const [typeFilter, setTypeFilter] = useState(initialFilters.type || '')
  const [instituteFilter, setInstituteFilter] = useState(initialFilters.institute || '')
  const [awardFilter, setAwardFilter] = useState(initialFilters.award || '')

  useEffect(() => {
    async function loadData() {
      try {
        if (SHEET_CSV_URL === 'YOUR_GOOGLE_SHEET_CSV_URL_HERE') {
          throw new Error('Please configure SHEET_CSV_URL in src/App.jsx')
        }

        const response = await fetch(SHEET_CSV_URL)
        if (!response.ok) throw new Error('Failed to fetch data')

        const text = await response.text()
        const data = parseCSV(text)

        if (data.length === 0) {
          throw new Error('No data found in spreadsheet')
        }

        setPapers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Sync filter state to URL hash
  useEffect(() => {
    const hash = buildHashFromFilters(search, typeFilter, instituteFilter, awardFilter)
    const newHash = hash ? `#${hash}` : ''
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash || window.location.pathname)
    }
  }, [search, typeFilter, instituteFilter, awardFilter])

  // Handle browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const filters = parseHashFilters()
      setSearch(filters.search || '')
      setTypeFilter(filters.type || '')
      setInstituteFilter(filters.institute || '')
      setAwardFilter(filters.award || '')
    }
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const types = useMemo(() => countBy(papers, p => p['Type']), [papers])
  const institutes = useMemo(() => 
    countBy(papers, p => (p['Swiss Institutes'] || '').split('; ').filter(Boolean)), 
    [papers]
  )

  const filteredPapers = useMemo(() => {
    return papers.filter(p => {
      const matchesSearch = !search ||
        (p.Title || '').toLowerCase().includes(search.toLowerCase()) ||
        (p['All Authors'] || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.Abstract || '').toLowerCase().includes(search.toLowerCase())

      const matchesType = !typeFilter || p.Type === typeFilter
      const matchesInstitute = !instituteFilter ||
        (p['Swiss Institutes'] || '').includes(instituteFilter)
      const matchesAward = !awardFilter ||
        (p['Awards'] || '').toLowerCase().includes(awardFilter.toLowerCase())

      return matchesSearch && matchesType && matchesInstitute && matchesAward
    })
  }, [papers, search, typeFilter, instituteFilter, awardFilter])

  if (loading) return <Loading />
  if (error) return <Error message={error} />

  return (
    <div className="app">
      <Header />
      <div className="container">        
        <section className="section">
          <h2>All Contributions</h2>
          <Filters
            search={search}
            setSearch={setSearch}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            instituteFilter={instituteFilter}
            setInstituteFilter={setInstituteFilter}
            awardFilter={awardFilter}
            setAwardFilter={setAwardFilter}
          />
          <div className="papers-count">
            Showing {filteredPapers.length} contributions
          </div>
          <PaperList 
            papers={filteredPapers} 
            onAuthorClick={(author) => setSearch(author)}
            onInstituteClick={(institute) => setInstituteFilter(institute)}
            onTypeClick={(type) => setTypeFilter(type)}
            onAwardClick={(award) => setAwardFilter(award)}
          />
        </section>
      </div>
      
      <footer className="footer">
        Data from CHI 2026 Program &bull; Vibe-Coded by Claude and <a href='https://peachlab.inf.ethz.ch/' target="_blank" rel="noopener noreferrer">April Wang</a> with ❤️
      </footer>
    </div>
  )
}

export default App
