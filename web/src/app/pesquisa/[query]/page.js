import { Header } from '../../../ui/header';

export default function Pesquisa({ params }) {
  return (
    <>
      <Header prev_query={decodeURIComponent(params.query)} />
      <main className='main'>
        <header className='page-header'>
          <h1 className='page-title'>Resultados</h1>
        </header>
      </main>
    </>
  )
}