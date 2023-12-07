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
            <strong>Total: <span>R$1400,00</span></strong>
          </div>
        </header>
        <div className={style.entradasSaidas}>
          <div className={style.entradasContainer}>
            <h2>Entradas</h2>
            <div className={style.entradas}>
              {estoques.map(estoque => (
                <div>
                  Data: {moment(estoque.createdAt).format("DD/MM/YYYY")}
                  Nome: {estoque.brownieName}
                  Preço (unidade): R${estoque.price.toFixed(2)}
                  Quantidade: {estoque.stock}
                </div>
              ))}
            </div>
          </div>
          <div className={style.saidasContainer}>
            <h2>Saídas</h2>
            <div className={style.saidas}>
              {vendas.map(venda => (
                <div>
                  Pedido {`#${venda.id}`}
                  Data: {moment(venda.date).format("DD/MM/YYYY")}
                  Valor: R${venda.cost.toFixed(2)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
