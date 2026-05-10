import { useState } from 'react'
import { GoSearch } from 'react-icons/go'
import { MdOutlineVideoCall } from 'react-icons/md'

import styles from './DashboardTopBar.module.scss'

const DashboardTopBar = () => {
    const [search, setSearch] = useState('')

    const handleSearch = () => {
        const trimmed = search.trim()
        
        if (!trimmed) {
            return
        }

        // TODO: замінити на API — пошук стрімера за username
        console.log('Search streamer:', trimmed)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
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
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={ handleKeyDown }
                />
                {search ? (
                    <button
                        className={styles.topbar_search_go}
                        onClick={ handleSearch }
                    >
                        Go
                    </button>
                ) : null}
            </div>

            <button className={styles.topbar_order}>
                <MdOutlineVideoCall size={18} />
                Order Video
            </button>
        </div>
    )
}

export default DashboardTopBar