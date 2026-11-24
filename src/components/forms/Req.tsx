/** Required-field marker: a visible asterisk, read out as "required" by screen readers. */
export function Req() {
  return (
    <>
      <span className="req" aria-hidden="true">
        *
      </span>
      <span className="sr-only"> (required)</span>
    </>
  );
}
