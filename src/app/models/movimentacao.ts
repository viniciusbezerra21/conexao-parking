import { Veiculo } from './veiculo';

export interface Movimentacao {
    id: number;
    numeroPlaca: string;
    cor: string;
    tipoVeiculo: string;
    nomeProprietario: string; 
    cpfProprietario: string;  
    dataEntrada: string;
    dataSaida: string | null;
    observacaoEntrada: string | null;
    observacaoSaida: string | null;
}


export interface MovimentacaoEntrada {
    id: number;
    veiculo: Veiculo;
    observacaoEntrada: string;
}


export interface MovimentacaoSaida {
    id: number;
    observacaoSaida: string;
    dataSaida: string;
}

export interface PaginaMovimentacao {
    content: Movimentacao[];
    totalElements: number;
    totalPages: number;
    number: number;
    size?: number;
}