const RecentUpdatesWidget = ({
  updates = [
    { title: "Bug fix: Login issue", status: "Done", color: "text-violet-400" },
    { title: "Feature: User profile", status: "In Progress", color: "text-yellow-300" },
  ],
}) => {
  return (
    <ul className="space-y-2">
      {updates.map((item, index) => (
        <li
          key={index}
          className="p-2 border border-white/10 rounded flex justify-between items-center hover:bg-white/5 transition-colors"
        >
          <span className="font-extralight">{item.title}</span>
          <span className={`${item.color} text-sm font-extralight`}>
            {item.status}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default RecentUpdatesWidget;
