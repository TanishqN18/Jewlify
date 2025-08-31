export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white dark:bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent mb-4"></div>
      <p className="text-gray-800 dark:text-gray-200 text-lg font-medium animate-pulse">
        {text}
      </p>
    </div>
  );
}
