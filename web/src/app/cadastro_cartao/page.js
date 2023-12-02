"use client"

import { Header } from '../../ui/header';
import { useState } from 'react';

import style from "./page.module.css";

export default function CadastroAdmin() {
  const [nome, setNome] = useState('');
  const [numero_cartao, setNumeroCartao] = useState('');
  const [codigo_seguranca, setCodigoSeguranca] = useState('');
  const [data_validade, setDataValidade] = useState('');

  function enviar() {
    let texto = "Número Cartão: " + numero_cartao + "\nNode do Titular: " + nome + "\nCódigo de Segurança: " + codigo_seguranca + "\nData de Validade: " + data_validade
    alert(texto)
  }

  return (
    <>
      <Header />
      <main className='main'>
        <header>
          <h1 className={style.titulo}>Cadastro de Cartão</h1>
        </header>
        <form className={style.form}>
          <input placeholder="Número do Cartão" type='text' id='campo_numero_cartao' onChange={(e) => setNumeroCartao(e.target.value)} /><br />
          <input placeholder="Nome do Titular" type='text' id='campo_nome' onChange={(e) => setNome(e.target.value)} /><br />
          <input placeholder="Código de Segurança" type='text' id='campo_codigo_seguranca' onChange={(e) => setCodigoSeguranca(e.target.value)} /><br />
          <input placeholder="Data de Validade" type='date' id='campo_data_validade' onChange={(e) => setDataValidade(e.target.value)} /><br />
          <input value="Cadastrar" type='submit' onClick={(e) => enviar()} /><br />
        </form>
      </main>
    </>
  )
}
