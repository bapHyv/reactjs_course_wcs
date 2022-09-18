import { useState, useEffect } from "react";
import axios from "axios";

import Wilder from "./components/Wilder";
import Form from "./components/Form";

import logo from "./logo.svg";
import "./App.css";

function App() {
  const [wilders, setWilders] = useState(null);

  const fetchWilders = async () => {
    const wilders = await axios.get("http://localhost:5000/api/wilder");
    setWilders(wilders.data);
  };

  useEffect(() => {
    fetchWilders();
  }, []);

  const handleDeleteWilder = async (name, id) => {
    const newWilders = wilders.filter((e) => {
      return e.name !== name;
    });
    await axios.delete("http://localhost:5000/api/wilder", { data: { id } });
    setWilders(newWilders);
  };

  return (
    <div>
      <header>
        <div className="container">
          <h1>Wilders Book</h1>
        </div>
      </header>
      <main className="container">
        <h2>Wilders</h2>
        <Form fetchWilders={fetchWilders} />
        <section className="card-row">
          {wilders &&
            wilders.map((e, i) => (
              <Wilder
                key={e.name + i.toString()}
                wilderName={e.name}
                wilderId={e.id}
                description={e.description}
                skills={e.skills}
                handleDeleteWilder={handleDeleteWilder}
              />
            ))}
        </section>
        <h2>Skills</h2>
      </main>
      <footer>
        <div className="container">
          <p>&copy; 2022 Wild Code School</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
