"use client"

import { Header } from '../../ui/header';
import { useState } from 'react';
import Link from 'next/link';

import style from "./page.module.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function logar() {
    let texto = "Email: " + email + "\nSenha: " + senha
    alert(texto)
  }

  return (
    <>
      <Header />
      <main className='main'>
        <header>
          <h1 className={style.titulo}>Login</h1>
        </header>
        <forms className={style.form}>
          <input placeholder="Email" type='text' id='campo_nome' onChange={(e) => setNome(e.target.value)} /><br />
          <input placeholder="Senha" type='password' id='campo_senha' onChange={(e) => setSenha(e.target.value)} /><br />
          <input value="Logar" type='submit' onClick={(e) => logar()} /><br />
          <Link href="/cadastro">Cadastrar</Link>
        </forms>
      </main>
    </>
  )
}
