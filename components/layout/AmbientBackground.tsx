/**
 * Purely decorative ambient backdrop (V2 mock): three blurred radial-gradient
 * orbs that slowly drift, plus a fine grain/noise overlay. Server Component —
 * ships zero JS. All positioning, gradients, blur, and animation live in
 * `app/globals.css`; this only emits the markup the styles hook onto.
 *
 * Both layers are `aria-hidden` and `pointer-events: none` (set in CSS) so they
 * are invisible to assistive tech and never intercept clicks.
 */
export const AmbientBackground = () => {
  return (
    <>
      <div className="bg-fx" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>
      <div className="grain" aria-hidden="true" />
    </>
  );
};
