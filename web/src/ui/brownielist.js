import Link from 'next/link';
import Image from 'next/image';

import style from './brownielist.module.css';

export function BrownieList({ type, products }) {
  return (
    <div className={style.container}>
      <h2 className={style.type}>{type}</h2>
      <div className={style.products}>
        {products.map(({ brownieName, price, logoPath }) => (
          <Link className={style.brownie} href={`/produto/${brownieName}`} key={brownieName}>
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGES_PATH}/${logoPath}.jpg`}
              width={240}
              height={160}
              alt={brownieName}
            />
            <div>
              <span>{brownieName}</span>
              <span className={style.brownie_price}>R${parseFloat(price).toFixed(2)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}