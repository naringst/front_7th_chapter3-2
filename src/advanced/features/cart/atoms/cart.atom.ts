import { atom } from 'jotai';
import { CartItem } from '../../../../types';

// localStorage에서 초기값 로드
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];

  const saved = localStorage.getItem('cart');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
};

// 장바구니 atom
export const cartAtom = atom<CartItem[]>(loadCartFromStorage());

// localStorage 동기화를 위한 atom
export const cartWithStorageAtom = atom(
  (get) => get(cartAtom),
  (get, set, newCart: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    const currentCart = get(cartAtom);
    const updatedCart =
      typeof newCart === 'function' ? newCart(currentCart) : newCart;

    set(cartAtom, updatedCart);

    // localStorage에 저장
    if (typeof window !== 'undefined') {
      if (updatedCart.length > 0) {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } else {
        localStorage.removeItem('cart');
      }
    }
  },
);

// 장바구니 총 아이템 개수 (derived atom)
export const totalCartItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});
