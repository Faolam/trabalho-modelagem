"use client"

import { Header } from '../../ui/header';
import { useContext, useState } from 'react';
import Link from 'next/link';

import style from "./page.module.css";
import { AuthContext } from '@/contexts/auth';
import { useRouter } from 'next/navigation';

export default function Carrinho() {
  const router = useRouter();
  const [nomeProduto, setNomeProduto] = useState('CyberBrownie2077');
  const [quantidadeProduto, setQuantidadeProduto] = useState('40');
  const [custoTotal, setCustoTotal] = useState('2077.00');

  const { user } = useContext(AuthContext);

  function handleProceed() {
    if (user) {
      router.push('/fechar-pedido');
    }
    else {
      router.push('/login')
    }
  }

  return (
    <>
      <Header />
      <main className='main'>
        <header>
        </header>
        <div className={style.div}>
          <button type="button" onClick={handleProceed} className={style.link}>Fazer Pedido</button>
          <div className={style.divDentro}>
            <div style={{ flex: 1 }}>
              <p className={style.paragrafo}>Resumo do Pedido</p>
              <div>
                <p className={style.paragrafoProdutos}>{nomeProduto}: {quantidadeProduto} unidades </p>
              </div>
            </div>
            <p className={style.lastParagrafo}>Custo Total: R$ {custoTotal}</p>
          </div>
        </div>
      </main>

    </>
  )

}
