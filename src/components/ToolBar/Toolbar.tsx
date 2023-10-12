

interface Props { 
  toolState : string,
  setToolState : Function,
}


export const Toolbar = (props: Props) => {
  

  return (
    <div>
      <label className="container">
          <input id="select" type="radio" name="radio" checked={props.toolState == 'select'} onChange={(e) => props.setToolState('select')}/>
          Select
      </label>
      <label className="container">
          <input id="add" type="radio" name="radio" checked={props.toolState == 'add'} onChange={(e) => props.setToolState('add')}/>
          Add
      </label>
      <label className="container">
          <input id="delete" type="radio" name="radio" checked={props.toolState == 'delete'} onChange={(e) => props.setToolState('delete')}/>
          Delete
      </label>
  </div>

  );
};


export default Toolbar;
