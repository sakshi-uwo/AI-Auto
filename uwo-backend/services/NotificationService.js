import Notification from '../models/Notification.js';
import NotificationSetting from '../models/NotificationSettings.js';
import User from '../models/User.js';
import emailService from '../utils/emailService.js';

/**
 * AI_AUTO Notification Service: Production Grade
 * Handles event-driven notification dispatching based on roles and preferences.
 */
class NotificationService {
    constructor() {
        this.io = null;
    }

    /**
     * Set the Socket.io instance
     * @param {Object} io 
     */
    setIo(io) {
        this.io = io;
    }

    /**
     * Mapping of events to roles that should be notified by default
     */
    EVENT_ROLE_MAP = {
        'hazard': ['admin', 'civil_engineer', 'safety_officer', 'builder'],
        'task_assigned': ['admin', 'project_site', 'civil_engineer', 'builder'],
        'task_updated': ['project_site', 'admin', 'builder', 'civil_engineer'],
        'site_log': ['admin', 'civil_engineer', 'builder'],
        'attendance': ['project_site', 'admin', 'builder'],
        'design_approval': ['admin', 'client', 'civil_engineer', 'builder'],
        'design_rejected': ['admin', 'client', 'civil_engineer', 'builder'],
        'budget_exceeded': ['client', 'admin', 'builder'],
        'milestone': ['client', 'admin', 'project_site', 'civil_engineer', 'builder'],
        'schedule_delay': ['client', 'admin', 'civil_engineer', 'builder'],
        'system': ['admin', 'builder', 'civil_engineer', 'client'],
        'user_created': ['admin', 'builder', 'civil_engineer', 'project_site']
    };

    /**
     * Trigger a notification event
     * @param {string} eventType - The type of event (e.g., 'hazard', 'milestone')
     * @param {Object} data - Contextual data (e.g., projectID, taskID, message override)
     */
    async triggerNotification(eventType, data) {
        try {
            console.log(`🔔 Notification Triggered: "${eventType}" (length: ${eventType.length})`);

            const rolesToNotify = this.EVENT_ROLE_MAP[eventType] || [];
            console.log(`👥 Roles to notify for "${eventType}": ${rolesToNotify.join(', ')}`);
            if (rolesToNotify.length === 0) {
                console.log(`⚠️ No roles found for event type: "${eventType}"`);
                return;
            }

            // Find all users with the relevant roles
            // We use a simpler case-insensitive match and remove status filter for diagnostic purposes
            const users = await User.find({
                role: {
                    $in: rolesToNotify.map(r => new RegExp(`^${r}$`, 'i'))
                }
            });

            if (users.length === 0) {
                console.log(`⚠️ No users found matching roles: ${rolesToNotify.join(', ')} for event: ${eventType}`);
                return;
            }

            console.log(`✅ Found ${users.length} users to notify: ${users.map(u => u.email).join(', ')}`);

            await this._processNotifications(users, eventType, data);
        } catch (err) {
            console.log(`❌ Notification Service Error: ${err.message}`);
        }
    }

    /**
     * Broadcast a notification to ALL active users
     */
    async broadcastNotification(data) {
        try {
            console.log(`📢 Broadcasting Notification: ${data.title}`);
            const users = await User.find({ status: 'Active' });
            await this._processNotifications(users, 'system', data);
        } catch (err) {
            console.log(`❌ Broadcast Error: ${err.message}`);
        }
    }

    async _processNotifications(users, eventType, data) {
        console.log(`📡 Processing notifications for ${users.length} users...`);
        for (const user of users) {
            // Check user preferences
            let setting = await NotificationSetting.findOne({ user: user._id });

            if (!setting) {
                console.log(`🛠️ Creating default settings for user: ${user.email}`);
                setting = await NotificationSetting.create({
                    user: user._id,
                    preferences: Object.keys(this.EVENT_ROLE_MAP).map(type => ({
                        eventType: type,
                        inApp: true,
                        email: true
                    }))
                });
            }

            const pref = setting.preferences.find(p => p.eventType === eventType);
            console.log(`👤 User: ${user.email} | Prefs for ${eventType}: ${pref ? JSON.stringify(pref) : 'NOT FOUND'}`);
            if (pref && !pref.inApp && !pref.email) {
                console.log(`🚫 User ${user.email} has both inApp and email disabled for ${eventType}`);
                continue;
            }

            const notificationPayload = {
                title: data.title || this._formatTitle(eventType),
                message: data.message || `An alert of type ${eventType} has occurred in the system.`,
                priority: data.priority || this._getPriority(eventType),
                metadata: data.metadata || {}
            };

            // Dispatch to all enabled channels in parallel
            const dispatchResults = await Promise.allSettled([
                this._dispatchInApp(user, eventType, notificationPayload, pref),
                this._dispatchEmail(user, eventType, notificationPayload, pref)
            ]);

            // Log or handle individual channel failures if needed
            const failedChannels = dispatchResults.filter(r => r.status === 'rejected');
            if (failedChannels.length > 0) {
                console.log(`[WARN] Some channels failed for user ${user.email}: ${failedChannels.map(f => f.reason).join(', ')}`);
            }
        }
    }

    async _dispatchInApp(user, eventType, payload, pref) {
        if (pref && !pref.inApp) {
            console.log(`📉 In-app notification disabled for user ${user.email}`);
            return null;
        }

        const notification = new Notification({
            recipient: user._id,
            ...payload,
            type: eventType,
            channelsSent: ['inApp']
        });

        await notification.save();
        console.log(`💾 Notification saved to DB for user ${user.email}: ${notification._id}`);

        if (this.io) {
            const room = user._id.toString();
            console.log(`📤 Emitting 'notification' to room: ${room}`);
            this.io.to(room).emit('notification', notification);
        } else {
            console.log(`⚠️ No socket.io instance found in NotificationService!`);
        }
        return 'inApp';
    }

    async _dispatchEmail(user, eventType, payload, pref) {
        if (!pref || !pref.email || !user.email) return null;

        const result = await emailService.sendEmail(
            user.email,
            `AI_AUTO ALERT: ${payload.title}`,
            payload.message,
            `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #0047AB;">${payload.title}</h2>
                <p>${payload.message}</p>
                <hr />
                <small style="color: #666;">Priority: ${payload.priority.toUpperCase()} | Type: ${eventType}</small>
            </div>`
        );

        if (result.success) {
            await Notification.findOneAndUpdate(
                { recipient: user._id, type: eventType },
                { $addToSet: { channelsSent: 'email' } },
                { sort: { createdAt: -1 } }
            );
        }
        return 'email';
    }

    _formatTitle(eventType) {
        return eventType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    _getPriority(eventType) {
        const urgentEvents = ['hazard', 'budget_exceeded', 'schedule_delay'];
        return urgentEvents.includes(eventType) ? 'high' : 'medium';
    }
}

export default new NotificationService();
