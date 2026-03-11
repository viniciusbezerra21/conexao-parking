export interface Veiculo {
    idVeiculo: number,
    proprietario: Proprietario,
    tipoVeiculo: TipoVeiculo,
    statusVeiculo?: StatusVeiculo,
    numeroPlaca: string,
    cor: string,
    bloqueado: boolean
    visitante?: boolean
}

export interface Proprietario {
    idProprietario: number,
    nome: string,
    cpfProprietario: string
}

export enum TipoVeiculo {
    MOTO = 'Moto',
    CARRO = 'Carro'
}

export enum StatusVeiculo {
    ATIVO = 'Liberado',
    INATIVO = 'Bloqueado',
    BLOQUEADO = 'Bloqueado'
}