import { Categoria } from "../models/categoria"
import { Loja } from "../models/loja"

export class ProdutoLoja{

  id: number = 0
  titulo: string = ""
  preco: string = ""
  parcelado: string = ""
  cupom: string = ""
  tituloPequeno: string = ""
  mensagemAdicional: string = ""
  freteVariacoes: string = ""
  lojaResponseDto = new  Loja()
  linkSiteOmc?: string
  linkAppOmc?: string
  linkSiteSe?: string
  linkAppSe?: string
  categoriaDto = new Categoria("");
  imagem!: any
  dataCriacao!: string
  imagemSocial: string = "";
  copy: string = "";
  promocaoEncerrada!: boolean;
  nomeColaborador: string = "";

}
