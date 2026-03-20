'use client';

import { useState, useEffect, useRef } from 'react';
import { getCachedStage, setCachedStage, getLogoSrc } from '@/utils/logoCache';
import { formatAmount, formatDate } from '@/utils/format';
import styles from './detail.module.scss';

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

function getPlatformLabel(platform) {
  switch (platform) {
    case 'app_store': return 'App Store';
    case 'play_store': return 'Google Play';
    case 'web': return 'Website';
    default: return null;
  }
}

// Deep links for mobile stores
const STORE_LINKS = {
  app_store: 'https://apps.apple.com/account/subscriptions',
  play_store: 'https://play.google.com/store/account/subscriptions',
};

/**
 * Determine cancel strategy:
 * - app_store / play_store → redirect to store deep link
 * - web + cancel_url → redirect to cancel page
 * - web + cancel_instructions (no url) → show instructions
 * - web (no url, no instructions) → show "unsupported" screen
 * - manual / unknown → show "unsupported" screen
 */
function getCancelStrategy(subscription) {
  const { platform, cancel_url, cancel_instructions, source } = subscription;

  if (platform === 'app_store' || platform === 'play_store') {
    return {
      type: 'store_redirect',
      url: cancel_url || STORE_LINKS[platform],
      label: platform === 'app_store' ? 'App Store' : 'Google Play',
    };
  }

  if (platform === 'web') {
    if (cancel_url) {
      return {
        type: 'web_redirect',
        url: cancel_url,
        instructions: cancel_instructions,
        label: 'Website',
      };
    }
    if (cancel_instructions) {
      return { type: 'instructions_only', instructions: cancel_instructions };
    }
    return { type: 'unsupported' };
  }

  // manual / unknown platform
  return { type: 'unsupported' };
}

