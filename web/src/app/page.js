import { Header } from '../ui/header';
import { BrownieList } from '../ui/brownielist';

import { brownies } from '../mock/brownies_tipo';

export default function Home() {
  return (
    <>
      <Header />
      <main className='main'>
        <header className='page-header'>
          <h1 className='page-title'>Produtos</h1>
        </header>
        {brownies.map(brownie => (
          <BrownieList key={brownie.tipo} type={brownie.tipo} products={brownie.produtos} />
        ))}
      </main>
    </>
  )
}
