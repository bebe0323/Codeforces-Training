import { timeToString } from './date.js';

export function StatBar({ totalDuration, numProblems }) {
  let averageDuration;
  if (numProblems !== 0) {
    averageDuration = timeToString(totalDuration / numProblems);
  } else {
    averageDuration = timeToString(0);
  }
  return (
    <div className="stat-box">
      <p className="filter-text">→ Statistics</p>
      <div className="stat-info">
        <div className="stat">
          <p className="stat-text">Number of solved problems:</p>
          <p className="stat-time">{numProblems}</p>
        </div>

        <div className="stat">
          <p className="stat-text">Total solved duration:</p>
          <p className="stat-time">{timeToString(totalDuration)}</p>
        </div>

        <div className="stat">
          <p className="stat-text">Average solved duration:</p>
          <p className="stat-time">{averageDuration}</p>
        </div>
      </div>
    </div>
  );
}
