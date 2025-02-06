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
  loading: boolean;
  event: eventType[] | [];
  confirm: boolean;
  isCategoryView: string;
  fetchEvent: () => void;
  setConfirm: (arg: boolean) => void;
  setIsCategoryView: (arg: string) => void;
}

export const useEventStore = create<eventStoreType>((set, get) => ({
  event: [],
  loading: true,
  confirm: false,
  isCategoryView: "all",
  setIsCategoryView: (arg) => set({ isCategoryView: arg }),
  setConfirm: (arg) => set({ confirm: arg }),
  fetchEvent: async () => {
    set({ loading: true });
    try {
      // const response = await fetch("/api/event");
      const response = await fetch("/api/event", {
        cache: "no-store",
      });
      const json = await response.json();

      const itemArr: eventType[] | undefined = [];
      const sortFnc = () => {
        json.map((item: eventType | undefined) => {
          if (!item) return;
          const category = get().isCategoryView;
          if (category === "all") itemArr.push(item);
          else {
            if (item?.category === category) itemArr.push(item);
          }
        });
      };

      sortFnc();

      set({ event: itemArr });
    } catch (err) {
      console.error(err);
      set({ event: [] });
    } finally {
      set({ loading: false });
    }
  },
}));

interface allEventStoreType {
  viewDay: string;
  setViewDay: (arg: string) => void;
  allEvent: eventType[] | [];
  setAllEvent: (arg: eventType[]) => void;
  showAllEvent: boolean;
  setShowAllEvent: (arg: boolean) => void;
}

export const allEventStore = create<allEventStoreType>((set) => ({
  viewDay: "",
  setViewDay: (arg) => set({ viewDay: arg }),
  allEvent: [],
  setAllEvent: (arg) => set({ allEvent: arg }),
  showAllEvent: false,
  setShowAllEvent: (arg) => set({ showAllEvent: arg }),
}));

interface nowEventStoreType {
  modal: boolean;
  setModal: (arg: boolean) => void;
  nowEvent: eventType | undefined;
  setNowEvent: (arg: eventType | undefined) => void;
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
