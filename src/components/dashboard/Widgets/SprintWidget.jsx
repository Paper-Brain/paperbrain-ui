const SprintWidget = ({ progress = 65, totalTasks = 20, completedTasks = 13 }) => {
  return (
    <div className="space-y-4">
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-yellow-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-400 font-extralight">
        {progress}% completed ({completedTasks}/{totalTasks} tasks)
      </p>
    </div>
  );
};

export default SprintWidget;
