import { supabase } from './supabaseClient';
import { SupportTicket, SupportPriority, SupportStatus } from '@/types';

export const SupportService = {
    /**
     * Fetch tickets for the current logged-in user.
     */
    async getUserTickets() {
        const { data, error } = await supabase
            .from('support_tickets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as SupportTicket[];
    },

    /**
     * Create a new ticket.
     */
    async createTicket(ticket: {
        category: string;
        subject: string;
        message: string;
        priority: SupportPriority;
        attachment?: File | null;
    }) {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) throw new Error('User not found');

        let attachmentUrl = null;

        // Handle File Upload
        if (ticket.attachment) {
            const fileExt = ticket.attachment.name.split('.').pop();
            const fileName = `${userData.user.id}/${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('support-attachments')
                .upload(fileName, ticket.attachment);

            if (uploadError) throw uploadError;
            attachmentUrl = fileName; // Store path, can sign url later
        }

        const { data, error } = await supabase
            .from('support_tickets')
            .insert({
                user_id: userData.user.id,
                category: ticket.category,
                subject: ticket.subject,
                message: ticket.message,
                priority: ticket.priority,
                status: 'open',
                attachment_url: attachmentUrl,
            })
            .select()
            .single();

        if (error) throw error;
        return data as SupportTicket;
    },

    /**
     * Get a signed URL for the attachment.
     */
    async getAttachmentUrl(path: string) {
        const { data } = await supabase.storage
            .from('support-attachments')
            .createSignedUrl(path, 3600); // 1 hour
        return data?.signedUrl;
    },

    // --- ADMIN METHODS ---

    /**
     * Fetch ALL tickets (Admin only).
     */
    async getAllTickets() {
        const { data, error } = await supabase
            .from('support_tickets')
            .select('*, profiles(email)') // Assuming profiles relation exists, usually inferred if FK matches
            .order('created_at', { ascending: false });

        if (error) throw error;
        // Map profile email if needed, or just return tickets
        return data as (SupportTicket & { profiles?: { email: string } })[];
    },

    /**
     * Update ticket status (Admin only).
     */
    async updateStatus(id: string, status: SupportStatus) {
        const { error } = await supabase
            .from('support_tickets')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Add or update admin note (Admin only).
     */
    async updateAdminNote(id: string, note: string) {
        const { error } = await supabase
            .from('support_tickets')
            .update({ admin_note: note })
            .eq('id', id);

        if (error) throw error;
    }
};
