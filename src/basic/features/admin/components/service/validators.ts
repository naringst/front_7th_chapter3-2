import { CouponForm } from '../coupons/AdminCouponList';
import { ProductForm } from '../products/AdminProductList';

export interface ValidationError {
  field: keyof CouponForm | keyof ProductForm;
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
        message: '할인율은 100%를 초과할 수 없습니다',
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
        message: '할인율은 100%를 초과할 수 없습니다',
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

// ProductForm validation
export interface ProductValidationError {
  field: keyof ProductForm;
  message: string;
}

export const validateProductForm = (
  form: ProductForm,
): ProductValidationError | null => {
  if (!form.name.trim()) {
    return { field: 'name', message: '상품명을 입력해주세요.' };
  }

  if (form.price <= 0) {
    return { field: 'price', message: '가격은 0보다 커야 합니다.' };
  }

  if (form.stock < 0) {
    return { field: 'stock', message: '재고는 0 이상이어야 합니다.' };
  }

  if (form.stock > 9999) {
    return { field: 'stock', message: '재고는 9999개를 초과할 수 없습니다.' };
  }

  return null;
};

export const validatePrice = (
  value: number,
): { isValid: boolean; correctedValue?: number; message?: string } => {
  if (value < 0) {
    return {
      isValid: false,
      correctedValue: 0,
      message: '가격은 0보다 커야 합니다.',
    };
  }
  return { isValid: true };
};

export const validateStock = (
  value: number,
): { isValid: boolean; correctedValue?: number; message?: string } => {
  if (value < 0) {
    return {
      isValid: false,
      correctedValue: 0,
      message: '재고는 0보다 커야 합니다.',
    };
  }
  if (value > 9999) {
    return {
      isValid: false,
      correctedValue: 9999,
      message: '재고는 9999개를 초과할 수 없습니다.',
    };
  }
  return { isValid: true };
};
