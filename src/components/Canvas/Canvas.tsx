import { MouseEvent, useRef, useState } from "react";
import "../../styles/Canvas/Canvas.css";
import { IGraph } from "../Graph/Graph";
import Vertex, { Edge } from "./GraphComponent";
import { relPos } from "../../tools/Geometry";

interface Props { 
  graph : IGraph,
  updateGraph : Function
  active : string,
  hovered : string,
  setHoverd : Function,
  getColor : Function
}


const Canvas = (props: Props) => {

  const canvas_ref = useRef<HTMLDivElement>(null);
  const [dragging, isDragging] = useState<boolean>(false);


  const get_local_position = (e: MouseEvent) => {
    const canvas = canvas_ref.current!.getBoundingClientRect();

    return {
      x: relPos(e.clientX,canvas.left,canvas.width),
      y: relPos(e.clientY,canvas.top,canvas.height),
    }
  }

  const update = (e: MouseEvent,id:string="") => {
    props.updateGraph(id, get_local_position(e));

    e.stopPropagation();
    e.preventDefault();
  }
  


  return (
    <div 
    ref = { canvas_ref}
    className="canvas_container"
    onMouseDown={(e: MouseEvent) => update(e)}
    onMouseMove={(e: MouseEvent) => {if(dragging) update(e, props.active)}}
    onContextMenu={(e : MouseEvent) => {e.preventDefault();  console.log(props.graph);}}
    onMouseUp={() => isDragging(false)}>
     <svg width={'100%'} height={'100%'}>
      {Object.entries(props.graph.edges).map((edge) => 
        (!edge[1].double || props.graph.directed) && <Edge 
          key={edge[0]}
          id={edge[0]}
          select={update}
          setHovered={props.setHoverd}
          value={edge[1].weight.toString()}
          getColor={props.getColor}
          position={props.graph.vertices[edge[1].vertices.a].position} 

          position2={props.graph.vertices[edge[1].vertices.b].position} 
          directed={props.graph.directed}
          weighted={props.graph.weighted}
        ></Edge>
      )}

      {Object.entries(props.graph.vertices).map((vertex) => 
        <Vertex 
          key={vertex[0]} 
          id={vertex[0]}
          select={(e:MouseEvent,id:string) => {update(e,id); isDragging(true)}} 
          setHovered={props.setHoverd}
          value={vertex[1].symbol}
          getColor={props.getColor}
          position={vertex[1].position}

          radius={3} 
        ></Vertex>
      )}
      </svg>
    


    </div>
  );
};

export default Canvas;