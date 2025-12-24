import { useEffect, useRef } from "react";
import classNames from "classnames/bind";
import { RiCloseLine } from "react-icons/ri";

import PageLayout from "./PageLayout";
import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);

const Sidebar = ({
  pages,
  activePageIndex,
  setActivePageIndex,
  onAddPage,
  onDeletePage,
}) => {
  const bodyRef = useRef();

  useEffect(() => {
    bodyRef.current.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [pages.length]);

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <div className={cx("title")}>PAGES</div>
      </div>
      <div ref={bodyRef} className={cx("body")}>
        {pages.map((page, index) => (
          <div
            key={index}
            className={cx([
              "page",
              {
                active: activePageIndex === index,
              },
            ])}
            onClick={() => setActivePageIndex(index)}
          >
            <div className={cx("preview")}>
              <button
                className={cx("button")}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePage(index);
                }}
              >
                <RiCloseLine size={12} color="white" />
              </button>
              <div className={cx("scaler")}>
                <PageLayout page={page} isPreview={true} />
              </div>
            </div>
            <span className={cx("label")}>Page {index + 1}</span>
          </div>
        ))}
      </div>
      <div className={cx("footer")}>
        <button className={cx("button")} onClick={onAddPage} title="Add Page">
          + Add Page
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
