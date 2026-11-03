import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import "./styles.css";
// Secondary pages are loaded on demand; the shared shell stays mounted while routing.
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() =>
  import("./pages/Projects").then((module) => ({
    default: module.ProjectDetail,
  })),
);
const Education = lazy(() => import("./pages/Education"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
function Page({ children }) {
  return (
    <Suspense
      fallback={
        <p role="status" className="py-16 text-muted">
          Loading page…
        </p>
      }
    >
      {children}
    </Suspense>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="about"
            element={
              <Page>
                <About />
              </Page>
            }
          />
          <Route
            path="projects"
            element={
              <Page>
                <Projects />
              </Page>
            }
          />
          <Route
            path="projects/:slug"
            element={
              <Page>
                <ProjectDetail />
              </Page>
            }
          />
          <Route
            path="education"
            element={
              <Page>
                <Education />
              </Page>
            }
          />
          <Route
            path="services"
            element={
              <Page>
                <Services />
              </Page>
            }
          />
          <Route
            path="contact"
            element={
              <Page>
                <Contact />
              </Page>
            }
          />
          <Route
            path="*"
            element={
              <Page>
                <NotFound />
              </Page>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
