const STEPS = ['Applied', 'Shortlisted', 'Interview', 'Selected'];
const INDEX = { APPLIED: 0, SHORTLISTED: 1, IN_PROCESS: 2, SELECTED: 3 };

export default function Stepper({ status }) {
  const failed = status === 'REJECTED';
  const reached = failed ? 0 : (INDEX[status] ?? 0);
  return (
    <div className="flex items-start">
      {STEPS.map((label, i) => {
        const done = !failed && reached >= i;
        const isFail = failed && i === 0;
        return (
          <div key={label} className={i < STEPS.length - 1 ? 'flex items-start flex-1' : 'flex flex-col items-center'}>
            <div className="flex flex-col items-center w-16">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isFail ? 'bg-red-500 text-white animate-popIn' : done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                {isFail ? 'x' : done ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] mt-1 ${done || isFail ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mt-3 ${!failed && reached > i ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}