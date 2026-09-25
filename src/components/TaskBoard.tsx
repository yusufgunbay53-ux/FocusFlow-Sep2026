import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Check, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { ColumnId, Priority, Task } from "@/types/models";

const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: "todo", title: "Yapılacaklar" },
  { id: "doing", title: "Yapılıyor" },
  { id: "done", title: "Tamamlandı" },
];

const PRIORITY: Record<Priority, string> = {
  low: "bg-slate-500/20 text-slate-200",
  medium: "bg-amber-400/15 text-amber-200",
  high: "bg-rose-400/15 text-rose-200",
};

const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
};

function Card({
  task,
  onEdit,
  onDelete,
  onToggle,
}: {
  task: Task;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (t: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
    data: { column: task.column },
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="glass group rounded-xl p-3 shadow-sm transition hover:border-neon/40"
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-0.5 cursor-grab text-cyan-100/30 hover:text-neon"
          {...attributes}
          {...listeners}
          aria-label="Sürükle"
        >
          <GripVertical size={16} />
        </button>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium ${task.column === "done" ? "text-cyan-100/40 line-through" : ""}`}>
            {task.title}
          </p>
          {task.notes && <p className="mt-1 text-xs text-cyan-100/45">{task.notes}</p>}
          <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] ${PRIORITY[task.priority]}`}>
            {PRIORITY_LABEL[task.priority]}
          </span>
        </div>
        <div className="flex gap-1 opacity-80 md:opacity-0 md:group-hover:opacity-100">
          <button onClick={() => onToggle(task)} className="rounded-lg p-1 hover:bg-neon/10" aria-label="Tamamla">
            <Check size={14} className="text-neon" />
          </button>
          <button onClick={() => onEdit(task)} className="rounded-lg p-1 hover:bg-white/5" aria-label="Düzenle">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(task.id)} className="rounded-lg p-1 hover:bg-rose-500/10" aria-label="Sil">
            <Trash2 size={14} className="text-rose-300" />
          </button>
        </div>
      </div>
    </article>
  );
}

function Column({
  id,
  title,
  tasks,
  children,
}: {
  id: ColumnId;
  title: string;
  tasks: Task[];
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <section className="glass flex min-h-[280px] flex-col rounded-2xl p-3 md:p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-cyan-50">{title}</h3>
        <span className="rounded-full bg-neon/10 px-2 py-0.5 text-[11px] text-neon">{tasks.length}</span>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-1 flex-col gap-2">
          {children}
        </div>
      </SortableContext>
    </section>
  );
}

export function TaskBoard({
  tasks,
  onAdd,
  onUpdate,
  onDelete,
  onMove,
}: {
  tasks: Task[];
  onAdd: (title: string, priority: Priority, notes?: string) => void;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, column: ColumnId) => void;
}) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [editing, setEditing] = useState<Task | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const grouped = useMemo(
    () => ({
      todo: tasks.filter((t) => t.column === "todo"),
      doing: tasks.filter((t) => t.column === "doing"),
      done: tasks.filter((t) => t.column === "done"),
    }),
    [tasks]
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    if (editing) {
      onUpdate(editing.id, { title: title.trim(), notes: notes.trim() || undefined, priority });
      setEditing(null);
    } else {
      onAdd(title.trim(), priority, notes.trim() || undefined);
    }
    setTitle("");
    setNotes("");
    setPriority("medium");
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const overId = String(over.id);
    const column = (["todo", "doing", "done"].includes(overId)
      ? overId
      : tasks.find((t) => t.id === overId)?.column) as ColumnId | undefined;
    if (column) onMove(String(active.id), column);
  }

  return (
    <div className="page-enter space-y-4">
      <form onSubmit={submit} className="glass grid gap-2 rounded-2xl p-3 md:grid-cols-[1fr_1fr_auto_auto] md:p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={editing ? "Görevi güncelle..." : "Yeni görev ekle..."}
          className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-neon/50"
        />
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Not (opsiyonel)"
          className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-neon/50"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
        >
          <option value="low">Düşük</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
        </select>
        <button
          type="submit"
          className="glow-btn inline-flex items-center justify-center gap-1 rounded-xl bg-neon px-4 py-2 text-sm font-semibold text-night"
        >
          <Plus size={16} />
          {editing ? "Kaydet" : "Ekle"}
        </button>
      </form>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
        <div className="grid gap-3 md:grid-cols-3">
          {COLUMNS.map((col) => (
            <Column key={col.id} id={col.id} title={col.title} tasks={grouped[col.id]}>
              {grouped[col.id].map((task) => (
                <Card
                  key={task.id}
                  task={task}
                  onEdit={(t) => {
                    setEditing(t);
                    setTitle(t.title);
                    setNotes(t.notes ?? "");
                    setPriority(t.priority);
                  }}
                  onDelete={onDelete}
                  onToggle={(t) => onMove(t.id, t.column === "done" ? "todo" : "done")}
                />
              ))}
            </Column>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
