export function formatDuration(ms) {
  if (isNaN(ms)) return "00:00.000";

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;

  let resultString = "";

  if (minutes > 0) {
    resultString += `${minutes} м `;
  }

  if (seconds > 0) {
    resultString += `${seconds} c `;
  }

  if (seconds === 0 || milliseconds > 0) {
    resultString += `${milliseconds.toString()} мс`;
  }

  return resultString;
}

export function formatSimpleDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let resultString = "";

  if (minutes > 0) {
    resultString += `${minutes.toString().padStart(2, "0")} мин: `;
  }

  resultString += `${seconds.toString().padStart(2, "0")} сек`;
  return resultString;
}
