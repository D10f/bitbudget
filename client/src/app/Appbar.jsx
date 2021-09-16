const Appbar = ({ handleOpenDrawer }) => {
  return (
    <aside className="appbar">
      <button onClick={handleOpenDrawer}>
        Hello
      </button>
    </aside>
  );
};

export default Appbar;
