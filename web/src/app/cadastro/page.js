import { Header } from '../ui/header';

export default function Cadastro() {
  return (
    <>
      <Header />
      <main>
        <header>
          <h1>Cadastro</h1>
          <forms>
            <input placeholder={"Nome Completo"} type='text' /><br />
            <input placeholder={"Email"} type='text' /><br />
            <input placeholder={"Senha"} type='password' /><br />
            <input placeholder={"Repetir a Senha"} type='password' /><br />
          </forms>
        </header>
      </main>
    </>
  )
}
