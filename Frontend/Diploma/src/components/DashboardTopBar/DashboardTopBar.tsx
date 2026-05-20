import { useState } from 'react'
import { GoSearch } from 'react-icons/go'
import { MdOutlineVideoCall } from 'react-icons/md'
import { useDashboard } from '../../context/DashboardContext'
import { streamersApi } from '../../api/api'
import { useNavigate } from 'react-router-dom'

import styles from './DashboardTopBar.module.scss'

const DashboardTopBar = () => {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [results, setResults] = useState<{id: number, username: string}[]>([])
    const [searching, setSearching] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const { mode, activeStreamerId, openOrderModal } = useDashboard()

    const canOrder = mode === 'viewer' && activeStreamerId !== null

    const handleSearch = async () => {
        const trimmed = search.trim()
        
        if (!trimmed) {
            return
        }

        setSearching(true)
        setNotFound(false)
        setResults([])

        try {
            const data = await streamersApi.search(trimmed)
            if (data.length === 0) setNotFound(true)
            else setResults(data)
        } catch {
            setNotFound(true)
        } finally {
            setSearching(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const handleSelect = (id: number) => {
        setResults([])
        setSearch('')
        navigate(`/dashboard/streamer/${id}`)
    }

    return (
        <div className={styles.topbar}>
            <div className={styles.topbar_search}>
                <GoSearch size={16} className={styles.topbar_search_icon} />
                <input
                    className={styles.topbar_search_input}
                    type="text"
                    placeholder="Find a streamer by username..."
                    value={ search }
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setResults([])
                        setNotFound(false)
                    }}
                    onKeyDown={ handleKeyDown }
                />
                {search ? (
                    <button
                        className={styles.topbar_search_go}
                        onClick={ handleSearch }
                    >
                        {searching ? '...' : 'Go'}
                    </button>
                ) : null}
            </div>

            {(results.length > 0 || notFound) ? (
                <div className={styles.topbar_dropdown}>
                    {notFound ? (
                        <span className={styles.topbar_dropdown_empty}>
                            No streamer found
                        </span>
                    ) : null}
                    {results.map((user) => (
                        <button
                            key={user.id}
                            className={styles.topbar_dropdown_item}
                            onClick={() => handleSelect(user.id)}
                        >
                            {user.username}
                        </button>
                    ))}
                </div>
            ) : null}
            
            {canOrder ? (
                <button className={styles.topbar_order} onClick={openOrderModal}>
                    <MdOutlineVideoCall size={18} />
                    Order Video
                </button>
            ) : null}
        </div>
    )
}

export default DashboardTopBar