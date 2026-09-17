import DriveBrowser from '../components/DriveBrowser.jsx';

export default function DrivesPage() {
  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-bold mb-1">Placement Drives</h1>
      <p className="text-sm text-slate-400 mb-6">All drives you are currently eligible for.</p>
      <DriveBrowser />
    </div>
  );
}