export default function SubscriptionDetail({ subscription, onCancel, onDelete, onClose }) {
  const domain = subscription.service_domain;
  const [logoStage, setLogoStage] = useState(() => getCachedStage(domain));
  const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);
  // 'idle' | 'waiting' | 'confirm' | 'unsupported' | 'instructions'
  const [cancelView, setCancelView] = useState('idle');
  const openedAtRef = useRef(null);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState(subscription.service_name || '');
  const [editAmount, setEditAmount] = useState(subscription.amount || '');
  const [editCycle, setEditCycle] = useState(subscription.billing_cycle || 'monthly');
  const [editStatus, setEditStatus] = useState(subscription.status || 'active');
  const [editRenewalDate, setEditRenewalDate] = useState(
    subscription.next_renewal_date ? subscription.next_renewal_date.slice(0, 10) : ''
  );

  const handleSave = async () => {
    setSaving(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_name: editName,
          amount: parseFloat(editAmount),
          billing_cycle: editCycle,
          status: editStatus,
          next_renewal_date: editRenewalDate || null,
        }),
      });
      if (!res.ok) throw new Error('Update failed');
      setEditing(false);
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
      setActionError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const logoSrc = getLogoSrc(domain, logoStage);
  const isCancelled = subscription.status === 'cancelled';
  const isExpired = subscription.status === 'expired';
  const isInactive = isCancelled || isExpired;

  const strategy = getCancelStrategy(subscription);
  const platformLabel = getPlatformLabel(subscription.platform);

  const handleImgError = () => {
    setLogoStage((prev) => {
      const next = prev + 1;
      setCachedStage(domain, next);
      return next;
    });
  };

  // When user returns from external page, show confirmation
  useEffect(() => {
    if (cancelView !== 'waiting') return;

    const showConfirm = () => {
      if (openedAtRef.current && Date.now() - openedAtRef.current > 2000) {
        setCancelView('confirm');
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') showConfirm();
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', showConfirm);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', showConfirm);
    };
  }, [cancelView]);

  const handleCancelStart = () => {
    if (cancelling || isInactive) return;
    setActionError(null);

    if (strategy.type === 'store_redirect' || strategy.type === 'web_redirect') {
      openedAtRef.current = Date.now();
      setCancelView('waiting');
      window.open(strategy.url, '_blank');
    } else if (strategy.type === 'instructions_only') {
      setCancelView('instructions');
    } else {
      // unsupported
      setCancelView('unsupported');
    }
  };

  const handleConfirmYes = async () => {
    setCancelling(true);
    setActionError(null);
    setCancelView('idle');
    try {
      await onCancel(subscription.id);
      onClose();
    } catch (err) {
      console.error('Cancel failed:', err);
      setActionError('Failed to cancel. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const handleConfirmNo = () => {
    setCancelView('idle');
    openedAtRef.current = null;
  };

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    setActionError(null);
    try {
      await onDelete(subscription.id);
      onClose();
    } catch (err) {
      console.error('Delete failed:', err);
      setActionError('Failed to delete. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const plan = subscription.subscription_plan && subscription.subscription_plan !== 'Not specified'
    ? subscription.subscription_plan
    : null;
  const category = subscription.category && subscription.category !== 'Not specified'
    ? subscription.category
    : null;
  const renewalDate = formatDate(subscription.next_renewal_date);
  const price = formatAmount(subscription.amount, subscription.currency);
  const cycle = subscription.billing_cycle;

  // Cancel button label
  const cancelBtnLabel = cancelling ? 'Cancelling...' : 'Cancel';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} />

        {/* Edit button */}
        {!editing && (
          <button
            className={styles.editBtn}
            onClick={() => setEditing(true)}
            aria-label="Edit subscription"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" stroke="var(--system-blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.logo}>
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={subscription.service_name}
                width={60}
                height={60}
                onError={handleImgError}
              />
            ) : (
              <div className={styles.fallback}>
                {getInitial(subscription.service_name)}
              </div>
            )}
          </div>
          <div className={styles.serviceName}>{subscription.service_name}</div>
          {(category || plan) && (
            <div className={styles.plan}>
              {category}{category && plan ? ' \u00b7 ' : ''}{plan}
            </div>
          )}
        </div>

        {/* Info card / Edit form */}
        {editing ? (
          <div className={styles.editForm}>
            <div className={styles.editField}>
              <label className={styles.editLabel}>Name</label>
              <input
                className={styles.editInput}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className={styles.editField}>
              <label className={styles.editLabel}>Price</label>
              <input
                className={styles.editInput}
                type="number"
                step="0.01"
                min="0"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
              />
            </div>
            <div className={styles.editField}>
              <label className={styles.editLabel}>Period</label>
              <select
                className={styles.editSelect}
                value={editCycle}
                onChange={(e) => setEditCycle(e.target.value)}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className={styles.editField}>
              <label className={styles.editLabel}>Status</label>
              <select
                className={styles.editSelect}
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className={styles.editField}>
              <label className={styles.editLabel}>Next Renewal</label>
              <input
                className={styles.editInput}
                type="date"
                value={editRenewalDate}
                onChange={(e) => setEditRenewalDate(e.target.value)}
              />
            </div>
            <div className={styles.editActions}>
              <button className={styles.confirmYes} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button className={styles.confirmNo} onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Price</span>
              <span className={styles.infoValue}>{price} / {cycle}</span>
            </div>
            {renewalDate && !isInactive && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Renewal</span>
                <span className={styles.infoValue}>{renewalDate}</span>
              </div>
            )}
            {platformLabel && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Managed by</span>
                <span className={styles.infoValue}>{platformLabel}</span>
              </div>
            )}
            {isInactive && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Status</span>
                <span className={`${styles.infoValue} ${styles.expiredText}`}>
                  {isCancelled ? 'Cancelled' : 'Expired'}
                  {subscription.subscription_end_date
                    ? ` \u00b7 ${formatDate(subscription.subscription_end_date)}`
                    : ''}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {actionError && (
          <div className={styles.actionError}>{actionError}</div>
        )}

        {/* ── Cancel views ── */}

        {/* CONFIRM: user returned from external page */}
        {cancelView === 'confirm' && (
          <div className={styles.confirmCard}>
            <div className={styles.confirmTitle}>Did you cancel the subscription?</div>
            <div className={styles.confirmActions}>
              <button className={styles.confirmYes} onClick={handleConfirmYes} disabled={cancelling}>
                {cancelling ? 'Confirming...' : 'Yes, I cancelled'}
              </button>
              <button className={styles.confirmNo} onClick={handleConfirmNo}>
                No, not yet
              </button>
            </div>
          </div>
        )}

        {/* WAITING: user is on external page */}
        {cancelView === 'waiting' && (
          <div className={styles.waitingHint}>
            Cancel your subscription
            {strategy.label ? ` in ${strategy.label}` : ''}, then come back here.
          </div>
        )}

        {/* INSTRUCTIONS: web subscription with step-by-step guide */}
        {cancelView === 'instructions' && (
          <div className={styles.instructionsCard}>
            <div className={styles.instructionsTitle}>How to cancel {subscription.service_name}</div>
            <div className={styles.instructionsBody}>
              {(strategy.instructions || subscription.cancel_instructions || '')
                .split('\n')
                .map((line, i) => (
                  <div key={i} className={styles.instructionStep}>{line}</div>
                ))}
            </div>
            <div className={styles.instructionsActions}>
              <button className={styles.confirmYes} onClick={handleConfirmYes} disabled={cancelling}>
                {cancelling ? 'Confirming...' : 'I cancelled it'}
              </button>
              <button className={styles.confirmNo} onClick={handleConfirmNo}>
                Go back
              </button>
            </div>
          </div>
        )}

        {/* UNSUPPORTED: manual or unknown source */}
        {cancelView === 'unsupported' && (
          <div className={styles.unsupportedCard}>
            <div className={styles.unsupportedIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#8E8E93" strokeWidth="1.5"/>
                <path d="M12 8V12M12 16H12.01" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={styles.unsupportedTitle}>Automatic cancellation isn't available yet</div>
            <div className={styles.unsupportedBody}>
              We're working on adding this feature. In the meantime, here's how you can cancel manually:
            </div>
            <div className={styles.unsupportedSteps}>
              <div className={styles.instructionStep}>1. Open the app or website where you subscribed</div>
              <div className={styles.instructionStep}>2. Go to your account or subscription settings</div>
              <div className={styles.instructionStep}>3. Find {subscription.service_name} and select Cancel</div>
              <div className={styles.instructionStep}>4. Follow the prompts to confirm</div>
            </div>
            <div className={styles.instructionsActions}>
              <button className={styles.confirmYes} onClick={handleConfirmYes} disabled={cancelling}>
                {cancelling ? 'Confirming...' : 'I cancelled it'}
              </button>
              <button className={styles.confirmNo} onClick={handleConfirmNo}>
                Go back
              </button>
            </div>
          </div>
        )}

        {/* Default actions */}
        {cancelView === 'idle' && !isInactive && (
          <button
            className={styles.cancelBtn}
            onClick={handleCancelStart}
            disabled={cancelling || deleting}
          >
            {cancelBtnLabel}
          </button>
        )}

        {cancelView === 'idle' && !isInactive && renewalDate && (
          <div className={styles.cancelHint}>
            {strategy.type === 'store_redirect'
              ? `You'll be redirected to ${strategy.label} to manage your subscription.`
              : strategy.type === 'web_redirect'
                ? `You'll be redirected to the service website to cancel.`
                : `If you cancel now, you can still use it until ${renewalDate}.`}
          </div>
        )}

        {cancelView === 'idle' && (
          <button
            className={styles.deleteBtn}
            onClick={handleDelete}
            disabled={deleting || cancelling}
          >
            {deleting ? 'Deleting...' : 'Delete Subscription'}
          </button>
        )}
      </div>
    </div>
  );
}
