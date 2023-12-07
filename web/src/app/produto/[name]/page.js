"use client"

import style from './page.module.css';

import { Header } from '@/ui/header';
import { Review } from '@/ui/review';
import Image from 'next/image';
import { avaliacoes } from '@/mock/avaliacoes';
import { useContext, useEffect, useState } from 'react';
import { server } from '@/server';
import { AuthContext } from '@/contexts/auth';
import { CartContext } from '@/contexts/cart';
import { useRouter } from 'next/navigation';


export default function Produto({ params }) {
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);
  const router = useRouter();
  const [searching, setSearching] = useState(true);
  const [brownie, setBrownie] = useState(null);
  const [userRating, setUserRating] = useState(5);
  const [userRatingDescription, setUserRatingDescription] = useState('');

  useEffect(() => {
    const name = decodeURIComponent(params.name);
    server.get('/web/findProduct', {
      params: { name }
    })
      .then(response => {
        if (response.data.status !== 200) {
          throw new Error();
        }
        setBrownie(response.data.data[0]);
      })
      .finally(() => setSearching(false));
  }, []);

  function handleRate() {

  }

  if (searching) {
    return <Header />;
  }

  if (!brownie) {
    return (
      <>
        <Header />
        <main className='main'>
          <header className='page-header'>
            <h1 style={{ textAlign: 'center' }}>Brownie não encontrado</h1>
          </header>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className='main'>
        <header className='page-header'>
          <div className={style.header_content}>
            <div style={{ position: 'relative' }}>
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGES_PATH}/${brownie.logoPath}.jpg`}
                style={{ width: '100%', height: '100%', borderRadius: '1.6rem' }}
                fill
                objectFit='cover'
                alt={brownie.brownieName}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h1 style={{ fontSize: 48, lineHeight: '48px' }}>{brownie.brownieName}</h1>
              <span className={style.preco}>R$ {brownie.price}</span>
              <button
                type="button"
                onClick={() => {
                  addItem(brownie);
                  router.push('/carrinho');
                }}
                className={style.carrinho}>
                ADICIONAR AO CARRINHO
              </button>
            </div>
          </div>
        </header>
        <div className={style.reviews_container}>
          <header><span>Avaliações {brownie.amountRating}</span></header>
          <div className={style.reviews}>
            {user ? (
              <div className={style.userReview}>
                <h2>Faça a sua avaliação</h2>
                <div>
                  <label htmlFor='user-rating'>Qual a sua nota para este produto?</label>
                  <div className={style.rating}>
                    <input id="user-rating" type="range" min="0" max="5" value={userRating} onChange={e => setUserRating(e.target.value)} />
                    <span>{userRating}/5</span>
                  </div>
                </div>
                <textarea placeholder="Insira aqui os motivos para você ter dado essa nota" value={userRatingDescription} onChange={e => setUserRatingDescription(e.target.value)} />
                <button type="button" onClick={handleRate} className={style.avaliar}>AVALIAR</button>
              </div>
            ) : <></>}
            {brownie.ratings.map(({ userImage, userName, starts, comment }) => <Review foto={`${process.env.NEXT_PUBLIC_IMAGES_PATH}/${userImage}.jpg`} nome={userName} nota={starts} descricao={comment} />)}
          </div>
        </div>
      </main>
    </>
  )
}
