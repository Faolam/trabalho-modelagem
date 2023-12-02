export const ValidateCreditCard = (numeroCartao: string): string =>  {
  // Espaços e Caracteres Invalidos
  const numeroCartaoLimpo = numeroCartao.replace(/\s/g, '');
  if (!/^\d+$/.test(numeroCartaoLimpo)) {
    return 'Número de cartão inválido';
  }

  // Comprimento
  if (!(12 <= numeroCartaoLimpo.length && numeroCartaoLimpo.length <= 19)) {
    return 'Comprimento do número do cartão inválido';
  }

  // Algoritmo de Luhn
  let soma = 0;
  const reverseDigits = numeroCartaoLimpo.split('').reverse().map(Number);
  for (let i = 0; i < reverseDigits.length; i++) {
    if (i % 2 === 1) {
      const doubleDigit = reverseDigits[i] * 2;
      soma += doubleDigit < 10 ? doubleDigit : doubleDigit - 9;
    } else {
      soma += reverseDigits[i];
    }
  }

  if (soma % 10 !== 0) {
    return 'Número do cartão inválido (Algoritmo de Luhn)';
  }

  // Bandeira
  if (numeroCartaoLimpo.startsWith('4')) {
    return 'Visa';
  } else if (numeroCartaoLimpo.startsWith('51') || numeroCartaoLimpo.startsWith('52') ||
             numeroCartaoLimpo.startsWith('53') || numeroCartaoLimpo.startsWith('54') ||
             numeroCartaoLimpo.startsWith('55')) {
    return 'MasterCard';
  } else if (numeroCartaoLimpo.startsWith('34') || numeroCartaoLimpo.startsWith('37')) {
    return 'American Express';
  } else if (numeroCartaoLimpo.startsWith('6011')) {
    return 'Discover';
  } else {
    return 'Bandeira desconhecida';
  }
}