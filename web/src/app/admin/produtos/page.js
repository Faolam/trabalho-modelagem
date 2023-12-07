"use client"

/* import { brownies } from '@/mock/brownies'; */
import style from './page.module.css';
import { AuthContext } from "@/contexts/auth";
import { useContext, useState, useEffect } from 'react';
import { Header } from '@/ui/header';
import { Modal } from '@/ui/modal';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { server } from '@/server';

export default function ProdutosAdmin() {
  const [brownies, setBrownies] = useState([]);
  const [brownie, setBrownie] = useState(null);
  const router = useRouter();
  const { user, token } = useContext(AuthContext);

  function getBrownies() {
    server.get('/web/listProducts')
      .then(response => {
        console.log(response.data);

        if (response.data.status !== 200) {
          throw new Error();
        }

        setBrownies([].concat(...response.data.data));
      })
      .catch(e => alert("Não foi possível listar os pedidos"));
  }

  useEffect(() => {
    if (!user || user && user.permissionLevel != 1) {
      router.push('/admin/login');
      return;
    }

    getBrownies();

  }, []);

  function handleDelete(brownie) {
    server.post('/admin/deleteProduct', {
      id: brownie.id
    }, { headers: { authorization: token } })
      .then(res => {
        if (res.data.status !== 200) throw new Error();
        getBrownies();
      })
      .catch(e => alert("Não foi possível remover o produto"))
  }

  if (!user || user && user.permissionLevel != 1) {
    return <></>;
  }

  return (
    <>
      <Header />
      <main className='main'>
        <header className='page-header'>
          <h1 className='page-title'>Produtos</h1>
          <Link href="/admin" className={style.link}>Voltar</Link>
          <Link href="/admin/cadastro_produto" className={style.link}>Criar Produto</Link>
        </header>
        <div className={style.brownies}>
          {brownies.map(brownie => (
            <button
              type="button"
              key={brownie.id}
              className={style.brownie}
              onClick={() => setBrownie(brownie)}>
              <div className={style.imgContainer}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGES_PATH}/${brownie.logoPath}.jpg`}
                  style={{ width: '100%', height: '100%' }}
                  fill
                  objectFit='cover'
                  alt={brownie.brownieName}
                />
              </div>
              <div className={style.brownieInfo}>
                <strong style={{ display: 'block' }}>{brownie.brownieName}</strong>
                <div>Restam {brownie.inStock}</div>
                <Link onClick={e => e.stopPropagation()} href={`/admin/alterar_produto/${encodeURIComponent(brownie.brownieName)}`} className={style.brownieEdit}>Editar</Link>
                <button
                  className={style.brownieDelete}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(brownie)
                  }}>
                  Excluir</button>
              </div>
            </button>
          ))}
        </div>
      </main>
      <Modal
        isOpen={!!brownie}
        onRequestClose={() => setBrownie(null)}
      >
        {!brownie ? <></> : (
          <div className={style.modalContent}>
            <h2 style={{ marginBottom: '1rem' }}>{brownie.brownieName}</h2>
            <div>Tipo: {brownie.brownieCategory}</div>
            <div>Valor: R${(brownie.price).toFixed(2)}</div>
            <div>Unidades: {brownie.inStock}</div>
            <div className={style.estoque}>
              <h3 style={{ margin: '1rem 0' }}>Estoque</h3>
            </div>
            <div className={style.loteContainer}>
              <div className={style.inputLabel}>
                <label htmlFor="validade">Data de validade</label>
                <input id="validade" type="date" />
              </div>
              <div className={style.inputLabel}>
                <label htmlFor="quantidade">Quantidade</label>
                <input id="quantidade" type="number" />
              </div>
              <button className={style.lote} type="button">ADICIONAR LOTE</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}