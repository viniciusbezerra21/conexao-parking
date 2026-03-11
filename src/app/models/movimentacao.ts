import { Veiculo } from './veiculo';
export interface MovimentacaoEntrada {
    idMovimentacao: number,
    Veiculo: Veiculo,
    observacaoEntrada: string
}

export interface MovimentacaoSaida {
    MovimentacaoEntrada: MovimentacaoEntrada 
    observacaoSaida: string
}