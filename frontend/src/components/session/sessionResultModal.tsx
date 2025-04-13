// src/components/session/SessionResultModal.tsx
import { useNavigate } from "react-router-dom";

interface SessionResultModalProps {
  sessionId: string;
  onClose: () => void;
}

const SessionResultModal = ({
  sessionId,
  onClose,
}: SessionResultModalProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Session Stopped</h2>
        <p>Would you like to view the results?</p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigate(`/session/${sessionId}`)}
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
