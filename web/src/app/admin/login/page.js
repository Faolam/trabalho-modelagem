"use client"

import { useState } from 'react';
import Link from 'next/link';

import style from "./page.module.css";

export default function CadastroAdmin() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [repeteSenha, setRepeteSenha] = useState('');

  function enviar() {
    let texto = "Nome: " + nome + "\nEmail: " + email + "\nSenha: " + senha + "\nSenha Repetida: " + repeteSenha
    alert(texto)
  }

  return (
    <>
      <main className='main'>
        <header>
          <h1 className={style.titulo}>Área do Administrador</h1>
        </header>
        <forms className={style.form}>
          <input placeholder="Email" type='text' id='campo_email' onChange={(e) => setEmail(e.target.value)} /><br />
          <input placeholder="Senha" type='password' id='campo_senha' onChange={(e) => setSenha(e.target.value)} /><br />
          <input value="Entrar" type='submit' onClick={(e) => enviar()} /><br />
        </forms>
      </main>
    </>
  )
}
