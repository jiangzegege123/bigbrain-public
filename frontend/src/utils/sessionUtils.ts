export const copyLinkToClipboard = (sessionId: string) => {
  const url = `${window.location.origin}/play/${sessionId}`;
  navigator.clipboard.writeText(url);
};
