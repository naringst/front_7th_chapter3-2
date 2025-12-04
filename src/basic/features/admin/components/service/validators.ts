import { CouponForm } from '../coupons/AdminCouponList';

export interface ValidationError {
  field: keyof CouponForm;
  message: string;
}

export const validateCouponForm = (
  form: CouponForm,
): ValidationError | null => {
  if (!form.name.trim()) {
    return { field: 'name', message: '쿠폰명을 입력해주세요.' };
  }

  if (!form.code.trim()) {
    return { field: 'code', message: '쿠폰 코드를 입력해주세요.' };
  }

  if (form.discountType === 'percentage') {
    if (form.discountValue > 100) {
      return {
        field: 'discountValue',
        message: '할인율은 100%를 초과할 수 없습니다.',
      };
    }
    if (form.discountValue < 0) {
      return {
        field: 'discountValue',
        message: '할인율은 0 이상이어야 합니다.',
      };
    }
  } else {
    if (form.discountValue > 100000) {
      return {
        field: 'discountValue',
        message: '할인 금액은 100,000원을 초과할 수 없습니다.',
      };
    }
    if (form.discountValue < 0) {
      return {
        field: 'discountValue',
        message: '할인 금액은 0 이상이어야 합니다.',
      };
    }
  }

  return null;
};

export const validateDiscountValue = (
  value: number,
  discountType: 'amount' | 'percentage',
): { isValid: boolean; correctedValue?: number; message?: string } => {
  if (discountType === 'percentage') {
    if (value > 100) {
      return {
        isValid: false,
        correctedValue: 100,
        message: '할인율은 100%를 초과할 수 없습니다.',
      };
    }
    if (value < 0) {
      return {
        isValid: false,
        correctedValue: 0,
        message: '할인율은 0 이상이어야 합니다.',
      };
    }
  } else {
    if (value > 100000) {
      return {
        isValid: false,
        correctedValue: 100000,
        message: '할인 금액은 100,000원을 초과할 수 없습니다.',
      };
    }
    if (value < 0) {
      return {
        isValid: false,
        correctedValue: 0,
        message: '할인 금액은 0 이상이어야 합니다.',
      };
    }
  }

  return { isValid: true };
};
