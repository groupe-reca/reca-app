import { useMemo, useRef, useState } from 'react'
import { Mail, Phone, Plus, Search } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatAddress, formatPhone } from '@/lib/format'
import { useClients } from '../hooks/useClients'
import { ClientFormModal } from './ClientFormModal'
import type { Client } from '../types/client.types'

const CLIENT_TYPE_BADGE: Record<string, { label: string; color: 'blue' | 'orange' }> = {
  residentiel: { label: 'Résidentiel', color: 'blue' },
  commercial: { label: 'Commercial', color: 'orange' },
}

type ClientSearchPickerProps = {
  value: Client | null
  onChange: (client: Client) => void
}

const MAX_RESULTS = 8

function matchesQuery(client: Client, query: string): boolean {
  const haystack = [client.prenom, client.nom, client.entreprise, client.adresse, client.telephone]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(query.toLowerCase())
}

export function ClientSearchPicker({ value, onChange }: ClientSearchPickerProps) {
  const { data: clients } = useClients()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    if (!clients) return []
    const trimmed = query.trim()
    const matches = trimmed ? clients.filter((client) => matchesQuery(client, trimmed)) : clients
    return matches.slice(0, MAX_RESULTS)
  }, [clients, query])

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (containerRef.current?.contains(event.relatedTarget as Node)) return
    setOpen(false)
  }

  function handleSelect(client: Client) {
    onChange(client)
    setOpen(false)
    setQuery('')
  }

  if (value) {
    return (
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-subtitle font-semibold text-reca-black">Client</h2>
            {value.typeClient && CLIENT_TYPE_BADGE[value.typeClient] && (
              <Badge color={CLIENT_TYPE_BADGE[value.typeClient].color} size="sm">
                {CLIENT_TYPE_BADGE[value.typeClient].label}
              </Badge>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-label font-medium text-reca-red hover:underline"
          >
            Changer de client
          </button>
        </div>
        {open ? (
          <div onBlur={handleBlur} ref={containerRef}>
            <SearchInput query={query} setQuery={setQuery} autoFocus />
            <ResultsList
              results={results}
              onSelect={handleSelect}
              onAddNew={() => setCreateModalOpen(true)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 text-body">
            <p className="font-medium text-reca-black">
              {value.prenom} {value.nom}
              {value.entreprise && <span className="text-reca-gray-medium"> — {value.entreprise}</span>}
            </p>
            <p className="text-reca-gray-medium">
              {formatAddress(value.adresse, value.ville, value.codePostal) || 'Adresse non renseignée'}
            </p>
            <div className="flex items-center gap-2 text-reca-gray-medium">
              <Phone className="size-4" aria-hidden="true" />
              {formatPhone(value.telephone) || '—'}
            </div>
            <div className="flex items-center gap-2 text-reca-gray-medium">
              <Mail className="size-4" aria-hidden="true" />
              {value.courriel ?? '—'}
            </div>
          </div>
        )}
        <ClientFormModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreated={(client) => {
            setCreateModalOpen(false)
            handleSelect(client)
          }}
        />
      </Card>
    )
  }

  return (
    <Card>
      <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Client</h2>
      <div ref={containerRef} onBlur={handleBlur} className="relative">
        <SearchInput query={query} setQuery={setQuery} onFocus={() => setOpen(true)} />
        {open && <ResultsList results={results} onSelect={handleSelect} onAddNew={() => setCreateModalOpen(true)} />}
      </div>
      <ClientFormModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={(client) => {
          setCreateModalOpen(false)
          handleSelect(client)
        }}
      />
    </Card>
  )
}

type SearchInputProps = {
  query: string
  setQuery: (value: string) => void
  onFocus?: () => void
  autoFocus?: boolean
}

function SearchInput({ query, setQuery, onFocus, autoFocus }: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-reca-gray-medium"
        aria-hidden="true"
      />
      <input
        type="text"
        autoFocus={autoFocus}
        placeholder="Chercher par nom, adresse ou téléphone…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={onFocus}
        className="h-11 w-full rounded-control border border-reca-gray-light bg-white pl-9 pr-3 text-body text-reca-black placeholder:text-reca-gray-medium/70 focus:outline-none focus:ring-2 focus:ring-reca-red/30"
      />
    </div>
  )
}

type ResultsListProps = {
  results: Client[]
  onSelect: (client: Client) => void
  onAddNew: () => void
}

function ResultsList({ results, onSelect, onAddNew }: ResultsListProps) {
  return (
    <div className="relative z-10 mt-1 flex flex-col gap-1 rounded-control border border-reca-gray-light bg-white p-1 shadow-lg">
      {results.length === 0 && (
        <p className="px-3 py-2 text-label text-reca-gray-medium">Aucun client trouvé.</p>
      )}
      {results.map((client) => (
        <button
          key={client.id}
          type="button"
          onClick={() => onSelect(client)}
          className="flex flex-col rounded-control px-3 py-2 text-left hover:bg-reca-snow"
        >
          <span className="text-body font-medium text-reca-black">
            {client.prenom} {client.nom}
            {client.entreprise && <span className="text-reca-gray-medium"> — {client.entreprise}</span>}
          </span>
          <span className="text-label text-reca-gray-medium">
            {[client.adresse, client.telephone].filter(Boolean).join(' · ') || 'Aucune coordonnée'}
          </span>
        </button>
      ))}
      <button
        type="button"
        onClick={onAddNew}
        className="flex items-center gap-2 rounded-control border-t border-reca-gray-light px-3 py-2 text-left text-body font-medium text-reca-red hover:bg-reca-snow"
      >
        <Plus className="size-4" aria-hidden="true" />
        Ajouter un nouveau client
      </button>
    </div>
  )
}
