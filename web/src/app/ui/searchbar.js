import style from './searchbar.module.css';

export function SearchBar() {
  return (
    <div className={style.shape}>
      <input type="text" placeholder="Pesquisar" />
    </div>
  );
}