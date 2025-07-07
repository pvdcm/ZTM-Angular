# Clips

Este projeto foi gerado com [Angular CLI](https://github.com/angular/angular-cli) versão 14.2.8.

## 🚀 Início Rápido

### 1. Instale o Angular CLI globalmente
```bash
npm install -g @angular/cli
```

### 2. Instale as dependências do projeto
```bash
npm install
```

### 3. Execute o servidor de desenvolvimento
```bash
ng serve
```

Navegue para `http://localhost:4200/`. A aplicação será recarregada automaticamente se você alterar algum arquivo fonte.

> **💡 Alternativa sem Angular CLI global:**
> ```bash
> npx ng serve
> ```
> ou
> ```bash
> npm start
> ```

## 📖 Sobre a Aplicação

**Clips** é uma aplicação Angular completa para gerenciamento de vídeos/clips com as seguintes funcionalidades:

- **📤 Upload de vídeos** com geração automática de thumbnails
- **👥 Sistema de usuários** com autenticação via Firebase
- **🎨 Interface moderna** com componentes reutilizáveis
- **📱 Design responsivo** com sistema de abas e modais
- **📊 Gestão de dados** em tempo real com Firestore
- **🔒 Segurança** com validação de formulários e controle de acesso


## 🔧 Comandos de Desenvolvimento

### Gerando componentes
Execute `ng generate component component-name` para gerar um novo componente. Você também pode usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build
Execute `ng build` para compilar o projeto. Os artefatos de build serão armazenados no diretório `dist/`.

### Executando testes unitários
Execute `ng test` para executar os testes unitários via [Karma](https://karma-runner.github.io).

### Executando testes end-to-end
Execute `ng e2e` para executar os testes end-to-end via uma plataforma de sua escolha. Para usar este comando, você precisa primeiro adicionar um pacote que implementa capacidades de teste end-to-end.

## 🔥 Configuração do Firebase

### 1. Crie um projeto Firebase
1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative os serviços:
   - **Authentication** (Email/Password)
   - **Firestore Database**
   - **Storage**

### 2. Configure as credenciais
Crie o arquivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "sua-api-key",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "sua-app-id"
  }
};
```


## 📦 Dependências Principais

- **Angular 14**: Framework principal
- **Firebase**: Backend e autenticação
- **ngx-mask**: Formatação de campos
- **TailwindCSS**: Framework CSS

## 🐛 Solução de Problemas

### Erro: "Firebase not configured"
- Verifique se o arquivo `environment.ts` está configurado corretamente
- Confirme se o Firebase está inicializado no `app.module.ts`

### Erro: "Permission denied"
- Verifique as regras do Firestore e Storage
- Confirme se o usuário está autenticado

### Erro de build
- Execute `npm install` novamente
- Verifique se todas as dependências estão instaladas

## 📞 Ajuda Adicional

Para obter mais ajuda sobre o Angular CLI, use `ng help` ou confira a página [Angular CLI Overview and Command Reference](https://angular.io/cli).
