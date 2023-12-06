"use client"

import { useState } from 'react';
import Link from 'next/link';

import style from "./page.module.css";

export default function CadastroProduto() {
  const [nome, setNome] = useState('');
  const [tipoBrownie, setTipoBrownie] = useState('');
  const [preco, setPreco] = useState('');
  const [nomeArquivo, setNomeArquivo] = useState('Selecione a Imagem do Brownie');

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setNomeArquivo(file.name);
    } else {
      setNomeArquivo('Selecione a Imagem do Brownie');
    }
  }

  function enviar() {
    let texto = "Nome: " + nome + "\nPreço: " + preco + "\nTipo: " + tipoBrownie + "\nNome do Arquivo Anexado: " + nomeArquivo
    alert(texto)
  }

  return (
    <>
      <Link href="/admin/produtos" className={style.voltar}>Voltar</Link>
      <main className='main'>
        <header>
          <h1 className={style.titulo}>Cadastrar Produto</h1>
        </header>
        <forms className={style.form} id='formulario'>
          <label htmlFor="foto_brownie" className={style.customFileInput}> {nomeArquivo} </label><br />
          <input type="file" id="foto_brownie" onChange={handleFileChange} style={{ display: 'none' }} />

          <select name="selecao_tipos" id="tipo" form="formulario" value={tipoBrownie} onChange={(e) => setTipoBrownie(e.target.value)}>
            <option value="" disabled hidden>Selecione o Tipo do Brownie</option>
            <option value="chocolate">Chocolate</option>
            <option value="vegano">Vegano</option>
            <option value="exotico">Exótico</option>
          </select><br />

          <input placeholder="Nome do Brownie" type='text' id='campo_nome' onChange={(e) => setNome(e.target.value)} /><br />
          <input placeholder="Preço" type='text' id='campo_preco' onChange={(e) => setPreco(e.target.value)} /><br />
          <input value="Cadastrar Brownie" type='submit' onClick={(e) => enviar()} /><br />
        </forms>
      </main>
    </>
  )
}
