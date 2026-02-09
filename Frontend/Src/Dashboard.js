import { useState } from "react";
import { Bar } from "react-chartjs-2";

export default function Dashboard({ email }) {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [hours, setHours] = useState(4);
  const [daysLeft, setDaysLeft] = useState(10);
  const [result, setResult] = useState(null);

  const addSubject = () => {
    setSubjects([...subjects, { name, difficulty }]);
  };

  const submit = async () => {
    const res = await fetch("http://localhost:5000/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjects, hours, days_left: daysLeft }),
    });
    setResult(await res.json());
  };

  return (
    <div>
      <h2>Welcome {email}</h2>

      <input placeholder="Subject" onChange={e => setName(e.target.value)} />
      <input placeholder="Difficulty (1–5)"
             onChange={e => setDifficulty(e.target.value)} />
      <button onClick={addSubject}>Add</button>

      <br />
      <input placeholder="Daily hours" onChange={e => setHours(e.target.value)} />
      <input placeholder="Days left" onChange={e => setDaysLeft(e.target.value)} />

      <button onClick={submit}>Generate Plan</button>

      {result && (
        <>
          <p>Stress Level: {result.stress}</p>
          <p>Workload Score: {result.workload_score}</p>

          <Bar data={{
            labels: result.study_plan.map(p => p.subject),
            datasets: [{
              label: "Study Hours",
              data: result.study_plan.map(p => p.hours)
            }]
          }} />
        </>
      )}
    </div>
  );
}
