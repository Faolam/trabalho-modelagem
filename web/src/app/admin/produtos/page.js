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
import moment from 'moment-timezone';

export default function ProdutosAdmin() {
  const [brownies, setBrownies] = useState([]);
  const [brownie, setBrownie] = useState(null);
  const [estoqueBrownie, setEstoqueBrownie] = useState([]);
  const [validade, setValidade] = useState(moment().format("YYYY-MM-DD"))
  const [quantidadeLote, setQuantidadeLote] = useState(0);
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

  useEffect(() => {
    if (!brownie) return;

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

        const vendas = response.data.data.out;
        const estoques = response.data.data.in;

        let vendasMoney = 0;
        let estoqueMoney = 0;

        vendas.forEach(venda => vendasMoney += venda.cost);
        estoques.forEach(estoque => estoqueMoney += estoque.price);

        setVendasTotal(vendasMoney);
        setEstoquesTotal(estoqueMoney);
        setLucro(vendasMoney - estoqueMoney);

        setVendas(response.data.data.out);
        setEstoques(response.data.data.in);
      })
      .catch(e => alert("Não foi possível obter o faturamento"));
  }, [brownie]);

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

  function handleAdicionarLote(brownie) {
    server.post('/admin/addBatch', {
      productId: brownie.id,
      stock: quantidadeLote,
      validity: moment(validade).format("DD/MM/YYYY")
    }, { headers: { authorization: token } })
      .then(res => {
        if (res.data.status != 200) throw new Error();
        setBrownie(null);
        alert("Lote adicionado!");
      })
      .catch(err => alert("Não foi possível criar o lote."));
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
                <input id="validade" type="date" value={validade} onChange={e => setValidade(e.target.value)} />
              </div>
              <div className={style.inputLabel}>
                <label htmlFor="quantidade">Quantidade</label>
                <input id="quantidade" type="number" value={quantidadeLote} onChange={e => setQuantidadeLote(e.target.value)} />
              </div>
              <button className={style.lote} type="button" onClick={e => handleAdicionarLote(brownie)}>ADICIONAR LOTE</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}