export interface PostDTO {
  id: number
}

export interface PostsLista{
  id: number,
  titulo: string,
  conteudo: string
  urlImagem: string
}

export interface PostDTOGeral{
  id: number,
  titulo: string,
  conteudo: string
  urlImagem: string
  dataAtualizacao: string
  dataCriacao: string
}
