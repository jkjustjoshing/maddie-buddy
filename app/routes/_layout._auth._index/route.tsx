import { Form } from "~/utils/Form";
import { Feeding } from "./Feeding";
import { FormEvent, useRef } from "react";
import { fetchApiPost } from "~/utils/fetchApi";
import { useQueryClient } from "react-query";
import { Sleep } from "./Sleep";
import { getDateFromLocalDateString, getLocalDateString } from "~/utils/date";

export default function Index() {
  const queryClient = useQueryClient();
  const endRef = useRef<HTMLInputElement>(null);

  const createPumping = async (e: FormEvent<HTMLFormElement>) => {
    if (!(e.target instanceof HTMLFormElement)) {
      throw new Error("Not a form element");
    }

    const formData = new FormData(e.target);

    const duration = formData.get("duration");
    const endTime = getDateFromLocalDateString(formData.get("end"));

    const startTime = new Date(endTime.getTime());
    startTime.setTime(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      startTime.getTime() - parseFloat(duration as any) * 60000
    );

    formData.set("start", startTime.toISOString());
    formData.set("end", endTime.toISOString());
    await fetchApiPost("/pumping/", formData);
    queryClient.invalidateQueries({ queryKey: ["pumpings"] });

    e.target.reset();
    if (endRef.current) {
      endRef.current.value = getLocalDateString(new Date());
    }
  };

  return (
    <div>
      <section>
        <Sleep />
      </section>
      <section>
        <h2>Pumping</h2>
        <Form onSubmit={createPumping}>
          <input type="hidden" name="child" value="1" />
          <label htmlFor="amount">Amount</label>
          <input
            placeholder="In milliliters"
            type="number"
            inputMode="decimal"
            name="amount"
            id="amount"
            required
          />
          <label htmlFor="duration">Duration</label>
          <input
            placeholder="In minutes (incl decimals)"
            type="number"
            inputMode="decimal"
            name="duration"
            id="duration"
            step="any"
            required
          />
          <label htmlFor="end">End time</label>
          <input
            ref={endRef}
            placeholder="end"
            type="datetime-local"
            defaultValue={getLocalDateString(new Date())}
            name="end"
            id="end"
            required
          />
          <button>Log Pump</button>
        </Form>
      </section>
      <section>
        <Feeding />
      </section>
    </div>
  );
}
