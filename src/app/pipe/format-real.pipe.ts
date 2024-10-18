import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatReal',
  standalone: true
})
export class FormatRealPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {
    if (typeof value === 'number') {
      return this.formatarNumero(value);
    }

    // Se o valor for string, verifica e formata corretamente
    if (typeof value === 'string') {

      // Captura números, percentuais, vírgulas, pontos e a palavra 'OFF'
      const regex = /([\d.,]+%)|([\d.,]+)|(\bOFF\b)/g;
      const matches = value.match(regex);

      if (matches) {
        const off = matches.find(match => match === 'OFF');
        const percentual = matches.find(match => match.includes('%')); // Encontra percentual, se existir

        // Remove qualquer prefixo como "a partir:"
        value = this.removerTextoExtra(value);

        // Verifica se o valor já está no formato correto (R$ 12.345,67)
        if (this.estaFormatado(value)) {
          return value;
        }

        // Se houver um percentual, retorna ele com "OFF", se existir
        if (percentual) {
          return off ? `${percentual} ${off}` : percentual;
        }

        // Se for string com caracteres não numéricos, converte para número e formata
        const valorNumerico = this.converterParaNumero(value);
        return off ? `${this.formatarNumero(valorNumerico)} ${off}` : this.formatarNumero(valorNumerico);
      }
    }

    return value;
  }


  formatarNumero(valor: number): string {
    // Formatar o valor com separadores de milhares, milhões, etc.
    const numeroFormatado = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,  // Garante 2 casas decimais
      maximumFractionDigits: 2   // Limita a 2 casas decimais
    }).format(valor);

    // Retornar o valor formatado com o símbolo do Real
    return `R$ ${numeroFormatado}`;
  }

  estaFormatado(valor: string): boolean {
    // Verifica se o valor já está no formato "R$ 12.345,67" usando uma regex
    const regex = /^R\$ \d{1,3}(\.\d{3})*,\d{2}$/;
    return regex.test(valor);
  }

  converterParaNumero(valor: string): number {
    // Remove o símbolo de Real e espaços
    valor = valor.replace('R$', '').trim();

    // Substitui a vírgula decimal por ponto sem alterar os valores numéricos que não têm separadores de milhares
    if (valor.includes(',')) {
      valor = valor.replace(/\./g, '').replace(',', '.');
    }

    // Converte para número, se possível
    const valorNumerico = parseFloat(valor);
    return isNaN(valorNumerico) ? 0 : valorNumerico;
  }

  removerTextoExtra(valor: string): string {
    // Regex para remover qualquer texto que venha antes de "R$"
    return valor.replace(/^.*?R\$/, 'R$').trim();
  }

}
