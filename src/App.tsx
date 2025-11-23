
export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-4">TailwindCSS is working! ✅</h1>
      <p className="text-lg">
        This background and text color changes with dark mode.
      </p>
      <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Test Button
      </button>
    </div>
  );
}
