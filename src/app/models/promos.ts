export interface Promos{

  idPromo: number
  copyPromo: string


}

export interface PrmomsProdutos{

  idPromo: number
  copyPromo: string
  urlImagem: string
  produtoResponseDto: ProdutosPromo[]

}

export interface ProdutosPromo{

  id: number
  titulo: string
  preco: string
  urlImagem: string
  freteVariacoes: string
  cupom: string
  link: string
  nomeLoja: string
  urlLoja: string
}

export interface PromoSalvar{
  id: number
  copyPromo: ''
  idProdutos: number[]
}
