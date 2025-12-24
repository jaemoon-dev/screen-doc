import { useRef } from "react";

import classNames from "classnames/bind";
import { RiCloseLine } from "react-icons/ri";
import styles from "./PageLayout.module.scss";

const cx = classNames.bind(styles);

const PageLayout = ({ page, onUpdatePage, isPreview = false }) => {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const dragInfo = useRef({});

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      onUpdatePage({ ...page, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onUpdatePage({ ...page, image: null, markers: [] });
  };

  const handleAddMarker = (x, y) => {
    const newMarker = {
      id: Date.now(),
      number: page.markers.length + 1,
      x,
      y,
      description: "",
    };

    onUpdatePage({
      ...page,
      markers: [...page.markers, newMarker],
    });
  };

  const handleDoubleClick = (e) => {
    if (!page.image) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    handleAddMarker(x, y);
  };

  const onDrag = (e) => {
    const { element } = dragInfo.current;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
    );
    const y = Math.max(
      0,
      Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)
    );

    element.style.left = `${x}%`;
    element.style.top = `${y}%`;

    dragInfo.current.lastX = x;
    dragInfo.current.lastY = y;
  };

  const endDrag = () => {
    const { id, lastX, lastY } = dragInfo.current;
    const updatedMarkers = page.markers.map((marker) =>
      marker.id === id ? { ...marker, x: lastX, y: lastY } : marker
    );

    onUpdatePage({ ...page, markers: updatedMarkers });

    dragInfo.current = {};
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", endDrag);
  };

  const handleMarkerMouseDown = (e, id) => {
    dragInfo.current = {
      id,
      element: e.currentTarget,
      lastX: parseFloat(e.currentTarget.style.left),
      lastY: parseFloat(e.currentTarget.style.top),
    };

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", endDrag);
  };

  const updateMarkerDescription = (id, text) => {
    const updatedMarkers = page.markers.map((marker) =>
      marker.id === id ? { ...marker, description: text } : marker
    );

    onUpdatePage({ ...page, markers: updatedMarkers });
  };

  const removeMarker = (id) => {
    const updatedMarkers = page.markers
      .filter((marker) => marker.id !== id)
      .map((marker, index) => ({ ...marker, number: index + 1 }));

    onUpdatePage({ ...page, markers: updatedMarkers });
  };

  if (isPreview) {
    return (
      <div className={cx("container")}>
        <div className={cx("header")}>
          <div className={cx("title")}>{page.title || "Untitled"}</div>
        </div>
        <div className={cx("content")}>
          <div className={cx("left")}>
            {page.image ? (
              <>
                <div className={cx("image")}>
                  <img src={page.image} draggable="false" />
                </div>
                <div className={cx("markers")}>
                  {page.markers.map((marker) => (
                    <div
                      key={marker.id}
                      className={cx("marker")}
                      style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    >
                      {marker.number}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={cx("placeholder")} />
            )}
          </div>
          <div className={cx("right")}>
            <div className={cx("list")}>
              {page.markers.map((marker) => (
                <div key={marker.id} className={cx("item")}>
                  <div className={cx("number")}>{marker.number}</div>
                  <div className={cx("text")}>{marker.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <input
          className={cx("titleInput")}
          value={page.title}
          onChange={(e) => onUpdatePage({ ...page, title: e.target.value })}
          placeholder="Untitled"
        />
      </div>
      <div className={cx("content")}>
        <div
          className={cx("left")}
          ref={containerRef}
          onDoubleClick={handleDoubleClick}
        >
          {page.image ? (
            <>
              <div className={cx("image")}>
                <img src={page.image} draggable="false" />
              </div>
              <div className={cx("markers")}>
                {page.markers.map((marker) => (
                  <div
                    key={marker.id}
                    className={cx("marker")}
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    onMouseDown={(e) => handleMarkerMouseDown(e, marker.id)}
                  >
                    {marker.number}
                    <button
                      className={cx("button")}
                      onClick={() => removeMarker(marker.id)}
                    >
                      <RiCloseLine size={10} color="white" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                className={cx("button")}
                onClick={handleRemoveImage}
                title="Remove Image"
              >
                <RiCloseLine size={16} color="white" />
              </button>
            </>
          ) : (
            <div
              className={cx("placeholder")}
              onClick={() => fileInputRef.current?.click()}
            >
              <span>Click to upload screen image</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
        </div>
        <div className={cx("right")}>
          <div className={cx("list")}>
            {page.markers.length === 0 && (
              <div className={cx("empty")}>Add markers for descriptions.</div>
            )}
            {page.markers.map((marker) => (
              <div key={marker.id} className={cx("item")}>
                <div className={cx("number")}>{marker.number}</div>
                <textarea
                  placeholder={`Marker ${marker.number}`}
                  value={marker.description}
                  onChange={(e) =>
                    updateMarkerDescription(marker.id, e.target.value)
                  }
                />
                <button
                  className={cx("button")}
                  onClick={() => removeMarker(marker.id)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
