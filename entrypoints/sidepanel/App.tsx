import './App.css';

function App() {
  return (
    <main className="panel-shell">
      <header className="panel-header">
        <div>
          <p className="panel-eyebrow">Path of Exile Trade</p>
          <h1>Mercenary Support Filter</h1>
        </div>
      </header>

      <section className="empty-state" aria-labelledby="empty-state-title">
        <h2 id="empty-state-title">No filters configured</h2>
        <p>
          Open a mercenary trade search, then add skills and their linked
          supports here.
        </p>
      </section>
    </main>
  );
}

export default App;
