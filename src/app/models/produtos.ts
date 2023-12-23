import { Loja } from "./loja";

export class Produtos {

  public id!: number
  public titulo!: string
  public preco!: string
  public descricao!: string
  public dataCriacao!: string;
  public cupom!: string
  public link!: string
  public imagem!: any
  public loja!: Loja

  constructor() { }
}
