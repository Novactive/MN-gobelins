import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import Bricks from "bricks.js";
import notifier from "simple-react-notifications";

notifier.configure({
  autoClose: 3500,
  single: true,
  onlyLast: true,
  animation: {
    in: "notificationSlideDown",
    out: "notificationSlideUp",
    duration: 400,
    timingFunction: "ease-in-out"
  },
  delay: 0,
  width: "100%"
});

import { useSelections } from "../context/selections-context";
import { useAuth } from "../context/auth-context";
import CrossSimple from "../icons/CrossSimple";
import ArrowPrev from "../icons/ArrowPrev";
import PadlockTiny from "../icons/PadlockTiny";
import Button from "../ui/Button";
import CollectionGridItem from "../Collection/CollectionGridItem";
import Notification from "../ui/Notification";

function SelectionDetail(props) {
  const authContext = useAuth();
  const selectionsContext = useSelections();
  const selection_id = parseInt(props.match.params.selection_id, 10);
  const selection = [
    ...selectionsContext.mySelections,
    ...selectionsContext.mobNatSelections,
    ...selectionsContext.userSelections
  ].find(sel => sel.id === selection_id);

  const userId = authContext.data.authenticated && authContext.data.user.id;
  const isMine = Boolean(userId && selection.users.find(u => u.id === userId));

  let masonryContainerRef = React.createRef();
  let bricksInstance;
  useEffect(() => {
    bricksInstance = Bricks({
      container: masonryContainerRef.current,
      packed: "packed",
      sizes: [
        { columns: 2, gutter: 15 },
        { mq: "800px", columns: 3, gutter: 40 },
        { mq: "1600px", columns: 4, gutter: 40 },
        { mq: "2200px", columns: 5, gutter: 40 }
      ],
      position: true
    });
    bricksInstance.pack();
  }, [selection.products]);

  function handleRemoveFromSelection(product) {
    selectionsContext.remove(product.inventory_id, selection.id).then(() => {
      notifier({
        render: ({ id, onClose }) => (
          <Notification
            key={id}
            onClosePanel={onClose}
            message={`L’objet ${
              product.inventory_id
            } a bien été retiré de la sélection`}
          />
        )
      });
    });
  }

  return (
    <div
      className={classNames("SelectionDetail", {
        "SelectionDetail--is-mine": isMine
      })}
    >
      <Link
        className="Selections__close SelectionDetail__close"
        to="/recherche"
      >
        <CrossSimple />
      </Link>
      <Link className="SelectionDetail__back-to-selections" to="/selections/">
        <ArrowPrev />
      </Link>
      <div className="SelectionDetail__header">
        <div className="SelectionDetail__header-left">
          <Button
            dark
            small
            icon="pencil"
            className="SelectionDetail__edit-button"
          >
            modifier
          </Button>
          <hgroup className="SelectionDetail__header-line">
            <h1>{selection.name}</h1>
            {Boolean(selection.products) && Boolean(selection.products.length) && (
              <span className="SelectionsListItem__count">
                {selection.products.length} objet
                {selection.products.length > 1 ? "s" : ""}
              </span>
            )}
            <span> par {selection.users[0].name}</span>
            {selection.public !== true && <PadlockTiny />}
          </hgroup>
        </div>
        <div className="SelectionDetail__header-right">
          {selection.description}
        </div>
      </div>
      <div className="SelectionDetail__grid">
        <div className="SelectionDetail__masonry-container">
          <div ref={masonryContainerRef}>
            {selection.products.map((prod, i) => {
              return (
                <CollectionGridItem
                  className="SelectionDetail__grid-item"
                  datum={prod}
                  onObjectClick={() => null}
                  onSelectionClick={null}
                  onRemoveFromSelection={isMine && handleRemoveFromSelection}
                  key={i}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectionDetail;
