"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation'

import style from './searchbar.module.css';

export function SearchBar({ prev_query }) {
  const router = useRouter();
  const [query, set_query] = useState(prev_query);

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      const trimmed = query.trim();
      if (trimmed) {
        router.push('/pesquisa/' + trimmed);
      }
    }
  }

  return (
    <div className={style.shape}>
      <input
        type="text"
        placeholder="Pesquisar"
        value={query}
        onChange={e => set_query(e.target.value)}
        onKeyDown={handleKeyPress} />
    </div>
  );
}