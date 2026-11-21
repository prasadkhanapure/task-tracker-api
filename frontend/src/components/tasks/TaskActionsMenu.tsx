import { useState } from "react";
import { Flag, MoreHorizontal, Trash2 } from "lucide-react";
import type { Task, TaskChanges, TaskActionsMenuProps } from "../../types/task";
import DatePicker from "../DatePicker";
import { priorities, toDateTimeLocal } from "./utils/tasks";

const TaskActionsMenu = ({
  priority,
  dueAt,
  onApplyEdit,
  onDelete,
  disabled = false,
}: TaskActionsMenuProps) => {
  const [isOpenMoreButton, setIsOpenMoreButton] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [selectedPriority, setSelectedPriority] =
    useState<Task["priority"]>(priority);

  const handleToggleMenu = () => {
    if (!isOpenMoreButton) {
      const localDateTime = toDateTimeLocal(dueAt);

      setSelectedPriority(priority);
      setSelectedDate(localDateTime.slice(0, 10));
      setSelectedTime(localDateTime.slice(11, 16) || "09:00");
    }

    setIsOpenMoreButton((previous) => !previous);
  };

  const handleApplyOnEdit = async () => {
    const changes: TaskChanges = {};

    if (selectedPriority !== priority) {
      changes.priority = selectedPriority;
    }

    if (!selectedDate) {
      if (dueAt !== null) {
        changes.due_at = null;
      }
    } else if (selectedTime) {
      const date = new Date(`${selectedDate}T${selectedTime}`);

      if (Number.isNaN(date.getTime())) return;

      if (!dueAt || date.getTime() !== new Date(dueAt).getTime()) {
        changes.due_at = date.toISOString();
      }
    }

    if (Object.keys(changes).length === 0) {
      setIsOpenMoreButton(false);
      return;
    }

    try {
      await onApplyEdit(changes);
      setIsOpenMoreButton(false);
    } catch (error) {
      console.error("Unable to update task.", error);
    }
  };

  const handleClear = () => {
    setSelectedDate("");
    setSelectedPriority(priority);
  };

  return (
    <div
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpenMoreButton(false);
        }
      }}
      className="relative shrink-0"
    >
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggleMenu}
        aria-label="More task actions"
        className="rounded-md p-2 text-slate-500 hover:bg-slate-200"
      >
        <MoreHorizontal size={20} />
      </button>

      {isOpenMoreButton && (
        <div
          className="absolute right-0 top-full z-20 mt-2 w-64
           rounded-lg border border-slate-200 bg-white
           p-3 shadow-lg"
        >
          <div className="space-y-2">
            <p className="text-xs text-slate-500">Priority</p>

            <div className="flex justify-between gap-2">
              {priorities.map(({ value, color }) => (
                <button
                  key={value}
                  type="button"
                  title={value}
                  aria-label={`Set ${value} priority`}
                  aria-pressed={selectedPriority === value}
                  disabled={disabled}
                  onClick={() => setSelectedPriority(value)}
                  className={`rounded-md p-2 hover:bg-slate-100 ${
                    selectedPriority === value ? "bg-slate-100" : ""
                  }`}
                >
                  <Flag
                    size={20}
                    className={`${color} ${
                      value === "none" ? "fill-none" : "fill-current"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <DatePicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            setSelectedDate={setSelectedDate}
            setSelectedTime={setSelectedTime}
          />
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled || (!selectedDate && !dueAt)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={handleApplyOnEdit}
              disabled={disabled || (Boolean(selectedDate) && !selectedTime)}
              className="rounded-md bg-violet-600 px-3 py-2 text-sm text-white"
            >
              Apply
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsOpenMoreButton(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskActionsMenu;
