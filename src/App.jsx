import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import EditorArea from "./components/EditorArea";
import PageLayout from "./components/PageLayout";
import "./styles/global.scss";

const App = () => {
  const createPage = () => ({ title: "", image: null, markers: [] });

  const [pages, setPages] = useState([createPage()]);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const handleAddPage = () => {
    setPages([...pages, createPage()]);
    setActivePageIndex(pages.length);
  };

  const handleDeletePage = (targetIndex) => {
    if (pages.length === 1) {
      setPages([createPage()]);
      setActivePageIndex(0);
      return;
    }

    const newPages = [...pages];
    newPages.splice(targetIndex, 1);
    setPages(newPages);

    if (activePageIndex >= newPages.length) {
      setActivePageIndex(newPages.length - 1);
    }
  };

  const handleUpdatePage = (updatedPage) => {
    const newPages = [...pages];
    newPages[activePageIndex] = updatedPage;
    setPages(newPages);
  };

  const handleOpenPages = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPages(parsed);
          } else if (Array.isArray(parsed)) {
            setPages([createPage()]);
          }
          setActivePageIndex(0);
        } catch {
          //
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.metaKey && event.key.toLowerCase() === "o") {
        event.preventDefault();
        handleOpenPages();
        return;
      }

      if (event.metaKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        const payload = JSON.stringify(pages, null, 2);
        const blob = new Blob([payload], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `pages_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pages]);

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Sidebar
        pages={pages}
        activePageIndex={activePageIndex}
        setActivePageIndex={setActivePageIndex}
        onAddPage={handleAddPage}
        onDeletePage={handleDeletePage}
      />
      <EditorArea
        activePageIndex={activePageIndex}
        activePage={pages[activePageIndex]}
        onUpdatePage={handleUpdatePage}
      />
      {/* PDF 출력을 위한 숨겨진 컨테이너 */}
      <div
        id="export-container"
        style={{
          position: "absolute",
          top: "-10000px",
          left: "-10000px",
          width: "1123px", // A4 Landscape width
        }}
      >
        {pages.map((page, index) => (
          <div key={index} className="export-page" data-page-index={index}>
            <PageLayout page={page} isPreview={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
