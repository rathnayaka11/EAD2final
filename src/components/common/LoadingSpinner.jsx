export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );
}