export default function JewelifyLoader() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white dark:bg-gray-900">
      <div className="text-4xl font-extrabold text-yellow-500 dark:text-yellow-400 animate-pulse tracking-wider">
        <span className="animate-bounce inline-block">J</span>ewelify
      </div>
      <p className="mt-2 text-gray-600 dark:text-gray-300 animate-pulse">
        Loading something shiny...
      </p>
    </div>
  );
}
