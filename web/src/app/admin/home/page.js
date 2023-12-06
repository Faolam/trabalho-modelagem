
import Link from 'next/link';
import style from "./page.module.css";

export default function HomeAdmin() {
  return (
    <>
      <main className='main'>
        <header>
          <h1 className={style.titulo}>O que você deseja?</h1>
        </header>

        <Link href="/admin/login" className={style.logoutLink}>Sair</Link>

        <div className={style.buttonContainer}>
          <Link href="/admin/produtos" className={style.actionButton}>Ver Produtos</Link>
          <Link href="/admin/pedidos" className={style.actionButton}>Ver Pedidos</Link>
          <Link href="/admin/faturamento" className={style.actionButton}>Ver Faturamento</Link>
        </div>
      </main>
    </>
  );
}
