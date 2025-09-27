export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-primary transition-all duration-300">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent mb-4"></div>
      <p className="text-primary text-lg font-medium animate-pulse transition-colors duration-300">
        {text}
      </p>
    </div>
  );
}
