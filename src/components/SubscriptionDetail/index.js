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
    year: 'numeric',
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

function getStatusClass(status) {
  if (status === 'cancelled') return styles.cancelled;
  if (status === 'expired') return styles.expired;
  return styles.active;
}

export default function SubscriptionDetail({ subscription, onCancel, onDelete, onClose }) {
  const domain = subscription.service_domain;
  const [logoStage, setLogoStage] = useState(() => getCachedStage(domain));
  const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const logoSrc = getLogoSrc(domain, logoStage);
  const isCancelled = subscription.status === 'cancelled';

  const handleImgError = () => {
    setLogoStage((prev) => {
      const next = prev + 1;
      setCachedStage(domain, next);
      return next;
    });
  };

  const handleCancel = async () => {
    if (cancelling || isCancelled) return;
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

  const details = [
    { label: 'Billing Cycle', value: subscription.billing_cycle },
    { label: 'Next Renewal', value: formatDate(subscription.next_renewal_date) },
    { label: 'Payment Date', value: formatDate(subscription.payment_date) },
    { label: 'Start Date', value: formatDate(subscription.subscription_start_date) },
    { label: 'End Date', value: formatDate(subscription.subscription_end_date) },
    { label: 'Category', value: subscription.category },
    { label: 'Transaction Type', value: subscription.transaction_type },
    { label: 'Source', value: subscription.source },
    { label: 'Domain', value: subscription.service_domain },
  ].filter((d) => d.value && d.value !== 'Not specified');

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} />

        <div className={styles.header}>
          <div className={styles.logo}>
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={subscription.service_name}
                width={52}
                height={52}
                onError={handleImgError}
              />
            ) : (
              <div className={styles.fallback}>
                {getInitial(subscription.service_name)}
              </div>
            )}
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.serviceName}>{subscription.service_name}</div>
            {subscription.subscription_plan && subscription.subscription_plan !== 'Not specified' && (
              <div className={styles.plan}>{subscription.subscription_plan}</div>
            )}
          </div>
          <span className={`${styles.statusBadge} ${getStatusClass(subscription.status)}`}>
            {subscription.status}
          </span>
        </div>

        <div className={styles.amountSection}>
          <div>
            <div className={styles.amountValue}>
              {formatAmount(subscription.amount, subscription.currency)}
            </div>
            <div className={styles.amountCycle}>per {subscription.billing_cycle}</div>
          </div>
          <div className={styles.amountCurrency}>
            {subscription.currency || 'USD'}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Details</div>
          <div className={styles.rows}>
            {details.map((d) => (
              <div key={d.label} className={styles.row}>
                <span className={styles.rowLabel}>{d.label}</span>
                <span className={styles.rowValue}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {subscription.additional_info && subscription.additional_info !== 'Not specified' && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Additional Info</div>
            <div className={styles.additionalInfo}>
              {subscription.additional_info}
            </div>
          </div>
        )}

        {actionError && (
          <div className={styles.actionError}>{actionError}</div>
        )}
        <div className={styles.actions}>
          {!isCancelled && (
            <button
              className={styles.cancelBtn}
              onClick={handleCancel}
              disabled={cancelling || deleting}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          )}
          <button
            className={styles.deleteBtn}
            onClick={async () => {
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
            }}
            disabled={deleting || cancelling}
          >
            {deleting ? 'Deleting...' : 'Delete Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
}
