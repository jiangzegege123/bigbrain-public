// src/components/session/SessionResultModal.tsx

import { useNavigate } from "react-router-dom";

interface SessionResultModalProps {
  sessionId: string; // ID of the recently stopped session
  onClose: () => void; // Callback to close the modal
  activeGameId: string; // ID of the game associated with the session
}

/**
 * Modal shown when a session is stopped.
 * Prompts the user to view the session results or return to the dashboard.
 */
const SessionResultModal = ({
  sessionId,
  onClose,
  activeGameId,
}: SessionResultModalProps) => {
  const navigate = useNavigate();
  console.log(activeGameId);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Session Stopped</h2>
        <p>Would you like to view the results?</p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigate(`/${activeGameId}/session/${sessionId}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionResultModal;
