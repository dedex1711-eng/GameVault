// =====================================================
// LISTA DE USUÁRIOS AUTORIZADOS
// =====================================================
// Para adicionar um cliente:
// 1. Copie um dos blocos abaixo
// 2. Preencha email, senha e plano ("basic" ou "premium")
// 3. Salve o arquivo
//
// plano "basic"   → sem acesso ao PS3
// plano "premium" → acesso completo
// =====================================================

export const USUARIOS = [
  {
    email: "cliente@gmail.com",
    senha: "senha123",
    nome: "Cliente Teste",
    plano: "premium"
  },
  {
    email: "basico@gmail.com",
    senha: "basico456",
    nome: "Cliente Basic",
    plano: "basic"
  },
  {
    email: "premium@gmail.com",
    senha: "premium123",
    nome: "Cliente Premium",
    plano: "premium"
  }
  // Adicione mais clientes aqui...
];
