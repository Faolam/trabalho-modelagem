"use client"

import { pedidos } from '@/mock/pedidos';
import style from './page.module.css';

import { useState } from 'react';

import { Header } from '@/ui/header';
import { Modal } from '@/ui/modal';

export default function Pedidos() {
  const [pedido, setPedido] = useState(null);

  function getStatusPedido(pedido) {
    return !pedido.enviado ? '(Esperando envio)' : !pedido.entregue ? '(Pedido enviado)' : '(Pedido entregue)';
  }

  return (
    <>
      <Header />
      <main className='main'>
        <header className='page-header'>
          <h1 className='page-title'>Pedidos</h1>
        </header>
        <div className={style.pedidos}>
          {pedidos.map(pedido => (
            <button
              type="button"
              key={pedido.id}
              className={style.pedido}
              onClick={() => setPedido(pedido)}>
              <div>{`#${pedido.id}`} {getStatusPedido(pedido)}</div>
              <div className={style.pedido_info}>
                <div>Realizado em: {pedido.dataRealizacao}</div>
                <div>Valor: R${pedido.valorPedido}</div>
              </div>
            </button>
          ))}
        </div>
      </main>
      <Modal
        isOpen={!!pedido}
        onRequestClose={() => setPedido(null)}
      >
        {!pedido ? <></> : (
          <div className={style.modalContent}>
            <h2 style={{ marginBottom: '1rem' }}>{`#${pedido.id}`} {getStatusPedido(pedido)}</h2>
            <div>Realizado em: {pedido.dataRealizacao}</div>
            <div>Valor: R${pedido.valorPedido}</div>
            <div>Cliente: {pedido.nomeCliente}</div>
            <div>Email do cliente: {pedido.emailCliente}</div>
            <div>Rua: {pedido.enderecoEntrega}</div>
            <div>Número: {pedido.enderecoEntrega}</div>
            <div>Cidade: {pedido.enderecoEntrega}</div>
            <div>Estado: {pedido.enderecoEntrega}</div>
            <div>País: {pedido.enderecoEntrega}</div>
            <h3 style={{ margin: '1rem 0' }}>Itens</h3>
            {pedido.itensPedido.map(item => (
              <div><strong>{item.quantidade}x</strong> {item.nomeBrownie} <strong>R${item.preco}</strong></div>
            ))}
          </div>
        )}
      </Modal>
    </>
  )
}