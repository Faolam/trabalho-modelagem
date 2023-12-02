import { SearchBar } from './searchbar';
import Link from 'next/link';
import style from './header.module.css';

export function Header({ prev_query = '' }) {
  return (
    <header className={style.header}>
      <div className={style.content}>
        <div>
          <Link href="/" className={style.logo}>GaBrownie</Link>
        </div>
        <SearchBar prev_query={prev_query} />
        <nav className={style.nav}>
          <ul>
            <li><Link href="/pedidos">Pedidos</Link></li>
            <li><Link href="/carrinho">Carrinho</Link></li>
            <li><Link href="/login">Login</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}