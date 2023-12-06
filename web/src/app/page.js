"use client"

import { Header } from '../ui/header';
import { BrownieList } from '../ui/brownielist';

import { useEffect, useState } from 'react';
import { server } from '@/server';

export default function Home() {
  const [brownies, setBrownies] = useState([]);

  useEffect(() => {
    server.get('/web/listProducts')
      .then(response => {
        if (response.status !== 200) {
          throw new Error();
        }

        setBrownies(response.data.data);
      })
      .catch(err => alert("Não foi possível carregar produtos"))
  });

  return (
    <>
      <Header />
      <main className='main'>
        <header className='page-header'>
          <h1 className='page-title'>Produtos</h1>
        </header>
        {brownies.map(tipo => (
          <BrownieList key={tipo[0].brownieCategory} type={tipo[0].brownieCategory} products={tipo} />
        ))}
      </main>
    </>
  )
}
