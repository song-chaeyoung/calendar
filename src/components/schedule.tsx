import React from "react";
import { useEventStore, useNowEventStore } from "@/store/calendarStore";
import ScheduleForm from "./scheduleForm";
import { eventType } from "@/types/event";

interface props {
  setClose: (arg: boolean) => void;
  edit: boolean;
  setEdit: (arg: boolean) => void;
}

const Schedule = ({ setClose, edit, setEdit }: props) => {
  const { setConfirm } = useEventStore();
  const { nowEvent, setNowEvent } = useNowEventStore();

  const postApi = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());

    if (data) {
      const [startYear, startMonth, startDay] = String(data.startDate).split(
        "-"
      );
      const [endYear, endMonth, endDay] = String(data.endDate).split("-");
      data.startDate = `${startYear.slice(2)}${startMonth}${startDay}`;
      data.endDate = `${endYear.slice(2)}${endMonth}${endDay}`;
    }

    try {
      const res = await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: data }),
      });

      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`);
      }

      const result = await res.json();
      setClose(false);
      setConfirm(true);

      useEventStore.getState().fetchEvent();

      return result;
    } catch (err) {
      console.error(err);
    }

    return data;
  };

  const patchApi = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    console.log(data, nowEvent);
    const patchData: eventType = {
      ...data,
      id: nowEvent?.id,
    } as eventType;

    if (data) {
      const [startYear, startMonth, startDay] = String(data.startDate).split(
        "-"
      );
      const [endYear, endMonth, endDay] = String(data.endDate).split("-");
      patchData.startDate = `${startYear.slice(2)}${startMonth}${startDay}`;
      patchData.endDate = `${endYear.slice(2)}${endMonth}${endDay}`;
    }

    try {
      const res = await fetch("/api/event", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: patchData }),
      });

      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`);
      }

      const result = await res.json();
      setEdit(false);
      setNowEvent(undefined);

      useEventStore.getState().fetchEvent();

      return result;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScheduleForm
      edit={edit}
      postApi={postApi}
      patchApi={patchApi}
      nowEvent={nowEvent}
    />
  );
};

export default Schedule;
