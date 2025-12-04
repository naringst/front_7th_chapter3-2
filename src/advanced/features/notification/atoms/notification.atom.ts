import { atom } from 'jotai';
import { NotificationType } from '../hooks/useNotification';

// 장바구니 atom
export const notificationAtom = atom<NotificationType[]>([]);
