import { MouseEvent } from "react";
import "../../styles/InfoBoard/InfoBoard.css";
import { IGraph } from "../Graph/Graph";


interface Props { 
  graph : IGraph,
  active : string,
  setActive : Function,
  setHovered : Function,
  editWeight : Function,
  editLabel : Function
}


export const InfoBoard = (props: Props) => {
  
  return (
 
      props.active && (
          (props.graph.vertices[props.active] && (
              <div className="infoboard_container">
                  <div>Label: </div>
                  <input type="text" maxLength={5} value={props.graph.vertices[props.active].symbol} onChange={(e:any) => props.editLabel(props.active,e.target.value)}></input>
                  <div>Edges:</div>
                  { props.graph.vertices[props.active].edges.map((edge:string,i:number) => 
                      (!props.graph.edges[edge].double || props.graph.directed) && <div  
                        key={edge + ':label-' + i}
                        className="listed_button"
                        onClick={(e:MouseEvent) => props.setActive(edge)}
                        onMouseOver={(e:MouseEvent) => props.setHovered(edge)}
                        onMouseLeave={(e: MouseEvent) => props.setHovered("")}>
                          {props.graph.vertices[props.graph.edges[edge].vertices.a].symbol + ' - ' + props.graph.vertices[props.graph.edges[edge].vertices.b].symbol}
                        </div>
                  )}
              </div>
          )) || (
              <div className="infoboard_container">
                  {props.graph.weighted && <div>Weight: {props.graph.edges[props.active].weight}</div>}
                  {props.graph.weighted && <input className="ranger" type="range" min={0} max={200} value={props.graph.edges[props.active].weight} onChange={(e:any) => props.editWeight(props.active,e.target.valueAsNumber)}></input>}
                  <div>Noder:</div>
                  {
                    Object.entries(props.graph.edges[props.active].vertices).map((vertex,i) => 
                      <div  
                        key={vertex[1] + ':label-' + i}
                        className="listed_button"
                        onClick={(e:MouseEvent) => props.setActive(vertex[1])}
                        onMouseOver={(e:MouseEvent) => props.setHovered(vertex[1])}
                        onMouseLeave={(e: MouseEvent) => props.setHovered("")}>
                        {props.graph.vertices[vertex[1] as string].symbol}
                      </div>
                    )
                  }
              </div>
          )
      ) || <div className="infoboard_container"></div>

  );
};


export default InfoBoard;
