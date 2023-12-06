"use client"

import { Header } from '../../ui/header';
import { useState } from 'react';
import { server } from '@/server';

import style from "./page.module.css";
import { useRouter } from 'next/navigation';

export default function Cadastro() {
  const router = useRouter();
  const [name, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');
  const [phone, setPhone] = useState('')

  const [repeteSenha, setRepeteSenha] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    if (password !== repeteSenha) {
      alert("As senhas não coincidem");
      return;
    }

    server.post('/user/newUser', {
      name,
      email,
      password,
      phone
    })
      .then(response => {
        if (response.status !== 200) {
          throw new Error();
        }
        router.push('/login');
      })
      .catch(error => {
        console.log(error);
        alert("Não foi possível realizar o cadastro. Tente novamente mais tarde.")
      });
  }

  return (
    <>
      <Header />
      <main className='main'>
        <header>
          <h1 className={style.titulo}>Cadastro</h1>
        </header>
        <forms className={style.form}>
          <input placeholder="Nome Completo" type='text' id='campo_name' value={name} onChange={(e) => setNome(e.target.value)} /><br />
          <input placeholder="Telefone" type='text' id='telefone' value={phone} onChange={(e) => setPhone(e.target.value)} /><br />
          <input placeholder="Email" type='text' id='campo_email' value={email} onChange={(e) => setEmail(e.target.value)} /><br />
          <input placeholder="Senha" type='password' id='campo_password' value={password} onChange={(e) => setSenha(e.target.value)} /><br />
          <input placeholder="Repetir a Senha" type='password' value={repeteSenha} id='campo_repete_senha' onChange={(e) => setRepeteSenha(e.target.value)} /><br />
          <input value="Cadastrar" type='submit' onClick={handleSubmit} /><br />
        </forms>
      </main>
    </>
  )
}
