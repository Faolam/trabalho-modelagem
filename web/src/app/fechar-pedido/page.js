"use client"

import style from './page.module.css';
import { Header } from "@/ui/header";

import { pedidos } from '@/mock/pedidos';
import { Modal } from '@/ui/modal';
import { useState } from 'react';

const pedido = pedidos[0];

export default function FecharPedido() {
  const [isChangingPayment, setIsChangingPayment] = useState(false);

  return (
    <>
      <Header />
      <main className="main">
        <div className="page-header">
          <h1 className="page-title">Fechar Pedido</h1>
        </div>
        <div className={style.container}>
          <div>
            <div className={style.data}>
              <h2>Endereço de entrega</h2>
              <input type="text" placeholder="CEP" />
              <input type="text" placeholder="Rua" />
              <input type="text" placeholder="Número" />
              <input type="text" placeholder="Estado" />
              <input type="text" placeholder="Cidade" />
              <input type="text" placeholder="País" />
            </div>
            <div className={style.data}>
              <h2>Método de Pagamento</h2>
              <button type="button" className={style.payment} onClick={() => setIsChangingPayment(true)}>
                MasterCard (Crédito) (termina em 5033)
              </button>
            </div>
            <div className={style.data}>
              <h2>Itens</h2>
              {pedido.itensPedido.map(item => (
                <div><strong>{item.quantidade}x</strong> {item.nomeBrownie} <strong>R${item.preco}</strong></div>
              ))}
            </div>
          </div>
          <div>
            <div className={style.resumo}>
              <h2>Resumo do pedido</h2>
              <div>Valor dos itens: R$5.490,99</div>
              <div>Frete: R$499,99</div>
              <div>Parcelas: 2</div>
              <div>Valor da parcela: R$8.485,88</div>
              <div>Total: R$50.000,99</div>
              <button className={style.finish} type="button">FINALIZAR COMPRA</button>
            </div>
          </div>
        </div>
      </main>
      <Modal
        isOpen={isChangingPayment}
        onRequestClose={() => setIsChangingPayment(p => !p)}
      >
        <header>
          <h1 className={style.titulo}>Cadastro de Cartão</h1>
        </header>
        <form className={style.form}>
          <input placeholder="Número do Cartão" type='text' id='campo_numero_cartao' onChange={(e) => setNumeroCartao(e.target.value)} />
          <input placeholder="Nome do Titular" type='text' id='campo_nome' onChange={(e) => setNome(e.target.value)} />
          <input placeholder="Código de Segurança" type='text' id='campo_codigo_seguranca' onChange={(e) => setCodigoSeguranca(e.target.value)} />
          <input placeholder="Data de Validade" type='date' id='campo_data_validade' onChange={(e) => setDataValidade(e.target.value)} />
          <input value="CADASTRAR" type='submit' onClick={(e) => enviar()} />
        </form>
      </Modal>
    </>
  );
}