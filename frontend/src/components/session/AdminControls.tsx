import { mutateGameState } from "@/api/session";

interface AdminControlsProps {
  token: string;
  gameId: string;
  onStateChange: () => Promise<void>;
}

export const AdminControls = ({
  token,
  gameId,
  onStateChange,
}: AdminControlsProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-2xl font-semibold text-gray-800">
        Session is still active
      </h2>
      <p className="text-gray-500">
        You can advance to the next question or stop the session.
      </p>

      <div className="flex gap-4">
        <button
          onClick={async () => {
            try {
              await mutateGameState(token, Number(gameId), "ADVANCE");
              await onStateChange(); // Refresh session state
            } catch {
              alert("❌ Failed to advance question.");
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Advance Question
        </button>

        <button
          onClick={async () => {
            try {
              await mutateGameState(token, Number(gameId), "END");
              await onStateChange(); // Refresh session state
            } catch {
              alert("❌ Failed to stop session.");
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Stop Session
        </button>
      </div>
    </div>
  );
};
