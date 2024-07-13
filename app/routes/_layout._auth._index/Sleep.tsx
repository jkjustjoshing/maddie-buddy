import { FormEvent, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Form } from "~/utils/Form";
import { getLocalDateString } from "~/utils/date";
import { fetchApi, fetchApiPost } from "~/utils/fetchApi";

const NAME = "Sleep";

// const printFormData = (f: FormData) => {
//   const e: Record<string, unknown> = {};
//   for (const [key, val] of f.entries()) {
//     e[key] = val;
//   }
//   console.log(e);
// };

export const Sleep = () => {
  const queryClient = useQueryClient();
  const endRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["timers"] });
  };

  const { data } = useQuery<
    { name: string; id: string; start: string; child: number }[]
  >(
    "timers",
    async () => {
      const data = await fetchApi("/timers/");
      return data.results;
    },
    { refetchInterval: 0 }
  );

  const sleepTimer = data?.find((d) => d.name === NAME);

  const startSleep = async (e: FormEvent<HTMLFormElement>) => {
    if (!(e.target instanceof HTMLFormElement)) {
      throw new Error("Not a form element");
    }

    const formData = new FormData(e.target);

    if (!detailsRef.current?.open) {
      formData.delete("start");
    }

    const data = await fetchApiPost("/timers/", formData);

    invalidate();

    return data;
  };

  const finishSleep = async (e: FormEvent<HTMLFormElement>) => {
    if (!(e.target instanceof HTMLFormElement)) {
      throw new Error("Not a form element");
    }

    const formData = new FormData(e.target);

    if (!detailsRef.current?.open) {
      // Just submit with the timer
      formData.delete("end");
      await fetchApiPost("/sleep/", formData);
    } else if (sleepTimer) {
      // Get timer start time, apply that with manual end time, then delete timer
      formData.set("start", sleepTimer.start);
      formData.set("child", String(sleepTimer.child));
      formData.delete("timer");
      await fetchApiPost("/sleep/", formData);
      await fetchApi("/timers/" + sleepTimer.id + "/", {
        method: "delete",
      });
    }

    invalidate();
    queryClient.invalidateQueries({ queryKey: ["sleep"] });
  };

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) {
      return;
    }

    details.open = false;

    details.addEventListener("toggle", () => {
      if (details.open && endRef.current) {
        endRef.current.value = getLocalDateString(new Date());
      }
    });
  }, [sleepTimer]);

  return (
    <>
      <h2>Maddie is {sleepTimer ? "Asleep" : "Awake"}</h2>
      {sleepTimer ? (
        <Form onSubmit={finishSleep}>
          <input type="hidden" name="child" value="1" />
          <input type="hidden" name="timer" value={sleepTimer.id} />
          <button>She woke up! 🌅</button>
          <details ref={detailsRef}>
            <summary>Wake time (defaults to "now")</summary>
            <input
              ref={endRef}
              placeholder="end"
              type="datetime-local"
              defaultValue={getLocalDateString(new Date())}
              name="end"
              id="end"
              required
            />
          </details>
        </Form>
      ) : (
        <Form onSubmit={startSleep}>
          <input type="hidden" name="child" value="1" />
          <input type="hidden" name="name" value={NAME} />
          <button>She fell asleep 😴</button>
          <details ref={detailsRef}>
            <summary>Sleep time (defaults to "now")</summary>
            <input
              ref={endRef}
              placeholder="start"
              type="datetime-local"
              defaultValue={getLocalDateString(new Date())}
              name="start"
              id="start"
              required
            />
          </details>
        </Form>
      )}
    </>
  );
};
