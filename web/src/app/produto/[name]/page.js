import { Header } from '@/ui/header';
import { Review } from '@/ui/review';
import Image from 'next/image';
import { brownies } from '@/mock/brownies';
import { avaliacoes } from '@/mock/avaliacoes';

import style from './page.module.css';

export default function Produto({ params }) {
  const nomeBrownie = decodeURIComponent(params.name);
  const brownie = brownies.find(b => b.nomeBrownie === nomeBrownie);

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
                src={`/${brownie.caminhoLogo}`}
                style={{ width: '100%', height: '100%', borderRadius: '1.6rem' }}
                fill
                objectFit='cover'
                alt={nomeBrownie}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h1 style={{ fontSize: 48, lineHeight: '48px' }}>{nomeBrownie}</h1>
              <span className={style.preco}>R$ {brownie.preco}</span>
              <button type="button" className={style.carrinho}>ADICIONAR AO CARRINHO</button>
            </div>
          </div>
          <div className={style.reviews_container}>
            <header><span>Avaliações {'(58)'}</span></header>
            <div className={style.reviews}>
              {avaliacoes.map(({ foto, nome, nota, descricao }) => <Review foto={foto} nome={nome} nota={nota} descricao={descricao} />)}
            </div>
          </div>
        </header>
      </main>
    </>
  )
}
