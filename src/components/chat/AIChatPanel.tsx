import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const initialMessages: Message[] = [
  {
    role: 'assistant',
    content: '👋 Olá! Sou o **Assistente IA** do PerformanceAI. Posso te ajudar com:\n\n- 📊 Análise de desempenho da equipe\n- 💡 Sugestões de distribuição de tarefas\n- 🎯 Dicas de produtividade personalizadas\n- 🧠 Insights sobre competências\n\nComo posso ajudar?',
  },
];

const quickResponses: Record<string, string> = {
  'quem está sobrecarregado': '⚠️ **Alerta de Sobrecarga:**\n\n**Pedro Lima** está com carga de **155%** — muito acima da média.\n\n**Recomendações:**\n1. Redistribuir 3 tickets de suporte para Juliana Ferreira (carga atual: 45%)\n2. Carlos Santos pode assumir tarefas técnicas do Pedro\n3. Agendar 1:1 para entender gargalos\n\n> *"Funcionário Pedro Lima ultrapassou 150% da média — redistribuição sugerida."*',
  'como melhorar produtividade': '🚀 **Dicas de Produtividade:**\n\n1. **Blocos de Foco**: Separe 2h pela manhã para tarefas estratégicas\n2. **Regra 2-Minutos**: Tarefas rápidas, resolva imediatamente\n3. **E-mail Batch**: Verifique e-mails 3x ao dia, não continuamente\n4. **Pausas**: 5min a cada 50min aumenta produtividade em 17%\n\n📈 Baseado nos dados, **terça e quarta** são seus dias mais produtivos.',
  'análise da equipe': '📊 **Análise Geral da Equipe:**\n\n| Métrica | Valor | Tendência |\n|---------|-------|-----------|\n| Tarefas/semana | 635 | ↑ 12% |\n| Precisão média | 95% | ↑ 3% |\n| Tempo resposta | 28min | ↓ 8% |\n\n**Destaques:**\n- 🏆 **Juliana Ferreira**: Maior precisão (99%)\n- ⚡ **Carlos Santos**: Mais produtivo (168 tarefas)\n- 👑 **Maria Costa**: Melhor tempo de resposta (15min)\n\n**Atenção:** Pedro Lima precisa de suporte — carga excessiva está impactando qualidade.',
  'sugestão de tarefas': '🎯 **Distribuição Inteligente de Tarefas:**\n\nBaseado em perfil + carga + habilidades:\n\n1. **Tarefas Analíticas** → Juliana Ferreira *(carga: 45%, análise: 96)*\n2. **Tarefas Técnicas** → Carlos Santos *(execução: 90, técnico: 98)*\n3. **Atendimento** → Maria Costa *(comunicação: 95, disponível)*\n4. **Revisões** → Ana Oliveira *(precisão: 96%, carga: 78%)*\n\n⚡ **Evitar alocar para Pedro Lima** até redistribuição atual.',
};

export default function AIChatPanel() {
  const { isChatOpen, setChatOpen } = useApp();
  const { role } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = input.toLowerCase();
      let response = '🤔 Entendi sua pergunta! Baseado nos dados atuais, posso sugerir:\n\n1. Verificar os indicadores no **Dashboard**\n2. Analisar a distribuição de carga na aba **Equipe**\n3. Revisar competências no **Radar**\n\nPode me dar mais detalhes sobre o que precisa?';

      for (const [key, val] of Object.entries(quickResponses)) {
        if (lower.includes(key) || key.split(' ').some((w) => lower.includes(w) && w.length > 4)) {
          response = val;
          break;
        }
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  const suggestions = role === 'manager'
    ? ['Quem está sobrecarregado?', 'Análise da equipe', 'Sugestão de tarefas']
    : ['Como melhorar produtividade?', 'Minhas metas', 'Dicas do dia'];

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 h-screen w-[400px] bg-card border-l border-border z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Assistente IA</h3>
                <p className="text-[10px] text-muted-foreground">Sempre disponível</p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-accent" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'} prose prose-sm prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&_table]:text-xs [&_th]:px-2 [&_td]:px-2`}>
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-accent" />
                </div>
                <div className="bg-muted/50 rounded-xl px-4 py-3 flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="px-4 py-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); }}
                className="text-[11px] px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground/80 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pergunte algo..."
                className="flex-1 bg-muted rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button onClick={handleSend} className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
