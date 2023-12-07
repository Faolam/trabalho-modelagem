"use client"

import { useContext, useState } from 'react';
import Link from 'next/link';

import style from "./page.module.css";
import { useRouter } from 'next/navigation';

export default function CadastroAdmin() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [repeteSenha, setRepeteSenha] = useState('');
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user || user && user.permissionLevel != 1) {
      router.push('/admin/login');
      return;
    }
  }, []);

  if (!user || user && user.permissionLevel != 1) {
    return <></>;
  }

  function enviar() {
    let texto = "Nome: " + nome + "\nEmail: " + email + "\nSenha: " + senha + "\nSenha Repetida: " + repeteSenha
    alert(texto)
  }

  return (
    <>
      <Link href="/cadastro" className={style.voltar}>Voltar</Link>
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
