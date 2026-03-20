'use client';

import { useState } from 'react';
import styles from './form.module.scss';

const CURRENCIES = [
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
  { value: 'GBP', label: '£ GBP' },
  { value: 'RUB', label: '₽ RUB' },
  { value: 'UAH', label: '₴ UAH' },
  { value: 'KZT', label: '₸ KZT' },
  { value: 'TRY', label: '₺ TRY' },
  { value: 'JPY', label: '¥ JPY' },
  { value: 'CAD', label: 'C$ CAD' },
  { value: 'AUD', label: 'A$ AUD' },
];

const PLATFORMS = [
  { value: 'app_store', label: 'App Store' },
  { value: 'play_store', label: 'Google Play' },
  { value: 'web', label: 'Website' },
];

const CYCLES = [
  { value: 'weekly', label: 'Week' },
  { value: 'monthly', label: 'Month' },
  { value: 'quarterly', label: '3 Mos' },
  { value: 'semi_annual', label: '6 Mos' },
  { value: 'yearly', label: 'Year' },
];

export default function AddSubscription({ onClose, onSave }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [cycle, setCycle] = useState('monthly');
  const [platform, setPlatform] = useState('');
  const [renewalDate, setRenewalDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);

    return d.toISOString().slice(0, 10);
  });

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Service name is required');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Enter a valid amount');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_name: name.trim(),
          amount: parsedAmount,
          currency: currency || 'USD',
          billing_cycle: cycle,
          platform: platform || null,
          next_renewal_date: renewalDate || null,
          source: 'manual',
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || 'Failed to create subscription');
      }
      onSave?.();
      onClose();
    } catch (err) {
      console.error('Create failed:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} />

        <div className={styles.title}>Add Subscription</div>

        <div className={styles.formCard}>
          <div className={styles.field}>
            <label className={styles.label}>Service Name</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Netflix, Spotify"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Amount</label>
              <input
                className={styles.input}
                type="number"
                inputMode="decimal"
                placeholder="9.99"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className={styles.fieldSmall}>
              <label className={styles.label}>Currency</label>
              <select
                className={styles.input}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Billing Cycle</label>
            <div className={styles.segmented}>
              {CYCLES.map((c) => (
                <button
                  key={c.value}
                  className={`${styles.segment} ${cycle === c.value ? styles.segmentActive : ''}`}
                  onClick={() => setCycle(c.value)}
                  type="button"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Managed by</label>
            <div className={styles.segmented}>
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  className={`${styles.segment} ${platform === p.value ? styles.segmentActive : ''}`}
                  onClick={() => setPlatform(p.value)}
                  type="button"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Next Renewal Date</label>
            <input
              className={styles.input}
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
            />
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          className={styles.saveBtn}
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Add Subscription'}
        </button>

        <button
          className={styles.cancelBtn}
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
