import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Edit2, ChevronDown, Check } from "lucide-react";

interface Node {
  id: string;
  name: string;
  relation: string;
  x: number;
  y: number;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface TreeBuilderProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onChange?: (nodes: Node[], edges: Edge[]) => void;
  readOnly?: boolean;
  familyName?: string;
}

export function TreeBuilder({ initialNodes = [], initialEdges = [], onChange, readOnly = false, familyName }: TreeBuilderProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes.length ? initialNodes : [{ id: "root", name: familyName || "أنت", relation: "نقطة البداية", x: 300, y: 50 }]);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  
  // Sync root node name with familyName if it hasn't been heavily manually changed and it's the beginning
  useEffect(() => {
    if (!initialNodes.length && familyName) {
      setNodes(prev => prev.map(n => n.id === "root" ? { ...n, name: familyName } : n));
    }
  }, [familyName, initialNodes.length]);
  
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRelation, setEditRelation] = useState("");

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    if (readOnly) return;
    e.stopPropagation();
    setDraggingNode(id);
    setSelectedNode(id);
    const node = nodes.find(n => n.id === id);
    if(node) {
      setEditName(node.name);
      setEditRelation(node.relation);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (readOnly || !draggingNode || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes(prev => prev.map(n => n.id === draggingNode ? { ...n, x, y } : n));
  };

  const handlePointerUp = () => {
    if (readOnly) return;
    setDraggingNode(null);
    if (onChange) onChange(nodes, edges);
  };

  const addRelative = (parentId: string) => {
    const parent = nodes.find(n => n.id === parentId);
    if (!parent) return;

    const newId = Math.random().toString(36).substring(7);
    const newNode = {
      id: newId,
      name: "",
      relation: "إبن",
      x: parent.x,
      y: parent.y + 100
    };
    
    const newEdge = {
      id: `${parentId}-${newId}`,
      source: parentId,
      target: newId
    };

    const newNodes = [...nodes, newNode];
    const newEdges = [...edges, newEdge];
    setNodes(newNodes);
    setEdges(newEdges);
    if (onChange) onChange(newNodes, newEdges);
  };

  const deleteNode = (id: string) => {
    if (id === "root" || readOnly) return; // Keep root
    const newNodes = nodes.filter(n => n.id !== id);
    const newEdges = edges.filter(e => e.source !== id && e.target !== id);
    setNodes(newNodes);
    setEdges(newEdges);
    if (onChange) onChange(newNodes, newEdges);
    setSelectedNode(null);
  };

  const saveEdit = () => {
    if(!selectedNode || readOnly) return;
    const newNodes = nodes.map(n => n.id === selectedNode ? { ...n, name: editName, relation: editRelation } : n);
    setNodes(newNodes);
    if (onChange) onChange(newNodes, edges);
    setIsEditing(false);
  }

  return (
    <div className="flex flex-col h-[600px] border border-brand-200 rounded-2xl overflow-hidden bg-brand-50 relative">
      <div 
        ref={containerRef}
        className="flex-1 relative cursor-crosshair overflow-auto"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map(edge => {
            const source = nodes.find(n => n.id === edge.source);
            const target = nodes.find(n => n.id === edge.target);
            if (!source || !target) return null;
            return (
              <line
                key={edge.id}
                x1={source.x}
                y1={source.y + 20}
                x2={target.x}
                y2={target.y - 20}
                stroke="#d0a46d"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {nodes.map(node => (
          <div
            key={node.id}
            onPointerDown={(e) => handlePointerDown(e, node.id)}
            className={`absolute flex flex-col items-center justify-center p-3 rounded-xl border-2 shadow-sm ${readOnly ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'} transform -translate-x-1/2 -translate-y-1/2 min-w-[120px] transition-colors
              ${selectedNode === node.id && !readOnly ? 'border-brand-600 bg-white' : 'border-brand-300 bg-brand-50 hover:border-brand-400'}`}
            style={{ left: node.x, top: node.y }}
          >
             <div className="text-sm font-bold text-brand-900">{node.name}</div>
             <div className="text-xs text-brand-600">{node.relation}</div>
             
             {selectedNode === node.id && !readOnly && (
               <div className="absolute -bottom-10 flex gap-2">
                 <button onClick={(e) => { e.stopPropagation(); addRelative(node.id); }} className="p-1.5 bg-brand-600 text-white rounded-full hover:bg-brand-700 shadow-md">
                   <Plus className="w-4 h-4" />
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="p-1.5 bg-white text-brand-600 border border-brand-200 rounded-full hover:bg-brand-50 shadow-md">
                   <Edit2 className="w-4 h-4" />
                 </button>
                 {node.id !== "root" && (
                   <button onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }} className="p-1.5 bg-white text-red-500 border border-red-200 rounded-full hover:bg-red-50 shadow-md">
                     <Trash2 className="w-4 h-4" />
                   </button>
                 )}
               </div>
             )}
          </div>
        ))}
      </div>
      
      {/* Editor Panel */}
      {isEditing && selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-xl shadow-lg border border-brand-200 flex flex-col sm:flex-row gap-4 items-end">
           <div className="flex-1 w-full">
             <label className="block text-xs font-medium text-brand-700 mb-1">الاسم</label>
             <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full border border-brand-200 rounded-md px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500" />
           </div>
           <div className="flex-1 w-full">
             <label className="block text-xs font-medium text-brand-700 mb-1">الصلة</label>
             <input type="text" value={editRelation} disabled className="w-full border border-gray-100 bg-gray-50 rounded-md px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
           </div>
           <button onClick={saveEdit} className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700 flex items-center gap-2 text-sm font-medium">
             <Check className="w-4 h-4" /> حفظ
           </button>
        </div>
      )}
    </div>
  );
}
