import React from "react";
import Footer from "./Footer";
import Link from "next/link";
import { useRouter } from "next/router";
import BreadCrumbs from "./BreadCrumbs";

const Navegacion = (props) => {
  const router = useRouter();
  return (
    <>
      <div className="nav-left-sidebar sidebar-dark">
        <div className="menu-list">
          <nav className="navbar navbar-expand-lg navbar-light">
            <a className="d-xl-none d-lg-none">Dashboard</a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav flex-column">
                <li className="nav-divider">Menu</li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="collapse"
                    aria-expanded="true"
                    data-target="#entrada-datos"
                    aria-controls="entrada-datos"
                  >
                    <i className=" fas fa-parachute-box"></i>Entrada de datos
                  </a>
                  <div id="entrada-datos" className="submenu collapse show">
                    <ul className="nav flex-column">
                      <li className="nav-item show">
                        <Link href="/Clientes">
                          <a
                            className={`nav-link ${
                              router.pathname == "/Clientes" ? "active" : ""
                            }`}
                          >
                            {" "}
                            <i className="fas fa-user"></i>
                            Clientes{" "}
                          </a>
                        </Link>
                      </li>
                      <li className="nav-item">
                      <Link href="/Productos">
                          <a
                            className={`nav-link ${
                              router.pathname == "/Productos" ? "active" : ""
                            }`}
                          >
                            {" "}
                            <i className="far fa-money-bill-alt"></i>
                            Productos{" "}
                          </a>
                        </Link>
                      </li>
                      <li className="nav-item">
                      <Link href="/Facturacion">
                          <a
                            className={`nav-link ${
                              router.pathname == "/Facturacion" ? "active" : ""
                            }`}
                          >
                            {" "}
                            <i className="far fa-money-bill-alt"></i>
                            Facturacion{" "}
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      <div className="dashboard-wrapper">
        <div className="container-fluid dashboard-content">
          <BreadCrumbs titulo={props.titulo} />
          {props.children}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Navegacion;
