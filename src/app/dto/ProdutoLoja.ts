import { Categoria } from "../models/categoria"
import { Loja } from "../models/loja"

export class ProdutoLoja{

  id!: number
  titulo!: string;
  preco!: string
  descricao!: string
  link!: string
  cupom!: string
  tituloPequeno!: string
  lojaResponseDto!: Loja
  categoriaDto!: Categoria
  imagem: any
}
