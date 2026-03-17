'use client';

import { useState } from 'react';
import { getCachedStage, setCachedStage, getLogoSrc } from '@/utils/logoCache';
import styles from './detail.module.scss';

function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
}

function formatAmount(amount, currency) {
  const num = parseFloat(amount);
  if (isNaN(num) || num === 0) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(num);
}

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

export default function SubscriptionDetail({ subscription, onCancel, onDelete, onClose }) {
  const domain = subscription.service_domain;
  const [logoStage, setLogoStage] = useState(() => getCachedStage(domain));
  const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const logoSrc = getLogoSrc(domain, logoStage);
  const isCancelled = subscription.status === 'cancelled';
  const isExpired = subscription.status === 'expired';
  const isInactive = isCancelled || isExpired;

  const handleImgError = () => {
    setLogoStage((prev) => {
      const next = prev + 1;
      setCachedStage(domain, next);
      return next;
    });
  };

  const handleCancel = async () => {
    if (cancelling || isInactive) return;
    setCancelling(true);
    setActionError(null);
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

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} />

        {/* Hero: icon + name + plan */}
        <div className={styles.hero}>
          <div className={styles.logo}>
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={subscription.service_name}
                width={56}
                height={56}
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
              {category}{category && plan ? ' · ' : ''}{plan}
            </div>
          )}
        </div>

        {/* Info card */}
        <div className={styles.infoCard}>
          <div className={styles.infoRow}>
            <span className={styles.infoIcon}>💳</span>
            <span className={styles.infoText}>{price} per {cycle}</span>
          </div>
          {renewalDate && !isInactive && (
            <div className={styles.infoRow}>
              <span className={styles.infoIcon}>📅</span>
              <span className={styles.infoText}>Renews {renewalDate}</span>
            </div>
          )}
          {isInactive && (
            <div className={styles.infoRow}>
              <span className={styles.infoIcon}>📅</span>
              <span className={`${styles.infoText} ${styles.expiredText}`}>
                {isCancelled ? 'Cancelled' : 'Expired'}
                {subscription.subscription_end_date
                  ? ` · ${formatDate(subscription.subscription_end_date)}`
                  : ''}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {actionError && (
          <div className={styles.actionError}>{actionError}</div>
        )}

        {!isInactive && (
          <button
            className={styles.cancelBtn}
            onClick={handleCancel}
            disabled={cancelling || deleting}
          >
            {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
          </button>
        )}

        {!isInactive && renewalDate && (
          <div className={styles.cancelHint}>
            If you cancel now, you can still access your subscription until {renewalDate}.
          </div>
        )}

        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
          disabled={deleting || cancelling}
        >
          {deleting ? 'Deleting...' : 'Delete Subscription'}
        </button>
      </div>
    </div>
  );
}
