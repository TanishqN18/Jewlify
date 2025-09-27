export default function JewelifyLoader() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-primary transition-all duration-300">
      <div className="text-4xl font-extrabold text-yellow-500 dark:text-yellow-400 animate-pulse tracking-wider">
        <span className="animate-bounce inline-block">J</span>ewelify
      </div>
      <p className="mt-2 text-secondary animate-pulse transition-colors duration-300">
        Loading something shiny...
      </p>
    </div>
  );
}
