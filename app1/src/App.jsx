import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";

const App = React.lazy(() => import("shell/App"));

const InternalApp = () => {
  return (
    <Suspense fallback={() => <>Loading</>}>
      <App />
    </Suspense>
  );
};

ReactDOM.render(<InternalApp />, document.getElementById("app"));
