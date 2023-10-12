import { useState } from "react";
import "../../styles/Graph/Graph.css";
import Canvas from "../Canvas/Canvas";

import def_graph from './default.json';
import InfoBoard from "../InfoBoard/InfoBoard";
import Toolbar from "../ToolBar/Toolbar";

interface IVertex {
    edges : string[]
    position : {x: number, y: number},
    symbol: string
}

interface IEdge {
    vertices : {a: string, b: string},
    weight : number,
    double : boolean,
}

export interface IGraph {
    weighted : boolean,
    directed : boolean,
    vertices : { [id: string] : IVertex },
    edges : { [id: string] : IEdge }
}

interface Props {};

/**
 * Generates a random id on the format "prefix-xxxx"
 * @param prefix indicates what type of component this id is for
 * @param length the lenght of the random symbols following the prefix
 * @returns 
 */
const generateID = (prefix: string, length: number) => {
    const values = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
    var id = prefix + '-';
    for (let i = 0; i < length; i++) {
        let idx = Math.round(Math.random() * (values.length-1));
        id += values[idx];
    }
    return id;
}


const Graph = (props: Props) => {

    const [graph, updateGraph] = useState<IGraph>(def_graph);
    const [active, setActive] = useState<string>("");
    const [hovered, setHoverd] = useState<string>("");
    const [toolState, setToolstate] = useState<string>("select");


    /**
     * Create a new vertex at the given position.
     * @param position 
     */
    const newVertex = (position:{x:number,y:number}) => {
        //Generate the new vertex with a unique id
        const id = generateID('vertex',5);
        const vertex : IVertex = {
            edges : [],
            position : position,
            symbol: ''
        }

        updateGraph((prev: IGraph) => ({...prev, vertices : {...prev.vertices, [id] : vertex}}))
        setActive((prev) => id);
    }

    
    /**
     * Create a new edge between the two given vertices. 
     * @param vertexA 
     * @param vertexB 
     * @returns
     */
    const newEdge = (vertexA : string, vertexB : string) => {

        //make sure that both vertices exists
        if (!(vertexA in graph.vertices && vertexB in graph.vertices)) return
     
        //make sure that the edge is between two different vertices (could be removed in the future)
        if ( vertexA == vertexB ) return;

        let double = false;

        //make sure that this is a unique edge. Only one edge can exist between a given set of vertices AB if the graph is undirected. 
        if ( Object.entries(graph.edges).map(edge => {
            if ( edge[1].vertices.b == vertexA && edge[1].vertices.a == vertexB ) {
                if (graph.directed) double = true;
                else return true;
            }
            return (edge[1].vertices.a == vertexA && edge[1].vertices.b == vertexB);
        }).some(val => val)) return;

        //Generate the new edge with a unique id
        const id = generateID('edge',5);
        const edge : IEdge = {
            vertices : {a: vertexA, b: vertexB},
            weight : 0,
            double : double
        }

        //update the involved vertices to be maped to this new edge
        const updateVerticies = {...graph.vertices};     
        updateVerticies[vertexA] = {...updateVerticies[vertexA], edges :  [...updateVerticies[vertexA].edges, id]}
        updateVerticies[vertexB] = {...updateVerticies[vertexB], edges :  [...updateVerticies[vertexB].edges, id]}

        updateGraph((prev: IGraph) => ({...prev, vertices: updateVerticies, edges : {...prev.edges, [id] : edge}}))
        setActive((prev) => id);
    }

    /**
     * Remove the given vertex, and all edges connected to it
     * @param id the id of the vertex
     * @returns 
     */
    const removeVertex = (id : string) => {
        //make sure that the id exists in the graph
        if (!(id in graph.vertices)) return;

        const updateVerticies = {...graph.vertices};
        const updateEdges = {...graph.edges};

        //remove all connected edges and update their other connected node to no longer refrence this edge.
        updateVerticies[id].edges.forEach(e => {

            let va = updateEdges[e].vertices.a;
            updateVerticies[va] = {...updateVerticies[va], edges :  updateVerticies[va].edges.filter(edge => edge !== e)};
            
            let vb = updateEdges[e].vertices.b;
            updateVerticies[vb] = {...updateVerticies[vb], edges :  updateVerticies[vb].edges.filter(edge => edge !== e)};


            delete updateEdges[e];
        });
    
        delete updateVerticies[id];

        updateGraph((prev: IGraph) => ({...prev, edges : updateEdges, vertices : updateVerticies}))
        setActive((prev) => "");
    }

    /**
     * Remove the given edge
     * @param id the id of the edge to remove
     * @returns 
     */
    const removeEdge = (id : string) => {
        //make sure that the id exists in the graph
        if (!(id in graph.edges)) return;

        const updateVerticies = {...graph.vertices};
        const updateEdges = {...graph.edges};

        //remove the edge and update the connected vertices to no longer refrence this edge
        let va = updateEdges[id].vertices.a
        updateVerticies[va] = {...updateVerticies[va], edges :updateVerticies[va].edges.filter(edge => edge !== id)}
        let vb = updateEdges[id].vertices.b
        updateVerticies[vb] = {...updateVerticies[vb], edges :updateVerticies[vb].edges.filter(edge => edge !== id)}
        
        delete updateEdges[id];

        updateGraph((prev: IGraph) => ({...prev, edges : updateEdges, vertices : updateVerticies}))
        setActive((prev) => "");
    }

 
    /**
     * move a vertex to a new position
     * @param id the id of the vertex to move
     * @param newPosition the new position for the vertex
     */
    const moveVertex = (id: string, newPosition: {x: number, y: number}) => {
        const updateVerticies = {...graph.vertices};     
        updateVerticies[id] = {...updateVerticies[id], position :  newPosition}

        updateGraph((prev: IGraph) => ({...prev, vertices : updateVerticies}))
    }

    /**
     * Set a new weight value for an edge in a weighted graph
     * @param id the id of the edge to update
     * @param value the new weight
     */
    const editWeight = (id: string, value: number) => {    
        const updateEdges = {...graph.edges};
        updateEdges[id] = {...updateEdges[id], weight : value};

        updateGraph((prev: IGraph) => ({...prev, edges : updateEdges}))
    }

    /**
     * Set a new label for a vertex
     * @param id the id of the vertex to update
     * @param value the new label
     */
    const editLabel = (id: string, value: string) => {    
        const updateVerticies = {...graph.vertices};     
        updateVerticies[id] = {...updateVerticies[id], symbol :  value}

        updateGraph((prev: IGraph) => ({...prev, vertices : updateVerticies}))
    }

    /**
     * fetch a color based on if the components id is marked as active, hovered or none of them
     * @param id the id of the graph component
     * @returns a string representing a color name or color code.
     */
    const getColor = (id:string) => {
        return active == id ? "salmon" : hovered == id ? "skyblue" : "#F3E99F"
    };

    /**
     * Checks if an id belongs to a vertex. Should be used with ids generated by the generateID method.
     * @param id the id to check
     * @returns true if the prefix of the id is 'vertex', false if not
     */
    const isVertex = (id: string) => {
        return id.split('-')[0] == 'vertex';
    }

    /**
     * Based on the toolstate, this method determins what to do when this method is called from a component.
     * @param id the id of the component calling the method
     * @param position the position of the cursor at the time of calling this method
     */
    const update = (id : string = "", position : {x:number, y: number}) => {
        let vertex = isVertex(id); 
        
        switch (toolState) {
            case 'select':
                if ( vertex ) moveVertex(id,position);
                if ( id != "") setActive((prev) => id);
                break;
            case 'delete':
                vertex ? removeVertex(id) : removeEdge(id);
                break;
            case 'add':
                if ( vertex && isVertex(active) ) newEdge(active,id);
                else if ( id == "" ) newVertex(position);
                else setActive((prev) => id);
                break;
            default:
                break;
        }
    }

    return (
        <div className="graph-container">
            <div className="graph-header">
                Grapher
            </div>
            <div className="graph-body">
                <InfoBoard 
                    graph={graph} 
                    active={active}
                    setActive={setActive}
                    setHovered={setHoverd}
                    editWeight={editWeight}
                    editLabel={editLabel}></InfoBoard>

                <Canvas 
                    graph={graph}
                    updateGraph={update}
                    active={active}
                    hovered={hovered}
                    setHoverd={setHoverd}
                    getColor={getColor}
                ></Canvas>

                <div> **algoritmeverktøy**</div>

            </div>
            <div className="graph-footer">
                <div onChange={() => setActive("")}>
                    <label>
                        <input type="checkbox" checked={graph.directed} onChange={() => updateGraph((prev: IGraph) => ({...prev, directed : !prev.directed}))}/>
                        Directed
                    </label>
                    <label>
                        <input type="checkbox" checked={graph.weighted} onChange={() => updateGraph((prev: IGraph) => ({...prev, weighted : !prev.weighted}))}/>
                        Weighted
                    </label>
                </div>
                
                <Toolbar toolState={toolState} setToolState={(newState:string) => {setToolstate((prev) => newState); setActive('')}}></Toolbar>
            </div>







        </div>
    );
};

export default Graph;