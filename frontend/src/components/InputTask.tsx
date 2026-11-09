import { useState } from "react";
import { useCreateTaskMutation } from "../api/taskApi";

const InputTask = () => {
  const [title, setTitle] = useState<string>("");
  const [createTask, { isLoading: isCreateLoading }] = useCreateTaskMutation();

  const handleTaskCreation = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    try {
      await createTask({
        title: trimmedTitle,
      });
      setTitle("");
    } catch (error) {
      console.error("Unable to update the task.", error);
    }
  };

  return (
    <form
      onSubmit={handleTaskCreation}
      className="flex w-full max-w-xl items-center"
    >
      <input
        type="text"
        placeholder="Enter a new task..."
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="flex-1 min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus-border-violet-500 focus:ring-2 focus:ring-violet-200"
      />
      <button
        type="submit"
        disabled={isCreateLoading || !title.trim()}
        className="rounded-lg bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-700 active:scale-95 cursor-pointer"
      >
        +
      </button>
    </form>
  );
};

export default InputTask;
