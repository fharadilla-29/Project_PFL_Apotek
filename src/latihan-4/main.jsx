import { createRoot } from "react-dom/client";
import "./tailwind.css";
import DestinationsApp from "./DestinationsApp";
import DestinationsList from "./DestinationsList";
import DestinationsAdmin from "./DestinationsAdmin";
import ResponsiveDesign from "./ResponsiveDesign";

createRoot(document.getElementById("root")).render(
  <div>
    {/* Main App with Search, Filter, and View Toggle */}
    <DestinationsApp />

    {/* Uncomment untuk melihat individual components */}
    {/* <DestinationsList /> */}
    {/* <DestinationsAdmin /> */}
    {/* <ResponsiveDesign /> */}
  </div>
);