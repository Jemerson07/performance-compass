export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function mapAuthErrorMessage(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes('invalid login credentials')) {
    return 'E-mail ou senha inválidos. Confira seus dados e tente novamente.';
  }

  if (normalized.includes('email not confirmed')) {
    return 'Confirme seu e-mail para concluir o acesso.';
  }

  if (normalized.includes('user already registered')) {
    return 'Este e-mail já está cadastrado. Faça login ou recupere a senha.';
  }

  if (normalized.includes('password should be at least')) {
    return 'A senha precisa ter pelo menos 6 caracteres.';
  }

  if (normalized.includes('failed to fetch') || normalized.includes('network')) {
    return 'Falha de conexão. Verifique sua internet e tente novamente.';
  }

  return message;
}
