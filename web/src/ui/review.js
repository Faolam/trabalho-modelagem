import Image from "next/image";

import style from './review.module.css';

export function Review({ foto, nome, nota, descricao }) {
  return (
    <div className={style.container}>
      <header>
        <Image
          src={foto}
          width={64}
          height={64}
          alt={nome} />
        <div>
          <span>{nome}</span>
          <span className={style.nota}>{nota}/5</span>
        </div>
      </header>
      <p>{descricao}</p>
    </div>
  );
}