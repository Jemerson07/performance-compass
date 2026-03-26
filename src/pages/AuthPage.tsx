import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, User, Briefcase, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { normalizeEmail } from '@/lib/authErrors';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState<'manager' | 'employee'>('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = normalizeEmail(email);
    const cleanName = name.trim();

    if (isLogin) {
      const { error } = await signIn(cleanEmail, password);
      if (error) {
        toast({ title: 'Erro ao entrar', description: error.message, variant: 'destructive' });
      }
    } else {
      // Validações de cadastro
      if (!cleanName) {
        toast({ title: 'Nome obrigatório', description: 'Informe seu nome completo.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        toast({ title: 'Senha muito curta', description: 'A senha deve ter pelo menos 6 caracteres.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast({ title: 'Senhas não conferem', description: 'A confirmação de senha não é igual à senha digitada.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      const { error } = await signUp(cleanEmail, password, cleanName, role, jobTitle);
      if (error) {
        toast({ title: 'Erro ao cadastrar', description: error.message, variant: 'destructive' });
      } else {
        setRegistrationSuccess(true);
        toast({
          title: 'Conta criada com sucesso!',
          description: 'Verifique seu e-mail para confirmar o cadastro antes de fazer login.',
        });
      }
    }
    setLoading(false);
  };

  const switchTab = (tab: 'login' | 'register') => {
    setIsLogin(tab === 'login');
    setRegistrationSuccess(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setJobTitle('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">PerformanceAI</h1>
              <p className="text-[11px] text-muted-foreground">por Jemerson</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-muted rounded-lg p-0.5 mb-6">
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => switchTab(tab)}
                className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${
                  (tab === 'login') === isLogin
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'login' ? 'Entrar' : 'Cadastrar'}
              </button>
            ))}
          </div>

          {/* Sucesso de registro */}
          {registrationSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-4"
            >
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Cadastro realizado!</h3>
              <p className="text-sm text-muted-foreground">
                Enviamos um e-mail de confirmação para <strong>{email}</strong>. Confirme seu e-mail para ativar a conta.
              </p>
              <button
                type="button"
                onClick={() => switchTab('login')}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                Ir para Login
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  {/* Nome */}
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Nome completo *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-muted rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Cargo */}
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Cargo (opcional)"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full bg-muted rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Perfil de acesso */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">
                      Perfil de acesso
                    </label>
                    <div className="flex bg-muted rounded-lg p-0.5">
                      {([
                        { value: 'employee' as const, label: '👤 Colaborador' },
                        { value: 'manager' as const, label: '👔 Gestor' },
                      ]).map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setRole(r.value)}
                          className={`flex-1 text-xs font-medium py-2 rounded-md transition-all ${
                            role === r.value
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* E-mail */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="E-mail *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-muted rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Senha */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha *"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className="w-full bg-muted rounded-lg pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Confirmar senha (apenas no cadastro) */}
              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirmar senha *"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className={`w-full bg-muted rounded-lg pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
                      confirmPassword && password !== confirmPassword
                        ? 'focus:ring-destructive ring-1 ring-destructive/50'
                        : 'focus:ring-primary'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Indicador de força da senha no cadastro */}
              {!isLogin && password.length > 0 && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          password.length >= level * 2
                            ? level <= 1
                              ? 'bg-destructive'
                              : level <= 2
                              ? 'bg-warning'
                              : level <= 3
                              ? 'bg-yellow-400'
                              : 'bg-primary'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {password.length < 6
                      ? 'Mínimo 6 caracteres'
                      : password.length < 8
                      ? 'Senha fraca'
                      : password.length < 10
                      ? 'Senha razoável'
                      : 'Senha forte'}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Aguarde...
                  </span>
                ) : isLogin ? 'Entrar' : 'Criar conta'}
              </button>

              {isLogin && (
                <p className="text-[11px] text-muted-foreground text-center">
                  No modo offline, use credenciais previamente autenticadas para acesso local.
                </p>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
