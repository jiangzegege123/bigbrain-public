import { useState } from "react";
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Button onClick={() => setCount((count) => count + 1)} variant="outline">
        count is {count}
      </Button>
    </>
  );
}

export default App;
