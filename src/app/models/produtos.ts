import { Categoria } from "./categoria";
import { Loja } from "./loja";

export interface Produto {
  id?: number;
  titulo?: string;
  copy?: string;
  preco?: string;
  parcelado?: string;
  cupom?: string;
  link?: string;
  freteVariacoes?: string;
  mensagemAdicional?: string;
  promocaoEncerrada?: boolean;
  dataCriacao?: Date;
  imagem?: string;
  imagemSocial?: string;
  imagemLoja?: string;
  nomeLoja?: string;
  descricao?: string;
}

