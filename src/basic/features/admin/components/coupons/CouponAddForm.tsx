import { Label, Input, Select } from '../../../../shared/component/ui';
import { useCouponForm } from '../../hooks/useCouponForm';
import { CouponForm } from './AdminCouponList';

interface CouponAddFormProps {
  onSubmit: (form: CouponForm) => void;
  onCancel: () => void;
  onValidationError?: (message: string) => void;
}

export const CouponAddForm = ({
  onSubmit,
  onCancel,
  onValidationError,
}: CouponAddFormProps) => {
  const { form, updateField, handleSubmit, handleDiscountValueBlur } =
    useCouponForm({
      onSubmit,
      onValidationError,
    });

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label>쿠폰명</Label>
            <Input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="신규 가입 쿠폰"
              required
            />
          </div>
          <div>
            <Label>쿠폰 코드</Label>
            <Input
              type="text"
              value={form.code}
              onChange={(e) =>
                updateField('code', e.target.value.toUpperCase())
              }
              className="font-mono"
              placeholder="WELCOME2024"
              required
            />
          </div>
          <div>
            <Label>할인 타입</Label>
            <Select
              value={form.discountType}
              onChange={(e) =>
                updateField(
                  'discountType',
                  e.target.value as 'amount' | 'percentage',
                )
              }
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </Select>
          </div>
          <div>
            <Label>
              {form.discountType === 'amount' ? '할인 금액' : '할인율(%)'}
            </Label>
            <Input
              type="text"
              value={form.discountValue === 0 ? '' : form.discountValue}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  updateField(
                    'discountValue',
                    value === '' ? 0 : parseInt(value),
                  );
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value) || 0;
                handleDiscountValueBlur(value);
              }}
              placeholder={form.discountType === 'amount' ? '5000' : '10'}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            쿠폰 생성
          </button>
        </div>
      </form>
    </div>
  );
};
