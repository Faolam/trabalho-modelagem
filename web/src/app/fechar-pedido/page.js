"use client"

import style from './page.module.css';
import { Header } from "@/ui/header";

import { Modal } from '@/ui/modal';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/auth';
import { CartContext } from '@/contexts/cart';
import { useRouter } from 'next/navigation';
import { server } from '@/server';

export default function FecharPedido() {
  const router = useRouter()
  const { user, token, setUser } = useContext(AuthContext);
  const { items, itemNumber, itemsPrice, freightPrice, clearCart } = useContext(CartContext);
  const [isChangingPayment, setIsChangingPayment] = useState(false);
  const [rua, setRua] = useState(user?.addressStreet || '');
  const [numero, setNumero] = useState(user?.addressNumber || '');
  const [estado, setEstado] = useState(user?.addressState || '');
  const [cidade, setCidade] = useState(user?.addressCity || '');
  const [pais, setPais] = useState(user?.addressCountry || '');
  const [nome, setNome] = useState(user?.cards?.at(0)?.name || '');
  const [numeroCartao, setNumeroCartao] = useState(user?.cards?.at(0)?.number || '');
  const [codigoSeguranca, setCodigoSeguranca] = useState(user?.cards?.at(0)?.cvv || '');
  const [dataValidade, setDataValidade] = useState(user?.cards?.at(0)?.validityYear || '');
  const [parcelas, setParcelas] = useState(1);
  const [bandeira, setBandeira] = useState(user?.cards?.at(0)?.flag);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!itemNumber) {
      alert("Adicione itens no carrinho primeiro, por favor né?!");
      router.push('/');
      return;
    }
  }, []);

  const validateCreditCard = (numeroCartao) => {
    // Espaços e Caracteres Invalidos
    const numeroCartaoLimpo = numeroCartao.replace(/\s/g, '');
    if (!/^\d+$/.test(numeroCartaoLimpo)) {
      return 'Número de cartão inválido';
    }

    // Comprimento
    if (!(12 <= numeroCartaoLimpo.length && numeroCartaoLimpo.length <= 19)) {
      return 'Comprimento do número do cartão inválido';
    }

    // Algoritmo de Luhn
    let soma = 0;
    const reverseDigits = numeroCartaoLimpo.split('').reverse().map(Number);
    for (let i = 0; i < reverseDigits.length; i++) {
      if (i % 2 === 1) {
        const doubleDigit = reverseDigits[i] * 2;
        soma += doubleDigit < 10 ? doubleDigit : doubleDigit - 9;
      } else {
        soma += reverseDigits[i];
      }
    }

    if (soma % 10 !== 0) {
      return 'Número do cartão inválido (Algoritmo de Luhn)';
    }

    // Bandeira
    if (numeroCartaoLimpo.startsWith('4')) {
      return 'Visa';
    } else if (numeroCartaoLimpo.startsWith('51') || numeroCartaoLimpo.startsWith('52') ||
      numeroCartaoLimpo.startsWith('53') || numeroCartaoLimpo.startsWith('54') ||
      numeroCartaoLimpo.startsWith('55')) {
      return 'MasterCard';
    } else if (numeroCartaoLimpo.startsWith('34') || numeroCartaoLimpo.startsWith('37')) {
      return 'American Express';
    } else if (numeroCartaoLimpo.startsWith('6011')) {
      return 'Discover';
    } else {
      return 'Bandeira desconhecida';
    }
  }

  function handleClosePaymentModal(e) {
    e.preventDefault();
    setBandeira(validateCreditCard(numeroCartao));
    setIsChangingPayment(false);
  }

  function handlePurchase() {

    server.post("/user/newPurchase", {
      "cardName": nome,
      "cardValidity": "01/" + dataValidade,
      "cardNumber": numeroCartao,
      "cardCVV": codigoSeguranca,
      "country": pais,
      "street": rua,
      "number": numero,
      "state": estado,
      "city": cidade,
      "cost": itemsPrice + freightPrice,
      "products": Object.keys(items).map(name => {
        return {
          id: items[name].data.id,
          amount: items[name].quantidade
        }
      })
    }, { headers: { authorization: token } })
      .then(res => {
        if (res.data.status !== 200) throw new Error();
        server.get('/user/info', { headers: { authorization: token } })
          .then(resp => {
            if (resp.data.status !== 200) throw new Error();
            alert("Pedido realizado! Obrigado pela compra!");
            setUser(resp.data.data);
            clearCart();
            router.push('/pedidos');
          })
          .catch(e => alert("Não foi possível realizar a compra. Confira os dados ou tente novamente mais tarde."))
      })
      .catch(e => alert("Não foi possível realizar a compra. Confira os dados ou tente novamente mais tarde."));
  }

  if (!user || !itemNumber) {
    return <></>;
  }

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
              <input type="text" placeholder="Endereço" value={rua} onChange={(e) => setRua(e.target.value)} />
              <input type="text" placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} />
              <input type="text" placeholder="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} />
              <input type="text" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
              <input type="text" placeholder="País" value={pais} onChange={(e) => setPais(e.target.value)} />
            </div>
            <div className={style.data}>
              <h2>Método de Pagamento</h2>
              <button type="button" className={style.payment} onClick={() => setIsChangingPayment(true)}>
                <strong>{bandeira}</strong> (Crédito) (termina em <strong>{numeroCartao.toString().slice(-4)}</strong>)
              </button>
            </div>
            <div className={style.data}>
              <h2>Itens</h2>
              {Object.keys(items).map(name => (
                <div><strong>{items[name].quantidade}x</strong> {name} <strong>R${items[name].data.price}</strong></div>
              ))}
            </div>
          </div>
          <div>
            <div className={style.resumo}>
              <h2>Resumo do pedido</h2>
              <div>Valor dos itens: R${parseFloat(itemsPrice).toFixed(2)}</div>
              <div>Frete: R${parseFloat(freightPrice).toFixed(2)}</div>
              <div>Parcelas: {parcelas}</div>
              <div>Total: R${parseFloat(itemsPrice + freightPrice).toFixed(2)}</div>
              <div>Valor da parcela: R${(parseFloat(itemsPrice + freightPrice) / parcelas).toFixed(2)}</div>
              <button className={style.finish} type="button" onClick={handlePurchase}>FINALIZAR COMPRA</button>
            </div>
          </div>
        </div>
      </main>
      <Modal
        isOpen={isChangingPayment}
        onRequestClose={handleClosePaymentModal}
      >
        <header>
          <h1 className={style.titulo}>Cadastro de Cartão</h1>
        </header>
        <form className={style.form}>
          <input placeholder='Parcelas' type="text" value={parcelas} onChange={e => setParcelas(e.target.value)} />
          <input placeholder="Número do Cartão" type='text' id='campo_numero_cartao' value={numeroCartao} onChange={(e) => setNumeroCartao(e.target.value)} />
          <input placeholder="Nome do Titular" type='text' id='campo_nome' value={nome} onChange={(e) => setNome(e.target.value)} />
          <input placeholder="Código de Segurança" type='text' id='campo_codigo_seguranca' value={codigoSeguranca} onChange={(e) => setCodigoSeguranca(e.target.value)} />
          <input placeholder="Data de Validade" type='text' id='campo_data_validade' value={dataValidade} onChange={(e) => setDataValidade(e.target.value)} />
          <input value="FECHAR" type='submit' onClick={handleClosePaymentModal} />
        </form>
      </Modal>
    </>
  );
}