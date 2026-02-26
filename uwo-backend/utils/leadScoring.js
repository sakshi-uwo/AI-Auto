/**
 * Lead Scoring Engine
 * Industry-grade HubSpot-style scoring and temperature classification.
 */

const SCORING_CONSTANTS = {
    // BEHAVIORAL (High Weight)
    DEMO_REQUESTED: 30,
    CONTACT_FORM: 20,
    BOOKED_MEETING: 40,
    CONTACTED_SALES: 30,
    PRICING_PAGE_VISIT: 10, // Per visit
    WEBSITE_VISIT: 2,       // Per visit
    EMAIL_OPEN: 3,          // Per open
    LINK_CLICK: 5,          // Per click

    // PROFILE FIT
    INDUSTRY_MATCH: 15,
    COMPANY_SIZE_MATCH: 10,
    VERIFIED_EMAIL: 10,
    VERIFIED_PHONE: 10,

    // NEGATIVE SIGNALS
    UNSUBSCRIBED: -50,

    // THRESHOLDS
    HOT_THRESHOLD: 70,
    WARM_THRESHOLD: 40
};

/**
 * Applies time-decay to a lead's score if they've been inactive.
 * - Reduces score by 25% after 30 days of inactivity.
 * - Reduces score by 50% after 60 days of inactivity.
 * - Decays to 0 after 90 days.
 */
const applyTimeDecay = (score, lastEngagementAt) => {
    if (!lastEngagementAt) return score;

    const daysInactive = (Date.now() - new Date(lastEngagementAt).getTime()) / (1000 * 60 * 60 * 24);

    if (daysInactive >= 90) return 0;
    if (daysInactive >= 60) return Math.floor(score * 0.5);
    if (daysInactive >= 30) return Math.floor(score * 0.75);

    return score;
};

/**
 * Recomputes the entire lead score and temperature based on current signals.
 * @param {Object} lead - Mongoose Lead document
 * @returns {Object} { score, temperature }
 */
export const calculateLeadScore = (lead) => {
    // 1. Skip simulated leads entirely
    if (lead.isSimulated) {
        return { score: 0, temperature: 'Cold' };
    }

    let score = 0;
    const signals = lead.engagementSignals || {};

    // 2. Tally Behavioral Points
    if (signals.demoRequested) score += SCORING_CONSTANTS.DEMO_REQUESTED;
    if (signals.contactFormSubmitted) score += SCORING_CONSTANTS.CONTACT_FORM;
    if (signals.bookedMeeting) score += SCORING_CONSTANTS.BOOKED_MEETING;
    if (signals.contactedSales) score += SCORING_CONSTANTS.CONTACTED_SALES;

    score += (signals.pricingPageVisits || 0) * SCORING_CONSTANTS.PRICING_PAGE_VISIT;
    score += (signals.websiteVisits || 0) * SCORING_CONSTANTS.WEBSITE_VISIT;
    score += (signals.emailOpens || 0) * SCORING_CONSTANTS.EMAIL_OPEN;
    score += (signals.linkClicks || 0) * SCORING_CONSTANTS.LINK_CLICK;

    // 3. Tally Profile Fit Points
    if (signals.industryMatch) score += SCORING_CONSTANTS.INDUSTRY_MATCH;
    if (signals.companySizeMatch) score += SCORING_CONSTANTS.COMPANY_SIZE_MATCH;
    if (signals.verifiedEmail) score += SCORING_CONSTANTS.VERIFIED_EMAIL;
    if (signals.verifiedPhone) score += SCORING_CONSTANTS.VERIFIED_PHONE;

    // 4. Apply Negative Signals
    if (signals.unsubscribed) score += SCORING_CONSTANTS.UNSUBSCRIBED;

    // 5. Apply Time Decay
    score = applyTimeDecay(score, lead.lastEngagementAt);

    // Prevent negative overall scores unless they really dive
    score = Math.max(0, score);

    // 6. Determine Temperature & Check Overrides
    // Auto mark as HOT overrides:
    let temperature = 'Cold';

    if (signals.demoRequested || signals.bookedMeeting || signals.contactedSales) {
        temperature = 'Hot';
        // Bump score visibly if override triggers but actual score is low for some reason
        if (score < SCORING_CONSTANTS.HOT_THRESHOLD) {
            score = SCORING_CONSTANTS.HOT_THRESHOLD;
        }
    } else if (score >= SCORING_CONSTANTS.HOT_THRESHOLD) {
        temperature = 'Hot';
    } else if (score >= SCORING_CONSTANTS.WARM_THRESHOLD) {
        temperature = 'Warm';
    }

    return { score, temperature };
};
