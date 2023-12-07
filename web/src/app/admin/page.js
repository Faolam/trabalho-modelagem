"use client"
import Link from 'next/link';
import style from "./page.module.css";
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/auth';
import { useRouter } from 'next/navigation';

export default function HomeAdmin() {
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
        <header>
          <h1 className={style.titulo}>O que você deseja?</h1>
        </header>

        <Link href="/logout" className={style.logoutLink}>Sair</Link>

        <div className={style.buttonContainer}>
          <Link href="/admin/produtos" className={style.actionButton}>Ver Produtos</Link>
          <Link href="/admin/pedidos" className={style.actionButton}>Ver Pedidos</Link>
          <Link href="/admin/faturamento" className={style.actionButton}>Ver Faturamento</Link>
        </div>
      </main>
    </>
  );
}
