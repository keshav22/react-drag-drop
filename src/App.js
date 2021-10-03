import logo from "./logo.svg";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 } from "uuid";
import { useState } from "react";

let itemsFromBackend = [
  { id: v4(), content: "Fist task" },
  { id: v4(), content: "Second task" },
];

let columnsFromBackend = {
  [v4()]: {
    name: "Todo",
    items: itemsFromBackend,
  },
  [v4()]: {
    name: "In progress",
    items: [],
  },
  [v4()]: {
    name: "Doing",
    items: [],
  },
  [v4()]: {
    name: "Done",
    items: [],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;

  const { source, destination } = result;
  if (source.droppableId != destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

const onAddItemClick = (id, columns, setColumns) => {
  let column = columns[id];
  let newItem = { id: v4(), content: "Default text" };
  column.items.push(newItem);
  setColumns({
    ...columns,
    [id]: {
      ...column,
      items: column.items,
    },
  });
}

const onTextChange = (columnId, item, e, coulmns, setColumns) => {
  let newContent = e.target.value;
  let column = coulmns[columnId];
 
  item.content = newContent;
  setColumns({
    ...coulmns,
    [columnId]: {
      ...column,
      items: column.items,
    },
  });
}

function App() {
  const [coulmns, setColumns] = useState(columnsFromBackend);

  return (
    <div className="App">
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, coulmns, setColumns)}
      >
        {Object.entries(coulmns).map(([id, column]) => {
          return (
            <div>
              <h2 style={{ textAlign: "center" }}>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "lightgrey",
                          padding: '4px 4px 38px 4px',
                          width: 250,
                          minHeight: 500,
                        }}
                      >
                        <div>
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        padding: 16,
                                        margin: " 0 0 8px 0",
                                        minHeight: "50px",
                                        backgroundColor: snapshot.isDragging
                                          ? "#263B4A"
                                          : "#456C86",
                                        color: "white",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <input value={item.content} onChange={(e)=>{ onTextChange(id, item, e, coulmns, setColumns)}}></input>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                        </div>
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
                <div
                  style={{
                    position: "absolute",
                    marginTop: "-30px",
                    marginLeft: "10px",
                    cursor: 'pointer'
                  }}
                  onClick={()=>{ onAddItemClick(id, coulmns, setColumns) }}
                >
                  <span>Add {column.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
