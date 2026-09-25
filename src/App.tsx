import { Header } from "@/components/Header";
import { TaskBoard } from "@/components/TaskBoard";
import { Pomodoro } from "@/components/Pomodoro";
import { CoachPanel } from "@/components/CoachPanel";
import { useAppState } from "@/hooks/useAppState";

export default function App() {
  const { state, addTask, updateTask, deleteTask, moveTask, addFocusMinutes } = useAppState();

  return (
    <div className="mx-auto min-h-screen max-w-7xl pb-10">
      <Header />
      <main className="grid gap-4 px-4 md:grid-cols-[1fr_320px] md:px-8">
        <TaskBoard
          tasks={state.tasks}
          onAdd={addTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onMove={moveTask}
        />
        <div className="space-y-4">
          <Pomodoro onFocusComplete={addFocusMinutes} />
          <CoachPanel state={state} />
        </div>
      </main>
    </div>
  );
}
