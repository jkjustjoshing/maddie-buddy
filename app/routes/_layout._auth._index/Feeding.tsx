import { FormEvent } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Form } from "~/utils/Form";
import { fetchApi, fetchApiPost } from "~/utils/fetchApi";

const NAME = "Feeding";

export const Feeding = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["timers"] });
  };

  const { data } = useQuery<{ name: string; id: string; start: string }[]>(
    "timers",
    async () => {
      const data = await fetchApi("/timers/");
      return data.results;
    },
    { refetchInterval: 0 }
  );

  const feedingTimers = data?.filter((d) => d.name === NAME);

  const startFeeding = async () => {
    const data = await fetchApiPost("/timers/", {
      child: 1,
      name: NAME,
    });

    invalidate();

    return data;
  };

  const finishFeeding = async (e: FormEvent<HTMLFormElement>) => {
    if (!(e.target instanceof HTMLFormElement)) {
      throw new Error("Not a form element");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const submitter = (e.nativeEvent as any).submitter as HTMLButtonElement;

    const formData = new FormData(e.target);
    formData.set(submitter.name, submitter.value);

    await fetchApiPost("/feedings/", formData);
    invalidate();
    queryClient.invalidateQueries({ queryKey: ["feedings"] });
  };

  const cancelTimer = async (timer: { id: string }) => {
    await fetchApi("/timers/" + timer.id, { method: "delete" });
    invalidate();
  };

  return (
    <>
      <h2>Feeding</h2>
      {!feedingTimers?.length && <p>No feedings in progress</p>}
      {!!feedingTimers?.length && (
        <ul>
          {feedingTimers.map((t) => (
            <li key={t.id} className="feedingItem">
              <div className="feedingItem-time">
                {new Date(t.start).toLocaleString("en-US")}
              </div>
              <Form
                onSubmit={() => cancelTimer(t)}
                className="feedingItem-delete"
              >
                <button className="outline">🗑️</button>
              </Form>
              <Form onSubmit={finishFeeding} className="feedingItem-amount">
                <input type="hidden" name="timer" value={t.id} />
                <input type="hidden" name="method" value={"bottle"} />
                <label htmlFor={"feeding-amount-" + t.id}>Amount</label>
                <input
                  placeholder="Amount"
                  type="number"
                  inputMode="decimal"
                  name="amount"
                  id={"feeding-amount-" + t.id}
                  required
                />
                <button name="type" value="breast milk">
                  Finish Breast Milk
                </button>
                <button name="type" value="formula">
                  Finish Formula
                </button>
              </Form>
            </li>
          ))}
        </ul>
      )}

      <Form onSubmit={startFeeding}>
        {({ isLoading }) => (
          <button aria-busy={isLoading ? "true" : undefined}>
            Start feeding
          </button>
        )}
      </Form>
    </>
  );
};
