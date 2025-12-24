import { useState } from "react";

import Sidebar from "./components/Sidebar";
import EditorArea from "./components/EditorArea";
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
    </div>
  );
};

export default App;
