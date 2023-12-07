"use client"

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';

import style from "./page.module.css";
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/auth';
import moment from 'moment-timezone';
import { server } from '@/server';

export default function Faturamento() {
  const [initialDate, setInitialDate] = useState(moment().format("YYYY-MM-DD"));
  const [finalDate, setFinalDate] = useState(moment().format("YYYY-MM-DD"));
  const [vendas, setVendas] = useState([]);
  const [estoques, setEstoques] = useState([]);
  const [lucro, setLucro] = useState(0);
  const [vendasTotal, setVendasTotal] = useState(0);
  const [estoquesTotal, setEstoquesTotal] = useState(0);

  const router = useRouter();
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (!user || user && user.permissionLevel != 1) {
      router.push('/admin/login');
      return;
    }
  }, []);

  useEffect(() => {
    server.get('/admin/getInvoicing', {
      headers: { authorization: token },
      params: {
        dateIn: moment(initialDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
        dateOut: moment(finalDate, "YYYY-MM-DD").format("DD/MM/YYYY")
      }
    })
      .then(response => {
        if (response.data.status !== 200) {
          throw new Error();
        }

        const vendas = response.data.data.out;
        const estoques = response.data.data.in;

        let vendasMoney = 0;
        let estoqueMoney = 0;

        vendas.forEach(venda => vendasMoney += venda.cost);
        estoques.forEach(estoque => estoqueMoney += estoque.price * estoque.stock);

        setVendasTotal(vendasMoney);
        setEstoquesTotal(estoqueMoney);
        setLucro(vendasMoney - estoqueMoney);

        setVendas(response.data.data.out);
        setEstoques(response.data.data.in);
      })
      .catch(e => alert("Não foi possível obter o faturamento"));
  }, [initialDate, finalDate, token]);

  if (!user || user && user.permissionLevel != 1) {
    return <></>;
  }

  return (
    <>
      <main className='main'>
        <header className="page-header">
          <h1 className="page-title">Faturamento</h1>
          <Link href="/admin" className={style.link}>Voltar</Link>
          <div className={style.infoPeriodo}>
            <div className={style.periodo}>
              <span>Início do período</span>
              <input type="date" value={initialDate} onChange={e => setInitialDate(e.target.value)} />
              <span>Fim do período</span>
              <input type="date" value={finalDate} onChange={e => setFinalDate(e.target.value)} />
            </div>
            <strong>Lucro: <span>R${lucro.toFixed(2)}</span></strong>
          </div>
        </header>
        <div className={style.entradasSaidas}>
          <div className={style.entradasContainer}>
            <h2>Entradas (R${estoquesTotal.toFixed(2)})</h2>
            <div className={style.entradas}>
              {estoques.map(estoque => (
                <div className={style.inOut}>
                  <div>Data: {moment(estoque.createdAt).format("DD/MM/YYYY à\\s HH:mm:ss")}</div>
                  <div>Nome: {estoque.brownieName}</div>
                  <div>Preço (unidade): <strong style={{ color: 'var(--highlight-color)' }}>R${estoque.price.toFixed(2)}</strong></div>
                  <div>Quantidade: {estoque.stock}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={style.saidasContainer}>
            <h2>Saídas (R${vendasTotal.toFixed(2)})</h2>
            <div className={style.saidas}>
              {vendas.map(venda => (
                <div className={style.inOut}>
                  <div>Pedido {`#${venda.id}`}</div>
                  <div>Data: {moment(venda.date).format("DD/MM/YYYY à\\s HH:mm:ss")}</div>
                  <div>Valor: <strong style={{ color: 'var(--highlight-color)' }}>R${venda.cost.toFixed(2)}</strong></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
