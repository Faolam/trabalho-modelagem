"use client"

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import style from "./page.module.css";
import { AuthContext } from "@/contexts/auth";
import { server } from '@/server';

export default function AlterarProduto({ params }) {
  const [id, setId] = useState();
  const [nome, setNome] = useState('Nome do Brownie');
  const [tipoBrownie, setTipoBrownie] = useState('Tipo do Brownie');
  const [preco, setPreco] = useState('Preço do Brownie');
  const { user, token } = useContext(AuthContext);
  const [searching, setSearching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user || user && user.permissionLevel != 1) {
      router.push('/admin/login');
      return;
    }
    const name = decodeURIComponent(params.name);
    server.get('/web/findProduct', {
      params: { name }
    })
      .then(response => {
        if (response.data.status !== 200) {
          throw new Error();
        }
        setNome(response.data.data[0].brownieName)
        setTipoBrownie(response.data.data[0].brownieCategory)
        setPreco(response.data.data[0].price)
        setId(response.data.data[0].id)
      })
      .finally(() => setSearching(false));
  }, []);

  function handleSubmit(e) {

    e.preventDefault();
    server.post('/admin/updateProduct', {
      id: id,
      brownieName: nome,
      brownieCategory: tipoBrownie,
      price: parseFloat(preco),

    }, { headers: { authorization: token } })
      .then(response => {
        console.log(response.data.status)
        if (response.data.status !== 200) {
          throw new Error();
        }
        alert("Brownie Alterado com Sucesso !")
        router.push("/admin/produtos")
      })

      .catch(error => {
        console.log(error);
        alert("Não foi possível alterar o brownie especificado. Tente novamente mais tarde.")
      })
  }

  if (!user || user && user.permissionLevel != 1) {
    return <></>
  }

  return (
    <>
      <Link href="/admin/produtos" className={style.voltar}>Voltar</Link>
      <main className='main'>
        <header>
          <h1 className={style.titulo}>Alterar Produto</h1>
        </header>
        <form className={style.form} id='formulario'>
          <input
            value={nome}
            type='text'
            id='campo_nome'
            onChange={(e) => setNome(e.target.value)} />
          <br />
          <input
            value={tipoBrownie}
            type='text'
            id='campo_tipo'
            onChange={(e) => setTipoBrownie(e.target.value)} />
          <br />
          <input
            value={preco}
            type='text'
            id='campo_preco'
            onChange={(e) => setPreco(e.target.value)} />
          <br />
          <input
            value="Alterar Brownie"
            type='submit'
            onClick={(e) => handleSubmit(e)} />
          <br />
        </form>
      </main>
    </>
  )
}
