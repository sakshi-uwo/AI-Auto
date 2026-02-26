import { Resend } from 'resend';

/**
 * Production-ready email service using Resend API
 */
class EmailService {
    constructor() {
        this.client = null;
    }

    /**
     * Get or initialize the Resend client
     * @returns {Resend|null}
     */
    getClient() {
        if (this.client) return this.client;

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.warn('[EMAIL] WARNING: RESEND_API_KEY is missing. Email functionality will be disabled.');
            return null;
        }

        try {
            this.client = new Resend(apiKey);
            return this.client;
        } catch (error) {
            console.error('[EMAIL] Failed to initialize Resend client:', error.message);
            return null;
        }
    }

    /**
     * Send an email
     * @param {string} to - Recipient email
     * @param {string} subject - Email subject
     * @param {string} text - Plain text body
     * @param {string} html - HTML body (optional)
     */
    async sendEmail(to, subject, text, html) {
        try {
            const resend = this.getClient();
            if (!resend) {
                console.error(`[EMAIL] Cannot send email to ${to}: Resend client not initialized (missing API key)`);
                return { success: false, error: 'Email service not configured' };
            }

            // Note: In free tier, you can only send to your own email unless you verify a domain.
            const fromAddress = process.env.EMAIL || 'onboarding@resend.dev';

            const { data, error } = await resend.emails.send({
                from: `AI_AUTO <${fromAddress.trim()}>`,
                to: [to],
                subject,
                text,
                html
            });

            if (error) {
                console.error(`[EMAIL] Resend Error for ${to}:`, error.message);
                return { success: false, error: error.message };
            }

            console.log(`[EMAIL] Message queued via Resend: ${data.id}`);
            return { success: true, messageId: data.id };
        } catch (error) {
            console.error(`[EMAIL] Critical failure sending to ${to}:`, error.message);
            return { success: false, error: error.message };
        }
    }
}

export default new EmailService();