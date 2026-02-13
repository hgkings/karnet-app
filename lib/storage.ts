import { Analysis } from '@/types';
import { supabase } from './supabase';

export async function getStoredAnalyses(userId: string): Promise<Analysis[]> {
  try {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching analyses:', error);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      input: row.inputs,
      result: row.outputs,
      risk: {
        score: row.risk_score,
        level: row.risk_level as any,
        factors: row.inputs.risk_factors || [],
      },
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error('Error in getStoredAnalyses:', err);
    return [];
  }
}

export async function getAnalysisById(id: string): Promise<Analysis | null> {
  try {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      input: data.inputs,
      result: data.outputs,
      risk: {
        score: data.risk_score,
        level: data.risk_level as any,
        factors: data.inputs.risk_factors || [],
      },
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error('Error in getAnalysisById:', err);
    return null;
  }
}

export async function saveAnalysis(analysis: Analysis): Promise<void> {
  try {
    const { data: existingData } = await supabase
      .from('analyses')
      .select('id')
      .eq('id', analysis.id)
      .maybeSingle();

    const analysisData = {
      id: analysis.id,
      user_id: analysis.userId,
      marketplace: analysis.input.marketplace,
      product_name: analysis.input.product_name,
      inputs: analysis.input,
      outputs: analysis.result,
      risk_score: analysis.risk.score,
      risk_level: analysis.risk.level,
    };

    if (existingData) {
      await supabase
        .from('analyses')
        .update(analysisData)
        .eq('id', analysis.id);
    } else {
      await supabase
        .from('analyses')
        .insert(analysisData);
    }
  } catch (err) {
    console.error('Error in saveAnalysis:', err);
  }
}

export async function deleteAnalysis(id: string): Promise<void> {
  try {
    await supabase
      .from('analyses')
      .delete()
      .eq('id', id);
  } catch (err) {
    console.error('Error in deleteAnalysis:', err);
  }
}

export async function getUserAnalysisCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Error counting analyses:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('Error in getUserAnalysisCount:', err);
    return 0;
  }
}

export function generateId(): string {
  if (typeof window !== 'undefined' && crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
