import { useCallback, useState, useEffect } from 'react';
import { ProductForm } from '../AdminProductList';
import {
  validateProductForm,
  validatePrice,
  validateStock,
} from '../../../../shared/utils/validators';

const initialForm: ProductForm = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: [],
};

interface UseProductFormOptions {
  initialData?: ProductForm;
  onSubmit: (form: ProductForm) => void;
  onValidationError?: (message: string) => void;
}

export const useProductForm = ({
  initialData,
  onSubmit,
  onValidationError,
}: UseProductFormOptions) => {
  const [form, setForm] = useState<ProductForm>(initialData || initialForm);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(initialForm);
    }
  }, [initialData]);

  const updateField = useCallback(
    <K extends keyof ProductForm>(field: K, value: ProductForm[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const error = validateProductForm(form);
      if (error) {
        onValidationError?.(error.message);
        return;
      }

      onSubmit(form);
    },
    [form, onSubmit, onValidationError],
  );

  const handlePriceBlur = useCallback(
    (value: number) => {
      const validation = validatePrice(value);

      if (!validation.isValid) {
        if (validation.correctedValue !== undefined) {
          updateField('price', validation.correctedValue);
        }
        if (validation.message) {
          onValidationError?.(validation.message);
        }
      }
    },
    [updateField, onValidationError],
  );

  const handleStockBlur = useCallback(
    (value: number) => {
      const validation = validateStock(value);

      if (!validation.isValid) {
        if (validation.correctedValue !== undefined) {
          updateField('stock', validation.correctedValue);
        }
        if (validation.message) {
          onValidationError?.(validation.message);
        }
      }
    },
    [updateField, onValidationError],
  );

  const updateDiscount = useCallback(
    (index: number, updates: Partial<ProductForm['discounts'][0]>) => {
      setForm((prev) => {
        const newDiscounts = [...prev.discounts];
        newDiscounts[index] = { ...newDiscounts[index], ...updates };
        return { ...prev, discounts: newDiscounts };
      });
    },
    [],
  );

  const addDiscount = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      discounts: [...prev.discounts, { quantity: 10, rate: 0.1 }],
    }));
  }, []);

  const removeDiscount = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      discounts: prev.discounts.filter((_, i) => i !== index),
    }));
  }, []);

  const reset = useCallback(() => {
    setForm(initialForm);
  }, []);

  const setFormData = useCallback((data: ProductForm) => {
    setForm(data);
  }, []);

  return {
    form,
    updateField,
    handleSubmit,
    handlePriceBlur,
    handleStockBlur,
    updateDiscount,
    addDiscount,
    removeDiscount,
    reset,
    setFormData,
  };
};
