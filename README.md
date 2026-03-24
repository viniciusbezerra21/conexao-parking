# 🚗 Conexão Parking - Frontend

## 🇧🇷 Descrição

Este projeto foi gerado utilizando o **Angular CLI** versão 21.1.2. Ele serve como a interface principal para o sistema de gerenciamento de estacionamentos **Conexão Parking**, focado em uma experiência de usuário reativa, moderna e de alta performance.

---

## 🇺🇸 Description

This project was generated using **Angular CLI** version 21.1.2. It serves as the main interface for the **Conexão Parking** system, focused on a reactive, modern, and high-performance user experience.

---

## 🌐 Deploy (Produção) | Live Demo

O projeto está disponível online através da Vercel:
👉 **[Conexão Parking - Live Web](https://conexao-parking.vercel.app)**

---

## 🎨 Identidade Visual e UX | UI/UX Design

* **PT-BR:** Design criado no Figma com foco em usabilidade e estética profissional

* **EN:** Designed in Figma focusing on usability and a professional look

* **Paleta / Palette:** Tons de vermelho e branco

* **Interface:** Dashboard limpo com foco em controle de fluxo e tabelas operacionais

---

## 🛠️ Tecnologias | Technologies

* Angular 21.1.2 (Standalone Architecture)
* Reactive Forms
* ngx-mask
* Vitest
* Tailwind CSS (Styling & Responsive Design)
* Angular Signals (State Management)
* Lucide Icons
* jwt-decode

---

## 🏗️ Arquitetura | Architecture

* **Backend (API):** Java 17 + Spring Boot
  👉 (https://github.com/viniciusbezerra21/api-conexao-parking)

---

## 🚀 Como rodar | Getting Started

### Pré-requisitos | Requirements

* Node.js (LTS)
* npm

### Instalar dependências | Install dependencies

```bash
npm install
```

### Rodar o projeto | Run project

```bash
ng serve
```

Acesse / Access: http://localhost:4200/

---

## ⚙️ Comandos Úteis | Useful Commands

### Build de produção | Production build

```bash
ng build
```

### Rodar testes | Run tests

```bash
ng test
```

### Gerar componente | Generate component

```bash
ng generate component nome-do-componente
```

---

## ⚠️ Configuração Crítica: ngx-mask | Critical Configuration

Arquivo / File: `app.config.ts`

```ts
import { provideNgxMask } from 'ngx-mask';

export const appConfig = {
  providers: [
    provideNgxMask()
  ]
};
```

Importe também `NgxMaskDirective` nos componentes onde utilizar máscaras.

Also import `NgxMaskDirective` in components where masks are used.

---

## ✨ Funcionalidades | Features

* ✅ Dashboard em tempo real | Real-time dashboard
* 🚫 Gestão de bloqueios | Vehicle blocking system
* 📝 Entrada e saída | Entry and exit control
* 🔒 Segurança com Spring Security | Authentication with Spring Security
* 🛡️ Controle de Acesso (RBAC) | Role-Based Access Control (Admin/User)
* ⚡ Interface Reativa com Signals | Reactive UI with Angular Signals
* 📝 Gestão completa de veículos (CRUD) | Full Vehicle Management

---

### Variáveis de Ambiente | Environment Variables

No arquivo `src/environments/environment.development.ts`, certifique-se de configurar a URL da API local:
```ts
export const environment = {
  apiUrl: 'http://localhost:8080'
};

---

## 👨‍💻 Autor | Author

**Vinicius Bezerra**
Software Developer & Student
