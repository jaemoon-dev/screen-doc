import classNames from "classnames/bind";
import { RiFile3Fill, RiFilePdf2Fill } from "react-icons/ri";
import { exportToPdf } from "../utils/pdfExport";

import styles from "./Tools.module.scss";

const cx = classNames.bind(styles);

const Tools = () => {
  const replaceToNew = () => {
    window.location.replace("/");
  };

  const doExportToPdf = async () => {
    try {
      const blob = await exportToPdf();

      const handle = await window.showSaveFilePicker({
        suggestedName: "screen-doc.pdf",
        types: [
          {
            description: "PDF Document",
            accept: { "application/pdf": [".pdf"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch (error) {
      if (error.name === "AbortError") return;
      alert("PDF 저장 중 오류가 발생했습니다: " + error.message);
    }
  };

  return (
    <div className={cx("container")}>
      <button
        type="button"
        className={cx("button")}
        onClick={replaceToNew}
        title="Create New File"
      >
        <RiFile3Fill size={20} color="#333333" />
      </button>
      <button
        type="button"
        className={cx("button")}
        onClick={doExportToPdf}
        title="Export To PDF"
      >
        <RiFilePdf2Fill size={20} color="#333333" />
      </button>
    </div>
  );
};

export default Tools;
