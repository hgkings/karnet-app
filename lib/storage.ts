import { Analysis, RiskLevel } from '@/types';
import { supabase } from './supabaseClient';

interface AnalysisRow {
  id: string;
  user_id: string;
  marketplace: string;
  product_name: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  risk_score: number;
  risk_level: string;
  created_at: string;
}

function rowToAnalysis(row: AnalysisRow): Analysis {
  const outputs = row.outputs as Record<string, unknown>;
  const riskFactors = Array.isArray(outputs._risk_factors) ? outputs._risk_factors : [];

  return {
    id: row.id,
    userId: row.user_id,
    input: row.inputs as unknown as Analysis['input'],
    result: row.outputs as unknown as Analysis['result'],
    risk: {
      score: row.risk_score,
      level: row.risk_level as RiskLevel,
      factors: riskFactors,
    },
    createdAt: row.created_at,
  };
}

export async function getStoredAnalyses(userId: string): Promise<Analysis[]> {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(rowToAnalysis);
}

export async function getAnalysisById(id: string): Promise<Analysis | null> {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToAnalysis(data);
}

export async function saveAnalysis(analysis: Analysis): Promise<void> {
  const outputsWithRisk = {
    ...analysis.result,
    _risk_factors: analysis.risk.factors,
  };

  const row = {
    id: analysis.id,
    user_id: analysis.userId,
    marketplace: analysis.input.marketplace,
    product_name: analysis.input.product_name,
    inputs: analysis.input as unknown as Record<string, unknown>,
    outputs: outputsWithRisk as unknown as Record<string, unknown>,
    risk_score: analysis.risk.score,
    risk_level: analysis.risk.level,
  };

  const { error } = await supabase.from('analyses').upsert(row, { onConflict: 'id' });
  if (error) console.error('saveAnalysis error:', error);
}

export async function deleteAnalysis(id: string): Promise<void> {
  const { error } = await supabase.from('analyses').delete().eq('id', id);
  if (error) console.error('deleteAnalysis error:', error);
}

export async function getUserAnalysisCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('analyses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) return 0;
  return count || 0;
}

export function generateId(): string {
  if (typeof window !== 'undefined' && crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
