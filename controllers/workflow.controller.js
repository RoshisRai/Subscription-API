import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-reminder-email.js';
// Add isSame for better date comparison
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    
    // Add logging to debug the workflow
    console.log(`Starting reminder workflow for subscription: ${subscriptionId}`);
    
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription) {
        console.log(`Subscription ${subscriptionId} not found. Stopping workflow.`);
        return;
    }

    if (subscription.status !== "active") {
        console.log(`Subscription ${subscriptionId} is not active (status: ${subscription.status}). Stopping workflow.`);
        return;
    }

    const renewalDate = dayjs(subscription.renewalDate);
    const today = dayjs();
    
    console.log(`Renewal date: ${renewalDate.format('YYYY-MM-DD')}, Today: ${today.format('YYYY-MM-DD')}`);
    
    if (renewalDate.isBefore(today, 'day')) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return;
    }

    // Process each reminder day
    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        console.log(`Checking reminder for ${daysBefore} days before: ${reminderDate.format('YYYY-MM-DD')}`);
        
        // If today is the reminder date, trigger the reminder
        if (today.format('YYYY-MM-DD') === reminderDate.format('YYYY-MM-DD')) {
            console.log(`Today matches reminder date. Triggering ${daysBefore} days before reminder`);
            await triggerRemainder(context, `${daysBefore} days before reminder`, subscription);
            continue; // Already triggered, no need to sleep
        }
        
        // If the reminder date is in the future, sleep until then
        if (reminderDate.isAfter(today, 'day')) {
            console.log(`Reminder date is in the future. Sleeping until ${reminderDate.format('YYYY-MM-DD')}`);
            await sleepUntilRemainder(context, `${daysBefore} days before`, reminderDate);
            
            // After waking up, trigger the reminder
            console.log(`Woke up for ${daysBefore} days before reminder`);
            await triggerRemainder(context, `${daysBefore} days before reminder`, subscription);
        } else {
            console.log(`Reminder date ${reminderDate.format('YYYY-MM-DD')} has already passed`);
        }
    }
    
    console.log(`All reminders processed for subscription ${subscriptionId}`);
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        const subscription = await Subscription.findById(subscriptionId).populate('user', 'name email');
        console.log(`Fetched subscription: ${subscription ? 'Found' : 'Not found'}`);
        return subscription;
    });
}

const sleepUntilRemainder = async (context, label, date) => {
    // Ensure we're using start of day to avoid time-of-day issues
    const sleepUntil = date.startOf('day').add(9, 'hour'); // 9:00 AM
    console.log(`Sleeping until ${label} at ${sleepUntil.format('YYYY-MM-DD HH:mm:ss')}`);
    await context.sleepUntil(label, sleepUntil.toDate());
}

const triggerRemainder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering reminder: ${label} for subscription ${subscription._id}`);
        
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        });
        
        console.log(`Email sent to ${subscription.user.email} for ${label}`);
        return true;
    });
}