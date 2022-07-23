import React from "react";

function RadialBackground(props) {
  return (
    <div className="page-layout">
      {props.children}
      <style jsx global>{`
        body {
          background: radial-gradient(#1572cf, #1f1013);
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}

export default RadialBackground;
