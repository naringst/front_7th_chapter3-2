import { useCallback, useState } from 'react';
import { CouponForm } from '../components/coupons/AdminCouponList';
import {
  validateDiscountValue,
  validateCouponForm,
} from '../components/service/validators';

const initialForm: CouponForm = {
  name: '',
  code: '',
  discountType: 'amount',
  discountValue: 0,
};

interface UseCouponFormOptions {
  onSubmit: (form: CouponForm) => void;
  onValidationError?: (message: string) => void;
}

export const useCouponForm = ({
  onSubmit,
  onValidationError,
}: UseCouponFormOptions) => {
  const [form, setForm] = useState<CouponForm>(initialForm);

  const updateField = useCallback(
    <K extends keyof CouponForm>(field: K, value: CouponForm[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const error = validateCouponForm(form);
      if (error) {
        onValidationError?.(error.message);
        return;
      }

      onSubmit(form);
      setForm(initialForm);
    },
    [form, onSubmit, onValidationError],
  );

  const handleDiscountValueBlur = useCallback(
    (value: number) => {
      const validation = validateDiscountValue(value, form.discountType);

      if (!validation.isValid) {
        if (validation.correctedValue !== undefined) {
          updateField('discountValue', validation.correctedValue);
        }
        if (validation.message) {
          onValidationError?.(validation.message);
        }
      }
    },
    [form.discountType, updateField, onValidationError],
  );

  const reset = useCallback(() => {
    setForm(initialForm);
  }, []);

  return {
    form,
    updateField,
    handleSubmit,
    handleDiscountValueBlur,
    reset,
  };
};
