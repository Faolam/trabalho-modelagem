"use client"

import { brownies } from '@/mock/brownies';
import style from './page.module.css';

import { useState } from 'react';

import { Header } from '@/ui/header';
import { Modal } from '@/ui/modal';
import Link from 'next/link';
import Image from 'next/image';

export default function ProdutosAdmin() {
  const [brownie, setBrownie] = useState(null);

  return (
    <>
      <Header />
      <main className='main'>
        <header className='page-header'>
          <h1 className='page-title'>Produtos</h1>
          <Link href="/admin/home" className={style.link}>Voltar</Link>
          <Link href="/admin/cadastro_produto" className={style.link}>Criar Produto</Link>
          <Link href="/admin/criar_tipo" className={style.link}>Criar Tipo</Link>
        </header>
        <div className={style.brownies}>
          {brownies.map(brownie => (
            <button
              type="button"
              key={brownie.id}
              className={style.brownie}
              onClick={() => setBrownie(brownie)}>
              <div className={style.imgContainer}>
                <Image
                  src={`/${brownie.caminhoLogo}`}
                  style={{ width: '100%', height: '100%' }}
                  fill
                  objectFit='cover'
                  alt={brownie.nomeBrownie}
                />
              </div>
              <div className={style.brownieInfo}>
                <strong style={{ display: 'block' }}>{brownie.nomeBrownie}</strong>
                <div>Restam {brownie.quantidade}</div>
                <button className={style.brownieEdit}>Editar</button>
                <button className={style.brownieDelete}>Excluir</button>
              </div>
            </button>
          ))}
        </div>
      </main>
      <Modal
        isOpen={!!brownie}
        onRequestClose={() => setBrownie(null)}
      >
        {!brownie ? <></> : (
          <div className={style.modalContent}>
            <h2 style={{ marginBottom: '1rem' }}>{brownie.nomeBrownie}</h2>
            <div>Tipo: {brownie.tipo}</div>
            <div>Valor: R${brownie.preco}</div>
            <div>Unidades: {brownie.quantidade}</div>
            <div className={style.estoque}>
              <h3 style={{ margin: '1rem 0' }}>Estoque</h3>
            </div>
            <div className={style.loteContainer}>
              <div className={style.inputLabel}>
                <label htmlFor="validade">Data de validade</label>
                <input id="validade" type="date" />
              </div>
              <div className={style.inputLabel}>
                <label htmlFor="quantidade">Quantidade</label>
                <input id="quantidade" type="number" />
              </div>
              <button className={style.lote} type="button">ADICIONAR LOTE</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}