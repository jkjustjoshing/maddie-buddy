import { FormEvent, JSX, useState } from "react";

type Props = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<unknown>;
  group?: boolean;
  className?: string;
  children:
    | React.ReactNode
    | ((d: { isLoading: boolean; isSuccess: boolean | null }) => JSX.Element);
};

export const Form = ({
  children,
  onSubmit: passedOnSubmit,
  group,
  className,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    try {
      await passedOnSubmit(e);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else if (err) {
        setError(new Error(err.toString()));
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      className={className}
      onSubmit={onSubmit}
      aria-busy={
        typeof children !== "function" && isLoading ? "true" : undefined
      }
      data-error={error ? "true" : undefined}
    >
      <fieldset disabled={false} role={group ? "group" : undefined}>
        {typeof children === "function"
          ? children({ isLoading, isSuccess: !error })
          : children}
      </fieldset>
      {typeof children !== "function" && error ? (
        <div className="error">
          There was an error:{" "}
          <pre>
            {error.message}
            {"\n"}
            {error.stack}
          </pre>
        </div>
      ) : undefined}
    </form>
  );
};
