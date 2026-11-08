const InputTask = () => {
  return (
    <div className="flex w-full max-w-xl items-center">
      <input
        type="text"
        placeholder="Enter a new task..."
        className="flex-1 min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus-border-violet-500 focus:ring-2-violet-200"
      />
      <button
        type="button"
        className="rounded-lg bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-700 active:scale-95 cursor-pointer"
      >
        +
      </button>
    </div>
  );
};

export default InputTask;
