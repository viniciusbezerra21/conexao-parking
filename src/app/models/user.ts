export interface UserData {
    emailCorporativo: string;
    senha: string;
    repetirSenha: string
}

export interface Usuario {
    idUsuario: number;
    emailCorporativo: string;
    senha: string;
    ativo: boolean;
    role?: string;
    precisaTrocarSenha?: boolean;
}

export interface CadastroResponse {
    usuario: Usuario;
    token: string;
}