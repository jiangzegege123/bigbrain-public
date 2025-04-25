// src/components/game/QuestionMedia.tsx
interface QuestionMediaProps {
  media: string;
}

const QuestionMedia = ({ media }: QuestionMediaProps) => {
  if (!media) return null;

  const isBase64Image = media.startsWith("data:image");
  const isYouTube = media.includes("youtube.com") || media.includes("youtu.be");

  return (
    <div className="mt-4 rounded overflow-hidden">
      {isBase64Image ? (
        <img
          src={media}
          alt="Question media"
          className="max-w-full h-auto rounded"
        />
      ) : isYouTube ? (
        <iframe
          width="100%"
          height="315"
          src={
            media.includes("embed")
              ? media
              : media.replace("watch?v=", "embed/")
          }
          title="YouTube video"
          allowFullScreen
          className="rounded"
        />
      ) : (
        <img
          src={media}
          alt="Question media"
          className="max-w-full h-auto rounded"
        />
      )}
    </div>
  );
};

export default QuestionMedia;
