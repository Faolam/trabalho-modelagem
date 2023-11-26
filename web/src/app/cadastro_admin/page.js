"use client"

import { Header } from '../../ui/header';
import { useState } from 'react';

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
      <Header />
      <main className='main'>
        <header>
          <h1 className={style.titulo}>Cadastro de Administrador</h1>
        </header>
        <forms className={style.form}>
          <input placeholder="Nome Completo" type='text' id='campo_nome' onChange={(e) => setNome(e.target.value)} /><br />
          <input placeholder="Email" type='text' id='campo_email' onChange={(e) => setEmail(e.target.value)} /><br />
          <input placeholder="Senha" type='password' id='campo_senha' onChange={(e) => setSenha(e.target.value)} /><br />
          <input placeholder="Repetir a Senha" type='password' id='campo_repete_senha' onChange={(e) => setRepeteSenha(e.target.value)} /><br />
          <input value="Cadastrar" type='submit' onClick={(e) => enviar()} /><br />
        </forms>
      </main>
    </>
  )
}
