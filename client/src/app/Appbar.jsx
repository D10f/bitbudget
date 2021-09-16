const Appbar = ({ handleOpenDrawer }) => {
  return (
    <aside className="appbar">
      <button onClick={handleOpenDrawer}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20">
          <path fill="#f4f4f4" d="M4 12c-1.105 0-2-0.895-2-2s0.895-2 2-2v0c1.105 0 2 0.895 2 2s-0.895 2-2 2v0zM10 12c-1.105 0-2-0.895-2-2s0.895-2 2-2v0c1.105 0 2 0.895 2 2s-0.895 2-2 2v0zM16 12c-1.105 0-2-0.895-2-2s0.895-2 2-2v0c1.105 0 2 0.895 2 2s-0.895 2-2 2v0z"></path>
        </svg>
      </button>
    </aside>
  );
};

export default Appbar;
