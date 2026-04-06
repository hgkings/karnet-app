'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MessageCircleQuestion, Send, Loader2, CheckCircle, Clock, Filter } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  creationDate: number;
  status: string;
  productMainId: string;
  answer: { text: string; creationDate: number } | null;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'waiting' | 'answered' | 'all'>('waiting');
  const [answerTexts, setAnswerTexts] = useState<Record<number, string>>({});
  const [answering, setAnswering] = useState<number | null>(null);
  const [totalElements, setTotalElements] = useState(0);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const status = filter === 'waiting' ? 'WAITING_FOR_ANSWER' : filter === 'answered' ? 'ANSWERED' : '';
      const res = await fetch(`/api/marketplace/trendyol/questions?status=${status}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions ?? []);
        setTotalElements(data.totalElements ?? 0);
      }
    } catch {
      toast.error('Sorular yuklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleAnswer = async (questionId: number) => {
    const text = answerTexts[questionId]?.trim();
    if (!text) { toast.error('Yanit bos olamaz.'); return; }

    setAnswering(questionId);
    const t = toast.loading('Yanit gonderiliyor...');
    try {
      const res = await fetch('/api/marketplace/trendyol/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, answer: text }),
      });
      const data = await res.json();
      toast.dismiss(t);
      if (data.success) {
        toast.success('Yanit gonderildi!');
        setAnswerTexts(prev => { const n = { ...prev }; delete n[questionId]; return n; });
        fetchQuestions();
      } else {
        toast.error(data.error || 'Yanit gonderilemedi.');
      }
    } catch {
      toast.dismiss(t);
      toast.error('Baglanti hatasi.');
    } finally {
      setAnswering(null);
    }
  };

  const formatDate = (ts: number) => {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Musteri Sorulari</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Trendyol&apos;daki musteri sorularini buradan yanitlayin. {totalElements > 0 && `(${totalElements} soru)`}
          </p>
        </div>

        {/* Filtre */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {[
            { key: 'waiting' as const, label: 'Cevaplanmamis', icon: Clock },
            { key: 'answered' as const, label: 'Cevaplanmis', icon: CheckCircle },
            { key: 'all' as const, label: 'Tumunu', icon: MessageCircleQuestion },
          ].map(f => (
            <Button
              key={f.key}
              variant={filter === f.key ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setFilter(f.key)}
            >
              <f.icon className="h-3 w-3 mr-1" />
              {f.label}
            </Button>
          ))}
        </div>

        {/* Liste */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <MessageCircleQuestion className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              {filter === 'waiting' ? 'Cevaplanmamis soru yok' : 'Soru bulunamadi'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map(q => (
              <div key={q.id} className="rounded-xl border border-border/40 bg-card p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {q.status === 'WAITING_FOR_ANSWER' ? (
                        <Clock className="h-4 w-4 text-orange-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      )}
                      <span className="text-xs text-muted-foreground">{formatDate(q.creationDate)}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">#{q.productMainId}</span>
                </div>

                <p className="text-sm text-foreground">{q.text}</p>

                {q.answer ? (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mb-1">Yanitiniz:</p>
                    <p className="text-sm text-foreground">{q.answer.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{formatDate(q.answer.creationDate)}</p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Yanitinizi yazin..."
                      className="min-h-[60px] text-sm"
                      value={answerTexts[q.id] ?? ''}
                      onChange={e => setAnswerTexts(prev => ({ ...prev, [q.id]: e.target.value }))}
                    />
                    <Button
                      size="sm"
                      className="h-auto px-4 self-end"
                      disabled={answering !== null || !answerTexts[q.id]?.trim()}
                      onClick={() => handleAnswer(q.id)}
                    >
                      {answering === q.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
