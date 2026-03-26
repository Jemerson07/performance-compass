import { supabase } from '@/integrations/supabase/client';

interface QueuedOperation {
  id: string;
  operation_type: 'insert' | 'update' | 'delete';
  table_name: string;
  operation_data: any;
  retries: number;
}

const MAX_RETRIES = 3;
const STORAGE_KEY = 'performance-ai-offline-queue';

class OfflineQueue {
  private queue: QueuedOperation[] = [];
  private isOnline: boolean = true;
  private initialized: boolean = false;

  initialize() {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    this.isOnline = navigator.onLine;
    this.loadQueueFromLocalStorage();

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncQueue().catch(console.error);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private loadQueueFromLocalStorage() {
    if (typeof localStorage === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.queue = (Array.isArray(parsed) ? parsed : []).map((op: any) => ({
          id: op.id ?? crypto.randomUUID(),
          operation_type: op.operation_type,
          table_name: op.table_name,
          operation_data: op.operation_data,
          retries: op.retries ?? 0,
        }));
      }
    } catch (error) {
      console.error('[OfflineQueue] Erro ao carregar fila do localStorage:', error);
      this.queue = [];
    }
  }

  private saveQueueToLocalStorage() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('[OfflineQueue] Erro ao salvar fila no localStorage:', error);
    }
  }

  async addOperation(operation: Omit<QueuedOperation, 'id' | 'retries'>) {
    const op: QueuedOperation = {
      ...operation,
      id: crypto.randomUUID(),
      retries: 0,
    };

    this.queue.push(op);
    this.saveQueueToLocalStorage();

    if (this.isOnline) {
      await this.syncQueue();
    }
  }

  async syncQueue() {
    if (!this.isOnline || this.queue.length === 0) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const operations = [...this.queue];
    this.queue = [];
    this.saveQueueToLocalStorage();

    const failedOperations: QueuedOperation[] = [];

    for (const operation of operations) {
      try {
        let operationError: any = null;

        if (operation.operation_type === 'insert') {
          const { error } = await supabase.from(operation.table_name as any).insert(operation.operation_data);
          operationError = error;
        } else if (operation.operation_type === 'update') {
          const { id, ...data } = operation.operation_data;
          const { error } = await supabase.from(operation.table_name as any).update(data).eq('id', id);
          operationError = error;
        } else if (operation.operation_type === 'delete') {
          const { error } = await supabase.from(operation.table_name as any).delete().eq('id', operation.operation_data.id);
          operationError = error;
        }

        if (operationError) throw operationError;

      } catch (error) {
        console.error(`[OfflineQueue] Erro ao sincronizar operação ${operation.id}:`, error);

        const updatedOp = { ...operation, retries: (operation.retries ?? 0) + 1 };
        if (updatedOp.retries < MAX_RETRIES) {
          failedOperations.push(updatedOp);
        } else {
          console.warn(`[OfflineQueue] Operação ${operation.id} descartada após ${MAX_RETRIES} tentativas.`);
        }
      }
    }

    if (failedOperations.length > 0) {
      this.queue = [...this.queue, ...failedOperations];
      this.saveQueueToLocalStorage();
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  isOffline(): boolean {
    return !this.isOnline;
  }
}

export const offlineQueue = new OfflineQueue();
