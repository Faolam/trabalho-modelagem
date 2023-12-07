"use client"

import style from './page.module.css';

import { useContext, useEffect, useState } from 'react';

import { Header } from '@/ui/header';
import { Modal } from '@/ui/modal';
import { server } from '@/server';
import { AuthContext } from '@/contexts/auth';
import moment from "moment-timezone";
import { useRouter } from 'next/navigation';

export default function Pedidos() {
  const router = useRouter();
  const { token, user } = useContext(AuthContext);
  const [pedido, setPedido] = useState(null);
  const [pedidos, setPedidos] = useState([]);

  function getStatusPedido(pedido) {
    return !pedido.purchase.send ? '(Esperando envio)' : !pedido.purchase.delivered ? '(Pedido enviado)' : '(Pedido entregue)';
  }

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    server.get('/user/getPurchases', {
      headers: {
        authorization: token
      }
    })
      .then(response => {
        if (response.data.status !== 200) {
          throw new Error();
        }

        console.log(response.data.data);
        setPedidos(response.data.data.purchases);
      })
      .catch(e => alert("Não foi possível listar os pedidos"));
  }, []);

  if (!token) {
    return <></>;
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
              key={pedido.purchase.id}
              className={style.pedido}
              onClick={() => setPedido(pedido)}>
              <div>{`#${pedido.purchase.id}`} {getStatusPedido(pedido)}</div>
              <div className={style.pedido_info}>
                <div>Realizado em: {moment(pedido.purchase.date).format("DD/MM/YYYY")}</div>
                <div>Valor: R${parseFloat(pedido.purchase.cost).toFixed(2)}</div>
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
            <h2 style={{ marginBottom: '1rem' }}>{`#${pedido.purchase.id}`} {getStatusPedido(pedido)}</h2>
            <div>Realizado em: {moment(pedido.purchase.date).format("DD/MM/YYYY HH:mm:ss")}</div>
            <div>Valor: R${parseFloat(pedido.purchase.cost).toFixed(2)}</div>
            <div>Cliente: {pedido.purchase.ownerName}</div>
            <div>Email do cliente: {user.email}</div>
            <div>Rua: {user.addressStreet}</div>
            <div>Número: {user.addressNumber}</div>
            <div>Cidade: {user.addressCity}</div>
            <div>Estado: {user.addressState}</div>
            <div>País: {user.addressCountry}</div>
            <h3 style={{ margin: '1rem 0' }}>Itens</h3>
            {pedido.brownieTypes.map(item => (
              <div><strong>{item.amount}x</strong> {item.brownie.brownieName} <strong>R${item.brownie.price}</strong></div>
            ))}
          </div>
        )}
      </Modal>
    </>
  )
}