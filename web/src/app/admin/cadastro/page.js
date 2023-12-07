"use client"

import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/contexts/auth';
import style from "./page.module.css";
import { useRouter } from 'next/navigation';
import { server } from '@/server';


export default function CadastroAdmin() {
  const { user, token } = useContext(AuthContext);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [repeteSenha, setRepeteSenha] = useState('');
  const router = useRouter();

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

    if (senha !== repeteSenha) {
      alert("As senhas não coincidem");
      return;
    }

    server.post('/admin/newUser', {
      name: nome,
      email: email,
      password: senha,
      phone: telefone,

    }, { headers: { authorization: token } })

      .then(response => {
        if (response.data.status !== 200) {
          throw new Error();
        }
        setNome('');
        setEmail('');
        setSenha('');
        setTelefone('');
        setRepeteSenha('');
        alert("Administador Cadastrado!");
      })
      .catch(error => {
        console.log(error);
        alert("Não foi possível realizar o cadastro. Tente novamente mais tarde.")
      });
  }

  return (
    <>
      <Link href="/cadastro" className={style.voltar}>Voltar</Link>
      <main className='main'>
        <header>
          <h1 className={style.titulo}>Cadastro de Administrador</h1>
        </header>
        <forms className={style.form}>
          <br />
          <br />
          <input placeholder="Nome Completo" type='text' id='campo_nome' value={nome} onChange={(e) => setNome(e.target.value)} /><br />
          <input placeholder="Email" type='text' id='campo_email' value={email} onChange={(e) => setEmail(e.target.value)} /><br />
          <input placeholder="Senha" type='password' id='campo_senha' value={senha} onChange={(e) => setSenha(e.target.value)} /><br />
          <input placeholder="Repetir a Senha" type='password' id='campo_repete_senha' value={repeteSenha} onChange={(e) => setRepeteSenha(e.target.value)} /><br />
          <input placeholder="Número de Telefone" type='text' id='campo_telefone' value={telefone} onChange={(e) => setTelefone(e.target.value)} /><br />
          <input value="Cadastrar" type='submit' onClick={handleSubmit} /><br />
        </forms>
      </main>
    </>
  )
}
