"use client"

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import style from "./page.module.css";
import { AuthContext } from "@/contexts/auth";
import { server } from '@/server';

export default function CadastroProduto() {
  const [nome, setNome] = useState('');
  const [tipoBrownie, setTipoBrownie] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState();

  const router = useRouter();
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (!user || user && user.permissionLevel != 1) {
      router.push('/admin/login');
      return;
    }
  }, []);

  if (!user || user && user.permissionLevel != 1) {
    return <></>;
  }

  function handleSubmit(e) {

    e.preventDefault();

    server.post('/admin/newProduct', {
      name: nome,
      category: tipoBrownie,
      price: preco,
      image: imagem,

    }, { headers: { authorization: token } })
      .then(response => {
        console.log(response.data.status)
        if (response.data.status !== 200) {
          throw new Error();
        }
        alert("Brownie Cadastrado com Sucesso !")
      })
      .catch(error => {
        console.log(error);
        alert("Não foi possível cadastrar o brownie especificado. Tente novamente mais tarde.");
      })
  }

  return (
    <>
      <Link href="/admin/produtos" className={style.voltar}>Voltar</Link>
      <main className='main'>
        <header>
          <h1 className={style.titulo}>Cadastrar Produto</h1>
        </header>
        <forms className={style.form} id='formulario'>
          <input placeholder="Cole aqui o link para a imagem" type='text' id='campo_nome' onChange={(e) => setImagem(e.target.value)} /><br />
          <input placeholder="Nome do Brownie" type='text' id='campo_nome' onChange={(e) => setNome(e.target.value)} /><br />
          <input placeholder="Categoria do Brownie" type='text' id='campo_categoria' onChange={(e) => setTipoBrownie(e.target.value)} /><br />
          <input placeholder="Preço" type='text' id='campo_preco' onChange={(e) => setPreco(parseFloat(e.target.value))} /><br />
          <input value="Cadastrar Brownie" type='submit' onClick={(e) => handleSubmit(e)} /><br />
        </forms>
      </main>
    </>
  )
}
