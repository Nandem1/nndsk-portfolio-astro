import { btnSecondary } from './classes';

export function DemoResetButton() {
  return (
    <button
      type="button"
      disabled
      title="No disponible en demo"
      className={`${btnSecondary} w-full py-2 text-[11px]`}
    >
      Rearmar entorno
    </button>
  );
}
