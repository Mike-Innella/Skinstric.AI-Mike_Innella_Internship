import React from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "../UI/Styles/Components/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const handleDemographicsClick = () => {
    navigate("/analysis");
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <main className="element">
      <section className="container">
        <div className="background-layer">
          <div className="header-section">
            {/* Temporarily removed image until assets are available */}
            {/* <img className="rombuses" alt="Decorative rombuses" src={rombuses} /> */}
            <Header title="ANALYSIS" />
            <h2 className="a-i-analysis">A. I. ANALYSIS</h2>
            <p className="a-i-has-estimated">
              A. I. HAS ESTIMATED THE FOLLOWING. <br />
              FIX ESTIMATED INFORMATION IF NEEDED.
            </p>
            {/* Temporarily removed image until assets are available */}
            {/* <img className="image" alt="Indicator icon" src={image219} /> */}
          </div>

          <div className="diamond-grid">
            <div className="diamond-item" onClick={handleDemographicsClick}>
              <div className="diamond-content light">
                <span className="label">DEMOGRAPHICS</span>
              </div>
            </div>

            <div className="diamond-item bottom-left">
              <div className="diamond-content dark">
                <span className="label">SKIN TYPE DETAILS</span>
              </div>
            </div>

            <div className="diamond-item top-right">
              <div className="diamond-content dark">
                <span className="label">COSMETIC CONCERNS</span>
              </div>
            </div>

            <div className="diamond-item bottom-right">
              <div className="diamond-content dark">
                <span className="label">WEATHER</span>
              </div>
            </div>
          </div>
        </div>

        <div className="button-group left">
          {/* Temporarily removed image until assets are available */}
          {/* <img className="buttin-icon-shrunk" alt="Back icon" src={buttinIconShrunk} /> */}
          <button className="button" onClick={handleBackClick}>BACK</button>
        </div>

        <div className="button-group right">
          <button className="text-wrapper">GET SUMMARY</button>
          {/* Temporarily removed image until assets are available */}
          {/* <img className="buttin-icon-shrunk" alt="Summary icon" src={image} /> */}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
