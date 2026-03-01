import React, { useState } from "react";
import { InputForm } from "./components/InputForm";


export default function Homepage() {
  const [isDark, setIsDark] = useState(true);

  return (
    <>
      
      <div style={{ marginTop: "70px" }}>
        <InputForm isDark={isDark} />
      </div>
    </>
  );
}