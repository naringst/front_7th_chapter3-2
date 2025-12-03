import { formatPrice } from '../../../../shared/utils/priceUtils';

export const PaymentCompleteButton = ({
  paymentAmount,
  completeOrder,
}: {
  paymentAmount: number;
  completeOrder: () => void;
}) => {
  return (
    <button
      onClick={completeOrder}
      className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
    >
      {formatPrice(paymentAmount)}원 결제하기
    </button>
  );
};
