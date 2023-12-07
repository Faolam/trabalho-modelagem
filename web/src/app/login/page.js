"use client"

import style from "./page.module.css";

import { Header } from '../../ui/header';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { server } from '@/server';
import { AuthContext } from "@/contexts/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');

  const { user, setUser, setToken } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();

    server.post('/login', {
      email,
      password
    })
      .then(response => {
        if (response.data.status !== 200) {
          throw new Error();
        }

        setUser({ ...response.data.data.user, cards: response.data.data.cards });
        setToken(response.data.data.token);
      })
      .catch(error => {
        console.log(error);
        alert("Não foi possível realizar o login. Tente novamente mais tarde.")
      })
  }

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user]);

  return (
    <>
      <Header />
      <main className='main'>
        <header>
          <h1 className={style.titulo}>Login</h1>
        </header>
        <form className={style.form}>
          <input placeholder="Email" type='text' id='email' value={email} onChange={(e) => setEmail(e.target.value)} /><br />
          <input placeholder="Senha" type='password' id='campo_password' value={password} onChange={(e) => setSenha(e.target.value)} /><br />
          <input value="Logar" type='submit' onClick={handleSubmit} /><br />
          <Link href="/cadastro">Cadastrar</Link>
        </form>
      </main>
    </>
  )
}
