// Função que retorna uma variação imensa de numeros simbolos e letras
export function generateRandomString(length: number, putSysbols: boolean): string {
  const symbols = "!@#$%^&*()_-+=<>?/";
  const numbers = "0123456789";
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const allCharacters = (putSysbols ? symbols : "") + numbers + lowercaseLetters + uppercaseLetters;
  const charactersLength = allCharacters.length;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    randomString += allCharacters.charAt(randomIndex);
  }

  return randomString;
}