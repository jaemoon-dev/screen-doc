import { useState } from "react";

import Sidebar from "./components/Sidebar";
import EditorArea from "./components/EditorArea";
import PageLayout from "./components/PageLayout";
import "./styles/global.scss";

const App = () => {
  const [pages, setPages] = useState([{ title: "", image: null, markers: [] }]);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const handleAddPage = () => {
    setPages([...pages, { title: "", image: null, markers: [] }]);
    setActivePageIndex(pages.length);
  };

  const handleDeletePage = (index) => {
    if (pages.length <= 1) {
      setPages([{ image: null, markers: [] }]);
      setActivePageIndex(0);
      return;
    }

    const newPages = pages.filter((_, pageIndex) => pageIndex !== index);
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
