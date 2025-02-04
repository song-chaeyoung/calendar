import { eventType } from "@/types/event";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// const holidayApiKey = process.env.NEXT_PUBLIC_HOLIDAY_API;
// interface resType {
//   response: {
//     body: holidayType;
//     header: {
//       resultCode: string;
//       resultMsg: string;
//     };
//   };
// }
// interface holidayType {
//   items: {
//     item: holidayItemType[];
//   };
//   numOfRows: number;
//   pageNo: number;
//   totalCount: number;
// }

export interface holidayItemType {
  dateKind: string;
  dateName: string;
  isHoliday: string;
  locdate: number;
  seq: number;
}

// interface holidayList {
//   holiday: holidayItemType[];
// }

export interface calendarStoreType {
  holiday: holidayItemType[] | undefined;
  isLoading: boolean;
  cache: Record<string, holidayItemType[]>;
  fetchHoliday: (year: number, month: number) => Promise<void>;
}

export const useHolidayStore = create<calendarStoreType>((set, get) => ({
  holiday: undefined,
  isLoading: false,
  cache: {},
  fetchHoliday: async (year: number, month: number) => {
    const cacheKey = `${year}-${month}`;
    const cachedDate = get().cache[cacheKey];

    if (cachedDate) {
      set({ holiday: cachedDate });
      return;
    }

    set({ isLoading: true });

    try {
      const response = await fetch(`/api/holiday?year=${year}&month=${month}`);
      if (!response.ok) {
        throw new Error("Failed to fetch holidays");
      }
      const data = await response.json();
      const holidayItems = data.holiday;

      set((state) => ({
        holiday: holidayItems,
        cache: {
          ...state.cache,
          [cacheKey]: holidayItems,
        },
      }));
    } catch (err) {
      console.log(err);
      set({ holiday: undefined });
    } finally {
      set({ isLoading: false });
    }
  },
}));

interface eventStoreType {
  event: eventType[] | undefined;
  loading: boolean;
  confirm: boolean;
  setConfirm: (arg: boolean) => void;
  fetchEvent: () => void;
}

export const useEventStore = create<eventStoreType>((set) => ({
  event: undefined,
  loading: false,
  confirm: false,
  setConfirm: (arg) => set({ confirm: arg }),
  fetchEvent: async () => {
    set({ loading: true });
    try {
      // const response = await fetch("/api/event");
      const response = await fetch("/api/event", {
        cache: "no-store", // 캐시 비활성화
      });
      const json = await response.json();
      console.log(json);
      set({ event: json });
    } catch (err) {
      console.error(err);
      set({ event: [] });
    } finally {
      set({ loading: false });
    }
  },
}));

interface nowEventStoreType {
  modal: boolean;
  setModal: (arg: boolean) => void;
  nowEvent: eventType | undefined;
  setNowEvent: (arg: eventType) => void;
}

export const useNowEventStore = create<nowEventStoreType>((set) => ({
  modal: false,
  setModal: (arg) => set({ modal: arg }),
  nowEvent: undefined,
  setNowEvent: (data) => set({ nowEvent: data }),
}));

interface UiState {
  isMonthView: boolean;
  setIsMonthView: (isMonth: boolean) => void;
}

export const useCalendarUiStore = create<UiState>()(
  persist(
    (set) => ({
      isMonthView: true,
      setIsMonthView: (isMonth) => set({ isMonthView: isMonth }),
    }),
    {
      name: "calendar-ui-storage",
    }
  )
);
