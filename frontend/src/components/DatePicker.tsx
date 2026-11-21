interface DatePickerProps {
  selectedDate: string;
  selectedTime: string;
  setSelectedDate: (value: string) => void;
  setSelectedTime: (value: string) => void;
}

const DatePicker = ({
  selectedDate,
  selectedTime,
  setSelectedDate,
  setSelectedTime,
}: DatePickerProps) => {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3">
      <label className="text-xs text-slate-600">
        Date
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 p-2"
        />
      </label>

      <label className="text-xs text-slate-600">
        Time
        <input
          type="time"
          value={selectedTime}
          onChange={(event) => setSelectedTime(event.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 p-2"
        />
      </label>
    </div>
  );
};

export default DatePicker;
