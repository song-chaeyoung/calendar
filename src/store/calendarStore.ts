import { holidayItemType } from "@/services/holiday";
import { create } from "zustand";

interface CalendarState {
  date: Date[][];
  currentDate: Date;
  getHolidayInfo: (day: Date) => holidayItemType | undefined;
}

const useCalendarStore = create<CalendarState>((set) => ({
  date: [],
  currentDate: new Date(),
  getHolidayInfo: (day: Date) => undefined,
}));

export default useCalendarStore;
