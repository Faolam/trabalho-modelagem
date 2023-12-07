"use client"

import style from "./page.module.css";

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/auth';
import { server } from "@/server";
import { useRouter } from "next/navigation";

export default function LoginAdmin() {
  const router = useRouter();
  const { user, setUser, setToken } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    server.post('/login', {
      email,
      password
    })
      .then(response => {
        if (response.data.status !== 200 || response.data.data.user.permissionLevel != 1) {
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
    if (user && user.permissionLevel == 1) {
      router.push('/admin');
    }
  }, [user]);

  return (
    <>
      <main className='main'>
        <header>
          <h1 className={style.titulo}>Área do Administrador</h1>
        </header>
        <forms className={style.form}>
          <input placeholder="Email" type='text' id='campo_email' value={email} onChange={(e) => setEmail(e.target.value)} /><br />
          <input placeholder="Senha" type='password' id='campo_password' value={password} onChange={(e) => setSenha(e.target.value)} /><br />
          <input value="Entrar" type='submit' onClick={handleSubmit} /><br />
        </forms>
      </main>
    </>
  )
}
