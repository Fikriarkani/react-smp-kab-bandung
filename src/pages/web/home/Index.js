//import layout
import React, { useState, useEffect } from "react";

//import layout web
import LayoutWeb from "../../../layouts/Web";

//import Slider component
import Slider from "../../../components/web/Slider";

//import BASE URL API
import Api from "../../../api";

//import cart category component
import CardCategory from "../../../components/utilities/CardCategory";

//import react router dom
import { useHistory } from "react-router-dom";

function Home() {
  //title page
  document.title =
    "GIS SMP Kab. Bandung - Sistem Informasi Geografis Sekolah Menegah Pertama Negeri Kab. Bandung";

  //history
  const history = useHistory();

  //state categories
  const [categories, setCategories] = useState([]);

  //state keyword
  const [keyword, setKeyword] = useState("");

  //function "fetchDataCategories"
  const fetchDataCategories = async () => {
    //fetching Rest API
    await Api.get("/api/web/categories").then((response) => {
      //set data to state
      setCategories(response.data.data);
    });
  };

  //hook
  useEffect(() => {
    //call function "fetchDataCategories"
    fetchDataCategories();
  }, []);

  //function "searchHandler"
  const searchHandler = () => {
    //redirect with params "keyword"
    history.push(`/search?q=${keyword}`);
  };

  return (
    <React.Fragment>
      <LayoutWeb>
        <div className="temp" style={{ height: "10vh" }}></div>
        <div className="container mb-5" style={{ height: "40vh" }}>
          <div className="row h-100 align-items-center" style={{ height: "40vh" }}>
            {/* Sisi Kiri */}
            <div
              className="col-md-5"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h5 style={{ textAlign: "justify", width: "100%" }}>
                Sistem Informasi Geografis Sekolah Menengah Pertama Kab. Bandung
              </h5>
            </div>

            {/* Garis Vertikal */}
            <div className="col-md-1 d-flex justify-content-center">
              <div
                style={{
                  backgroundColor: "black", // Warna garis vertikal
                  height: "100%", // Tinggi penuh sesuai dengan container
                  width: "2px", // Lebar garis vertikal
                }}
              ></div>
            </div>

            {/* Sisi Kanan */}
            <div
              className="col-md-6"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <p style={{ textAlign: "justify", width: "100%" }}>
                Sistem Informasi Geografis SMP Kabupaten Bandung merupakan media
                untuk memberikan informasi kepada publik untuk penyampaian
                informasi sekolah dan memberikan panduan arah menuju SMP bagi
                pengguna.
              </p>
            </div>
          </div>
        </div>

        <div className="container mb-5">
          <div className="row mt-minus-87">
            <div className="col-md-12">
              <div className="card border-0 rounded shadow-sm">
                <div className="card-body">
                  <h5>
                    <i className="fa fa-search"></i> FIND YOUR FAVORITE PLACE
                  </h5>
                  <p>Find your favorite place to vacation with your family!</p>
                  <hr />
                  <input
                    type="text"
                    className="form-control"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchHandler()}
                    placeholder="find your destination here..."
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center mt-4">
            {categories.map((category) => (
              <CardCategory
                key={category.id}
                id={category.id}
                name={category.name}
                slug={category.slug}
                image={category.image}
              />
            ))}
          </div>
        </div>
      </LayoutWeb>
    </React.Fragment>
  );
}

export default Home;
