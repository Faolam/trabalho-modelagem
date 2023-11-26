import { SearchBar } from './searchbar';
import Link from 'next/link';
import style from './header.module.css';

export function Header() {
  return (
    <header className={style.header}>
      <div className={style.content}>
        <div>
          <Link href="/" className={style.logo}>GaBrownie</Link>
        </div>
        <SearchBar />
        <nav className={style.nav}>
          <ul>
            <li><Link href="/">Pedidos</Link></li>
            <li><Link href="/">Carrinho</Link></li>
            <li><Link href="/">Login</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}