'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { saveOnboardingName, saveCategory, savePaymentMethod, finishOnboarding } from '../dashboard/actions';
import {
  Wallet,
  User,
  Tag,
  CreditCard,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CurrencySelector } from '../dashboard/profile/settings/currency-selector';
import { type CurrencyCode, DEFAULT_CURRENCY, inferCurrencyFromTimezone } from '@/lib/config/currencies';

type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export default function OnboardingPage() {
  const t = useTranslations('pages.onboarding');
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Name
  const [fullName, setFullName] = useState('');

  // Step 2: Currency
  // Intentar inferir moneda del timezone del navegador
  const browserTimezone = typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : null;
  const inferredCurrency = browserTimezone ? inferCurrencyFromTimezone(browserTimezone) : DEFAULT_CURRENCY;
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(inferredCurrency);

  // Step 3: Categories (selected from suggestions)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Step 4: Payment Method
  const [paymentName, setPaymentName] = useState('');
  const [paymentType, setPaymentType] = useState<'tarjeta_credito' | 'tarjeta_debito' | 'efectivo'>('tarjeta_credito');

  const CATEGORY_SUGGESTIONS = [
    { key: 'food', name: t('step3.categories.food'), color: '#10B981', icon: 'Utensils' },
    { key: 'transport', name: t('step3.categories.transport'), color: '#3B82F6', icon: 'Car' },
    { key: 'entertainment', name: t('step3.categories.entertainment'), color: '#F59E0B', icon: 'Film' },
    { key: 'services', name: t('step3.categories.services'), color: '#8B5CF6', icon: 'Zap' },
    { key: 'health', name: t('step3.categories.health'), color: '#EF4444', icon: 'Heart' },
    { key: 'education', name: t('step3.categories.education'), color: '#6366F1', icon: 'GraduationCap' },
  ];

  const handleNextStep = async () => {
    setError('');
    setIsLoading(true);

    try {
      if (step === 1) {
        // Save name and currency
        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('currency', selectedCurrency);
        const result = await saveOnboardingName(formData);

        if (result?.error) {
          setError(result.error);
          setIsLoading(false);
          return;
        }

        setStep(2);
      } else if (step === 2) {
        // Just move to next step (currency already saved in step 1)
        setStep(3);
      } else if (step === 3) {
        // Create selected categories
        for (const categoryKey of selectedCategories) {
          const category = CATEGORY_SUGGESTIONS.find(c => c.key === categoryKey);
          if (category) {
            const formData = new FormData();
            formData.append('name', category.name);
            formData.append('color', category.color);
            formData.append('icon', category.icon);
            await saveCategory(formData);
          }
        }
        setStep(4);
      } else if (step === 4) {
        // Create payment method
        const formData = new FormData();
        formData.append('name', paymentName);
        formData.append('type', paymentType);
        formData.append('color', '#9FFF66');
        formData.append('isDefault', 'true');

        const result = await savePaymentMethod(formData);

        if (result?.error) {
          setError(result.error);
          setIsLoading(false);
          return;
        }

        setStep(5);
      } else if (step === 5) {
        // Complete onboarding
        await finishOnboarding();
        // Redirect to dashboard - middleware will handle the rest
        router.push('/dashboard');
      }
    } catch (err) {
      setError(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((step - 1) as OnboardingStep);
    }
  };

  const toggleCategory = (categoryKey: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryKey)
        ? prev.filter(c => c !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  const canContinue = () => {
    if (step === 1) return fullName.trim().length >= 2;
    if (step === 2) return true; // Currency always has a value (inferred or selected)
    if (step === 3) return selectedCategories.length > 0;
    if (step === 4) return paymentName.trim().length > 0;
    return true;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-8">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in">
        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <Card className="shadow-xl border-2">
          <CardHeader>
            {step === 1 && (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/20">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl text-center">{t('step1.title')}</CardTitle>
                <CardDescription className="text-center text-base">
                  {t('step1.subtitle')}
                </CardDescription>
              </>
            )}
            {step === 2 && (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/20">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl text-center">{t('step2.title')}</CardTitle>
                <CardDescription className="text-center text-base">
                  {t('step2.subtitle')}
                </CardDescription>
              </>
            )}
            {step === 3 && (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/20">
                  <Tag className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl text-center">{t('step3.title')}</CardTitle>
                <CardDescription className="text-center text-base">
                  {t('step3.subtitle')}
                </CardDescription>
              </>
            )}
            {step === 4 && (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/20">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl text-center">{t('step4.title')}</CardTitle>
                <CardDescription className="text-center text-base">
                  {t('step4.subtitle')}
                </CardDescription>
              </>
            )}
            {step === 5 && (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/20">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl text-center">{t('step5.title')}</CardTitle>
                <CardDescription className="text-center text-base">
                  {t('step5.subtitle')}
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Name */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-base">
                    {t('step1.label')}
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder={t('step1.placeholder')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 text-base"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Step 2: Currency */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-base">
                    {t('step2.label')}
                  </Label>
                  <CurrencySelector
                    value={selectedCurrency}
                    onChange={setSelectedCurrency}
                  />
                  {browserTimezone && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {t('step2.inferredNote')}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {t('step2.note')}
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Categories */}
            {step === 3 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {CATEGORY_SUGGESTIONS.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => toggleCategory(category.key)}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:scale-105 ${
                      selectedCategories.includes(category.key)
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                        : 'border-border bg-background'
                    }`}
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Tag className="h-6 w-6" style={{ color: category.color }} />
                    </div>
                    <span className="text-sm font-medium">{category.name}</span>
                    {selectedCategories.includes(category.key) && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Payment Method */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentName" className="text-base">
                    {t('step4.nameLabel')}
                  </Label>
                  <Input
                    id="paymentName"
                    type="text"
                    placeholder={t('step4.namePlaceholder')}
                    value={paymentName}
                    onChange={(e) => setPaymentName(e.target.value)}
                    className="h-12 text-base"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">{t('step4.typeLabel')}</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'tarjeta_credito' as const, labelKey: 'credit', icon: CreditCard },
                      { value: 'tarjeta_debito' as const, labelKey: 'debit', icon: CreditCard },
                      { value: 'efectivo' as const, labelKey: 'cash', icon: Wallet },
                    ].map(({ value, labelKey, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setPaymentType(value)}
                        className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                          paymentType === value
                            ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                            : 'border-border bg-background'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-sm font-medium">{t(`step4.types.${labelKey}`)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Completion */}
            {step === 5 && (
              <div className="space-y-6 text-center">
                <div className="rounded-lg bg-primary/5 p-6 space-y-2">
                  <p className="text-lg font-semibold">
                    {t('step5.greeting', { name: fullName })}
                  </p>
                  <p className="text-muted-foreground">
                    {t('step5.summary', { categories: selectedCategories.length })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('step5.note')}
                  </p>
                </div>
                <div className="grid gap-3 text-left">
                  <div className="flex items-start gap-3 rounded-lg border p-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{t('step5.nextSteps.expense.title')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('step5.nextSteps.expense.description')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border p-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{t('step5.nextSteps.stats.title')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('step5.nextSteps.stats.description')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border p-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{t('step5.nextSteps.budgets.title')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('step5.nextSteps.budgets.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
              >
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && step < 5 && (
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  className="h-12"
                  disabled={isLoading}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {t('previous')}
                </Button>
              )}
              <Button
                onClick={handleNextStep}
                className="h-12 flex-1 font-semibold"
                disabled={!canContinue() || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    {t('processing')}
                  </span>
                ) : step === 5 ? (
                  <span className="flex items-center gap-2">
                    {t('goToDashboard')}
                    <ChevronRight className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t('continue')}
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skip Option */}
        {step < 5 && (
          <p className="text-center text-sm text-muted-foreground">
            {t('progress', { step })} •{' '}
            <button
              onClick={() => setStep(5)}
              className="text-primary hover:underline font-medium"
              disabled={isLoading}
            >
              {t('skip')}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
