import Link from 'next/link';
import Image from 'next/image';

import style from './brownielist.module.css';

export function BrownieList({ type, products }) {
  return (
    <div className={style.container}>
      <h2 className={style.type}>{type}</h2>
      <div className={style.products}>
        {products.map(({ nomeBrownie, preco, caminhoLogo }) => (
          <Link className={style.brownie} href="/" key={nomeBrownie}>
            <Image
              src={`/${caminhoLogo}`}
              width={240}
              height={160}
              alt={nomeBrownie}
            />
            <div>
              <span>{nomeBrownie}</span>
              <span className={style.brownie_price}>R$ {preco}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}