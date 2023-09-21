
export function findDate(finishedDate) {
  finishedDate = new Date(finishedDate);
  // Extract year, month, and date
  const year = finishedDate.getUTCFullYear();
  const month = finishedDate.getUTCMonth() + 1;
  const date = finishedDate.getUTCDate();
  return (
    `${year}/${month}/${date}`
  );
}

export function findSolvedDuration(startedDate, finishedDate) {
  startedDate = new Date(startedDate);
  finishedDate = new Date(finishedDate);
  const diff = finishedDate - startedDate;
  return (
    timeToString(diff)
  );
}

export function timeToString(time) {
  const diffInHrs = time / 3600000;
  const hh = Math.floor(diffInHrs);

  const diffInMin = (diffInHrs - hh) * 60;
  const mm = Math.floor(diffInMin);

  const diffInSec = (diffInMin - mm) * 60;
  const ss = Math.floor(diffInSec);

  const formattedHH = hh.toString().padStart(2, "0");
  const formattedMM = mm.toString().padStart(2, "0");
  const formattedSS = ss.toString().padStart(2, "0");

  return `${formattedHH}:${formattedMM}:${formattedSS}`;
}

export function findDifMinute(startedDate, finishedDate) {
  const differenceMs = (new Date(finishedDate) - new Date(startedDate));
  const differenceMinute = Math.floor(differenceMs / (1000 * 60));
  return differenceMinute;
}
