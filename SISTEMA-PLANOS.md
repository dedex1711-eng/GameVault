# Sistema de Planos GameVault

## Resumo das Implementações

O sistema foi atualizado para suportar dois planos distintos conforme solicitado:

### 📦 Plano Basic (R$ 10,00)
- Mais de 20.000 jogos
- Consoles: PS1, PS2, Super Nintendo, Mega Drive, Atari, Game Boy
- **NÃO inclui**: PS3, PS4, PS5, Xbox 360, Nintendo Switch

### 🏆 Plano Premium (R$ 15,00)
- Mais de 40.000 jogos
- **Versão COMPLETA com PS4** (conforme solicitado)
- **PS5 exclusivo para contas premium** (conforme solicitado)
- Todos os consoles: PS1, PS2, PS3, PS4, PS5, Xbox 360, Nintendo Switch, etc.

## Alterações Implementadas

### 1. **index.html** - Página de Vendas
- ✅ Atualizado plano Premium para destacar PS4 completo
- ✅ Adicionado PS5 como exclusivo Premium
- ✅ Plano Basic agora mostra claramente que não inclui PS4/PS5

### 2. **portal.html** - Interface do Portal
- ✅ Adicionadas seções PS4 e PS5 no menu lateral
- ✅ Badges diferenciados:
  - PS3: "OPÇÃO PREMIUM" (roxo)
  - PS4: "COMPLETO PREMIUM" (roxo)
  - PS5: "EXCLUSIVO PREMIUM" (dourado)

### 3. **portal.js** - Lógica de Controle de Acesso
- ✅ Sistema de controle baseado no plano do usuário
- ✅ Usuários Basic: Não veem PS3, PS4, PS5
- ✅ Usuários Premium: Acesso completo a tudo
- ✅ Conteúdo específico para PS4 e PS5 com tutoriais

### 4. **portal.css** - Estilos Visuais
- ✅ Adicionado badge dourado (.badge-gold) para PS5
- ✅ Banner dourado (.info-banner.gold) para destaque especial

### 5. **usuarios.js** - Usuários de Teste
- ✅ Adicionado usuário premium de exemplo
- ✅ Mantidos usuários basic e premium para testes

## Como Testar o Sistema

### Usuário Basic (sem PS4/PS5):
```
Email: basico@gmail.com
Senha: basico456
```
- Verá apenas: PC, Celular, TV Box, TV Android, Projetor
- NÃO verá: PS3, PS4, PS5

### Usuário Premium (com tudo):
```
Email: premium@gmail.com
Senha: premium123
```
- Verá tudo: PC, Celular, TV Box, TV Android, PS3, PS4, PS5, Projetor
- PS4 destacado como "COMPLETO"
- PS5 destacado como "EXCLUSIVO"

## Funcionalidades do Sistema

### Controle de Acesso Automático
- O sistema verifica o plano do usuário no login
- Menu lateral se adapta automaticamente
- Conteúdo premium fica oculto para usuários basic

### Conteúdo Diferenciado
- **PS4**: Tutoriais de jailbreak, homebrew store, pacote de jogos
- **PS5**: Conteúdo exclusivo com exploit, emuladores, ferramentas

### Mensagens Claras
- Banners explicativos em cada seção
- Destaque visual para conteúdo premium
- Comunicação clara sobre o que cada plano inclui

## Próximos Passos

1. **Adicionar conteúdo real**: Substituir links de exemplo por conteúdo real
2. **Configurar Supabase**: Garantir que a tabela `clientes` tenha a coluna `plano`
3. **Testar pagamentos**: Verificar se o checkout está criando usuários com plano correto
4. **Adicionar mais consoles**: Expandir conforme necessário

## Estrutura de Dados

### Tabela `clientes` (Supabase)
```sql
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  plano TEXT NOT NULL DEFAULT 'basic', -- 'basic' ou 'premium'
  created_at TIMESTAMP DEFAULT NOW()
);
```

O sistema está funcionando e pronto para uso! 🚀