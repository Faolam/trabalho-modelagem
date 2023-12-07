"use client"

import { useEffect, useState } from 'react';
import { Header } from '../../../ui/header';
import { server } from '@/server';
import { BrownieList } from '@/ui/brownielist';

export default function Pesquisa({ params }) {
  const query = decodeURIComponent(params.query);
  const [brownies, setBrownies] = useState([]);
  const [searching, setSearching] = useState(true);

  useEffect(() => {
    server.get('/web/findProduct', {
      params: {
        name: query
      }
    })
      .then(res => {
        if (res.data.status !== 200) {
          return;
        }
        setBrownies(res.data.data);
      })
      .finally(() => setSearching(false));
  }, []);

  return (
    <>
      <Header prev_query={query} />
      <main className='main'>
        <header className='page-header'>
          <h1 className='page-title'>{searching ? 'Pesquisando...' : brownies.length ? 'Resultados' : 'Nenhum brownie encontrado'}</h1>
        </header>
        <BrownieList type='' products={brownies} />
      </main>
    </>
  )
}