"use client"

import { Header } from '../../ui/header';
import { useState } from 'react';
import Link from 'next/link';

import style from "./page.module.css";

export default function Carrinho() {
  const [nomeProduto, setNomeProduto] = useState('CyberBrownie2077');
  const [quantidadeProduto, setQuantidadeProduto] = useState('40');
  const [custoTotal, setCustoTotal] = useState('2077.00');

  function enviar() {
    let texto = "Nome: " + nome
    alert(texto)
  }

  return (
    <>
      <Header />
      <main className='main'>
        <header>
        </header>
        <div className={style.div}>
          <Link href='/fechar-pedido' className={style.link}>Fazer Pedido</Link>
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
