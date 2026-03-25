import { supabase } from '@/integrations/supabase/client';

interface QueuedOperation {
  operation_type: 'insert' | 'update' | 'delete';
  table_name: string;
  operation_data: any;
}

class OfflineQueue {
  private queue: QueuedOperation[] = [];
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.initializeOnlineDetection();
    this.loadQueueFromLocalStorage();
  }

  private initializeOnlineDetection() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private loadQueueFromLocalStorage() {
    const stored = localStorage.getItem('offlineQueue');
    if (stored) {
      try {
        this.queue = JSON.parse(stored);
      } catch (error) {
        console.error('Error loading offline queue:', error);
      }
    }
  }

  private saveQueueToLocalStorage() {
    localStorage.setItem('offlineQueue', JSON.stringify(this.queue));
  }

  async addOperation(operation: QueuedOperation) {
    this.queue.push(operation);
    this.saveQueueToLocalStorage();

    if (this.isOnline) {
      await this.syncQueue();
    }
  }

  async syncQueue() {
    if (!this.isOnline || this.queue.length === 0) return;

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const operations = [...this.queue];
    this.queue = [];
    this.saveQueueToLocalStorage();

    for (const operation of operations) {
      try {
        const { error } = await supabase.from('offline_queue').insert({
          user_id: user.id,
          operation_type: operation.operation_type,
          table_name: operation.table_name,
          operation_data: operation.operation_data,
        });

        if (error) throw error;

        if (operation.operation_type === 'insert') {
          await supabase.from(operation.table_name).insert(operation.operation_data);
        } else if (operation.operation_type === 'update') {
          const { id, ...data } = operation.operation_data;
          await supabase.from(operation.table_name).update(data).eq('id', id);
        } else if (operation.operation_type === 'delete') {
          await supabase.from(operation.table_name).delete().eq('id', operation.operation_data.id);
        }

        await supabase.from('offline_queue').update({ status: 'synced', synced_at: new Date().toISOString() }).eq('user_id', user.id).eq('status', 'pending');
      } catch (error) {
        this.queue.push(operation);
        this.saveQueueToLocalStorage();
        console.error('Error syncing operation:', error);
      }
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
