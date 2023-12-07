"use client"

import { Header } from '../../ui/header';
import { useContext, useState } from 'react';
import Link from 'next/link';

import style from "./page.module.css";
import { CartContext } from '@/contexts/cart';

export default function Carrinho() {
  const { items, itemsPrice, addItem, removeItem } = useContext(CartContext);
  const itemNames = Object.keys(items);

  return (
    <>
      <Header />
      <main className='main'>
        <header>
        </header>
        <div className={style.div}>
          <Link href="fechar-pedido" className={style.link}>Fazer Pedido</Link>
          <div className={style.divDentro}>
            <div style={{ flex: 1 }}>
              <p className={style.paragrafo}>Resumo do Carrinho</p>
              <div>
                {!itemNames.length && <h3 style={{ marginTop: '2rem' }}>Não há itens no carrinho</h3>}
                {itemNames.map(name => (
                  <div className={style.produto}>
                    <p className={style.paragrafoProdutos}>{name}: {items[name].quantidade} unidades </p>
                    <span onClick={() => addItem({ ...items[name].data })} class="material-symbols-outlined" style={{ margin: '0 1rem', cursor: 'pointer', userSelect: 'none' }}>
                      add_circle
                    </span>
                    <span onClick={() => removeItem({ ...items[name].data })} style={{ cursor: 'pointer', userSelect: 'none' }} class="material-symbols-outlined">do_not_disturb_on</span>
                  </div>
                ))}
              </div>
            </div>
            <p className={style.lastParagrafo}>{!!itemNames.length && `Total: R$ ${parseFloat(itemsPrice).toFixed(2)}`}</p>
          </div>
        </div>
      </main>

    </>
  )

}
