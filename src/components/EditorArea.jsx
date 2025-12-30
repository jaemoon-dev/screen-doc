import classNames from "classnames/bind";

import PageLayout from "./PageLayout";
import Tools from "./Tools";
import styles from "./EditorArea.module.scss";

const cx = classNames.bind(styles);

const EditorArea = ({ activePageIndex, activePage, onUpdatePage }) => {
  return (
    <div className={cx("container")}>
      <div className={cx("top")}>
        <Tools />
      </div>
      <div className={cx("content")}>
        <PageLayout
          key={activePageIndex}
          page={activePage}
          onUpdatePage={onUpdatePage}
        />
      </div>
    </div>
  );
};

export default EditorArea;
