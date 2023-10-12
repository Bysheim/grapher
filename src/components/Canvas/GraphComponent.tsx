import { MouseEvent, useEffect, useState } from "react";
import "../../styles/Canvas/GraphComponent.css";
import { average, normal } from "../../tools/Geometry";

interface IGraphComponent{
  id : string,
  position : {x: number, y: number}
  value : string,
  setHovered : Function,
  select : Function,
  getColor : Function
}


interface IPropsEdge extends IGraphComponent{
  position2 : {x: number, y: number}
  directed : boolean,
  weighted : boolean

}

interface IPropsVertex extends IGraphComponent{
  radius : number,
}



export const Edge = (props: IPropsEdge) => {
  
  const [offset, setOffset] = useState<{x:number,y:number}>({x:0,y:0});

  const arrow = <defs>
                    <marker id='idle' orient="auto" markerWidth='10' markerHeight='4' refX={20} refY='2'>
                      <path d='M0,0 V4 L6,2 Z' fill={"orange"} />
                    </marker>
                </defs>

  /**
   * offset the edges from the center of the vertex if the graph is directed to make space for two edges between each pair of vertices
   */
  useEffect(() => {
    setOffset((prev) => props.directed ? normal(props.position, props.position2) : {x:0,y:0});
  }, [props.position,props.position2,props.directed])


  return (
    <g 
      onMouseDown={(e: MouseEvent) => props.select(e,props.id)}
      onMouseOver={(e:MouseEvent) => props.setHovered(props.id)}
      onMouseLeave={(e: MouseEvent) => props.setHovered("")}>
      {arrow}
      <line 
        x1={offset.x + props.position.x + '%'} 
        y1={offset.y + props.position.y + '%'} 
        x2={offset.x + props.position2.x + '%'}
        y2={offset.y + props.position2.y + '%'} 
        markerEnd ={props.directed ? "url(#idle)" : ""}
        strokeDasharray={0}
        stroke= {props.getColor(props.id)}
        strokeWidth={2}>

      </line>
      { props.weighted && <foreignObject 
        textAnchor="middle" 
        style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          textAlign: 'center', 
          cursor: 'default',
          color: 'white',
          padding:'1px'}}
        width={props.value.length + 1 + 'ch'}
        height={'2.5ch'}
        fontSize='1em'
        x={'calc(' + average(offset.x + props.position.x,offset.x + props.position2.x) + '% - ' + (props.value.length + 1)/2 + 'ch)'} 
        y={'calc(' + average(offset.y + props.position.y,offset.y + props.position2.y) + '% - 1.25ch)'}>
          {props.value}
      </foreignObject>}
    </g>
  );
};


const Vertex = (props: IPropsVertex) => {
 
  return (
    <g
    onMouseDown={(e: MouseEvent) => props.select(e,props.id)}
    onMouseOver={(e:MouseEvent) => props.setHovered(props.id)}
    onMouseLeave={(e: MouseEvent) => props.setHovered("")}>
      <circle 
        strokeWidth= {2}
        fontSize='1em'
        r={props.radius + 'ch'} 
        stroke={props.getColor(props.id)}
        fill= "black"
        cx={props.position.x + '%'} 
        cy={props.position.y + '%'}>
          
      </circle>
      <text 
        textAnchor="middle"
        alignmentBaseline="middle"
        strokeWidth={2}
        fill="black"
        stroke={props.getColor(props.id)}
        cursor={'default'}
        fontWeight={1}
        fontSize={props.radius/2 + 'ch'}
        x={props.position.x + '%'}
        y={props.position.y + '%'}>
        {props.value}
      </text>
      
    </g>
  );
};

export default Vertex;
