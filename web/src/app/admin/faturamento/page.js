"use client"

import { Header } from '../../../ui/header';
import { useState } from 'react';
import Link from 'next/link';

import style from "./page.module.css";

export default function Faturamento() {
  const [data, setData] = useState('12/04/2004');
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user || user && user.permissionLevel != 1) {
      router.push('/admin/login');
      return;
    }
  }, []);

  if (!user || user && user.permissionLevel != 1) {
    return <></>;
  }

  return (
    <>
      <main className='main'>
        <header className="page-header">
          <h1 className="page-title">Faturamento</h1>
          <Link href="/admin/home" className={style.link}>Voltar</Link>
          <div className={style.infoPeriodo}>
            <div className={style.periodo}>
              <span>Início do período</span>
              <input type="date" />
              <span>Fim do período</span>
              <input type="date" />
            </div>
            <strong>Total: <span>R$1400,00</span></strong>
          </div>
        </header>

      </main>
    </>
  )
}
