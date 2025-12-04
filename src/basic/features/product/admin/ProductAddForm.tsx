import { Label, Input } from '../../../shared/component/ui';
import { useProductForm } from './hooks/useProductForm';
import { ProductForm } from './AdminProductList';

interface ProductAddFormProps {
  editingProduct: string | null;
  initialData?: ProductForm;
  onSubmit: (form: ProductForm) => void;
  onCancel: () => void;
  onValidationError?: (message: string) => void;
}

export const ProductAddForm = ({
  editingProduct,
  initialData,
  onSubmit,
  onCancel,
  onValidationError,
}: ProductAddFormProps) => {
  const {
    form,
    updateField,
    handleSubmit,
    handlePriceBlur,
    handleStockBlur,
    updateDiscount,
    addDiscount,
    removeDiscount,
  } = useProductForm({
    initialData,
    onSubmit,
    onValidationError,
  });
  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>상품명</Label>
            <Input
              type="text"
              value={form.name}
              name="name"
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </div>
          <div>
            <Label>설명</Label>
            <Input
              type="text"
              value={form.description}
              name="description"
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>
          <div>
            <Label>가격</Label>
            <Input
              type="text"
              name="price"
              value={form.price === 0 ? '' : form.price}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  updateField('price', value === '' ? 0 : parseInt(value));
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value) || 0;
                handlePriceBlur(value);
              }}
              placeholder="숫자만 입력"
              required
            />
          </div>
          <div>
            <Label>재고</Label>
            <Input
              type="text"
              name="stock"
              value={form.stock === 0 ? '' : form.stock}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  updateField('stock', value === '' ? 0 : parseInt(value));
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value) || 0;
                handleStockBlur(value);
              }}
              placeholder="숫자만 입력"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <Label className="mb-2">할인 정책</Label>
          <div className="space-y-2">
            {form.discounts.map((discount, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded"
              >
                <Input
                  type="number"
                  name="discounts"
                  value={discount.quantity}
                  onChange={(e) => {
                    updateDiscount(index, {
                      quantity: parseInt(e.target.value) || 0,
                    });
                  }}
                  className="w-20 px-2 py-1"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <Input
                  type="number"
                  value={discount.rate * 100}
                  onChange={(e) => {
                    updateDiscount(index, {
                      rate: (parseInt(e.target.value) || 0) / 100,
                    });
                  }}
                  className="w-16 px-2 py-1"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <button
                  type="button"
                  onClick={() => removeDiscount(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDiscount}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
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
            {editingProduct === 'new' ? '추가' : '수정'}
          </button>
        </div>
      </form>
    </div>
  );
};
