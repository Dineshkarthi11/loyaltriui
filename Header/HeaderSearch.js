import React, { useState } from "react";
import CommandPalette from "react-cmdk";

const CommandPaletteComponent = () => {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const positions = [
    { id: 1, title: "Software Engineer" },
    { id: 2, title: "Product Manager" },
    { id: 3, title: "Data Analyst" },
  ];

  const handlePositionClick = (positionId) => {
    console.log(`Position clicked: ${positionId}`);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#E5E7EB",
        padding: 0,
        margin: 0,
      }}
    >
      <CommandPalette
        onChangeSelected={setSelected}
        onChangeSearch={setSearch}
        onChangeOpen={setIsOpen}
        selected={selected}
        search={search}
        isOpen={isOpen}
        footer={
          <div style={{ paddingInline: "1rem", paddingBlock: "0.75rem" }}>
            <p>Footer content here</p>
          </div>
        }
      >
        <CommandPalette.Page
          id="positions"
          searchPrefix={["General", "Positions"]}
        >
          <CommandPalette.List heading="Positions">
            {positions.map((position) => (
              <CommandPalette.ListItem
                key={position.id}
                onClick={() => handlePositionClick(position.id)}
              >
                {position.title}
              </CommandPalette.ListItem>
            ))}
          </CommandPalette.List>
        </CommandPalette.Page>
      </CommandPalette>
    </div>
  );
};

export default CommandPaletteComponent;
