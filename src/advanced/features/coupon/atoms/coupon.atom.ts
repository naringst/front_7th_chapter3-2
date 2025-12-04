import { atom } from 'jotai';
import { Coupon } from '../../../../types';

const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

// localStorage에서 초기값 로드
const loadCouponsFromStorage = (): Coupon[] => {
  if (typeof window === 'undefined') return initialCoupons;

  const saved = localStorage.getItem('coupons');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialCoupons;
    }
  }
  return initialCoupons;
};

// 쿠폰 목록 atom
export const couponsAtom = atom<Coupon[]>(loadCouponsFromStorage());

// localStorage 동기화를 위한 atom
export const couponsWithStorageAtom = atom(
  (get) => get(couponsAtom),
  (get, set, newCoupons: Coupon[] | ((prev: Coupon[]) => Coupon[])) => {
    const currentCoupons = get(couponsAtom);
    const updatedCoupons =
      typeof newCoupons === 'function'
        ? newCoupons(currentCoupons)
        : newCoupons;

    set(couponsAtom, updatedCoupons);

    // localStorage에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
    }
  },
);

// 선택된 쿠폰 atom
export const selectedCouponAtom = atom<Coupon | null>(null);
