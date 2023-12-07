"use client"

import style from './page.module.css';

import { useContext, useEffect, useState } from 'react';

import { Modal } from '@/ui/modal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/auth';
import { server } from '@/server';
import moment from 'moment-timezone';

export default function PedidosAdmin() {
  const [pedido, setPedido] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const router = useRouter();
  const { user, token } = useContext(AuthContext);

  function getPedidos() {
    server.get('/admin/getAllPurchases', {
      headers: {
        authorization: token
      }
    })
      .then(response => {
        if (response.data.status !== 200) {
          throw new Error();
        }

        setPedidos(response.data.data);
      })
      .catch(e => alert("Não foi possível listar os pedidos"));
  }

  useEffect(() => {
    if (!user || user && user.permissionLevel != 1) {
      router.push('/admin/login');
      return;
    }

    getPedidos();
  }, []);

  function handleUpdatePedido(e, pedido) {
    e.stopPropagation();
    server.post('/admin/updatePedido', {
      productId: pedido.purchase.id,
      typeValue: pedido.purchase.sent + 1
    }, { headers: { authorization: token } })
      .then(res => {
        if (res.data.status != 200) throw new Error();
        getPedidos();
        alert("O pedido foi atualizado!");
      })
      .catch(e => alert("Não foi possível atualizar o pedido"));
  }

  if (!user || user && user.permissionLevel != 1) {
    return <></>;
  }

  function getStatusPedido(pedido) {
    return !pedido.purchase.sent ? '(Esperando envio)' : !pedido.purchase.delivered ? '(Pedido enviado)' : '(Pedido entregue)';
  }

  return (
    <>
      <main className='main'>
        <header className='page-header'>
          <h1 className='page-title'>Pedidos</h1>
          <Link href="/admin" className={style.goBack}>Voltar</Link>
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
              {!pedido.purchase.delivered && <button className={style.statusPedido} type="button" onClick={e => handleUpdatePedido(e, pedido)}>Tornar {pedido.purchase.sent ? 'Entregue' : 'Enviado'}</button>}
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
            <div>Email do cliente: {pedido.purchase.email}</div>
            <div>Rua: {pedido.purchase.addressStreet}</div>
            <div>Número: {pedido.purchase.addressNumber}</div>
            <div>Cidade: {pedido.purchase.addressCity}</div>
            <div>Estado: {pedido.purchase.addressState}</div>
            <div>País: {pedido.purchase.addressCountry}</div>
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