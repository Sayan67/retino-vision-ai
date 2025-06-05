import React from "react";
import Form from "./components/Form";
import Results from "./components/Results";

function App() {
  const [loading, setLoading] = React.useState(false);

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 py-20 gap-5 px-8">
      <Form loading={loading} setLoading={setLoading} />
      <Results setLoading={setLoading} loading={loading} />
    </main>
  );
}

export default App;
