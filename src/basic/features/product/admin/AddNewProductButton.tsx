export const AddNewProductButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
    >
      새 상품 추가
    </button>
  );
};
