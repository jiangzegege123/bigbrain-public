import { CheckCircle, XCircle } from "lucide-react";

interface OptionButtonProps {
  text: string;
  isSelected: boolean;
  isCorrect?: boolean | null;
  isTimeUp: boolean;
  onClick: () => void;
}

const OptionButton = ({
  text,
  isSelected,
  isCorrect,
  isTimeUp,
  onClick,
}: OptionButtonProps) => {
  let optionClass = "border-2 transition-all duration-200 ";
  let iconElement = null;

  if (isTimeUp && isCorrect !== undefined) {
    if (isCorrect) {
      optionClass += "border-green-500 bg-green-50";
      iconElement = (
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
      );
    } else if (isSelected) {
      optionClass += "border-red-500 bg-red-50";
      iconElement = <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />;
    } else {
      optionClass += "border-gray-200";
    }
  } else {
    optionClass += isSelected
      ? "border-primary bg-primary/5"
      : "border-gray-200 hover:border-gray-300";
  }

  return (
    <button
      onClick={onClick}
      disabled={isTimeUp}
      className={`flex items-center justify-between p-4 rounded-lg ${optionClass} ${
        isTimeUp ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <span className="text-lg">{text}</span>
      {iconElement}
    </button>
  );
};

export default OptionButton; 