"use client"

import { Header } from '../../ui/header';
import { useState } from 'react';

import style from "./page.module.css";

export default function CriarTipo() {
  const [tipo, setTipo] = useState('');
  const [preco, setPreco] = useState('');

  function criar() {
    let texto = "Nome para o Tipo: " + tipo + "\nPreco Sugerido: " + preco
    alert(texto)
  }

  return (
    <>
      <Header />
      <main className='main'>
        <header>
          <h1 className={style.titulo}>Criar Tipo</h1>
        </header>
        <forms className={style.form}>
          <input placeholder="Nome para o Tipo" type='text' id='campo_nome' onChange={(e) => setTipo(e.target.value)} /><br />
          <input placeholder="Preço" type='text' id='campo_senha' onChange={(e) => setPreco(e.target.value)} /><br />
          <input value="Criar Tipo de Brownie" type='submit' onClick={(e) => criar()} /><br />
        </forms>
      </main>
    </>
  )
}
