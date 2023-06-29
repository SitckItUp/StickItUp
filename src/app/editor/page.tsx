export default function Editor() {
  const icons: React.ReactNode[] = [1, 2, 3, 4].map((el) => {
    return (
      <div
        key={el}
        className="flex items-center justify-center h-20 hover:bg-slate-600 hover:cursor-pointer"
      >
        <span className="text-center">{el}</span>
      </div>
    );
  });

  return (
    <div className="flex w-full h-full rounded">
      <div className="shadow-inner flex items-center justify-center w-9/12 bg-slate-100">
        <div>Editor</div>
      </div>
      <div className="w-2/12 bg-slate-600"></div>
      <div className="flex-col items-center w-1/12 bg-slate-800">{icons}</div>
    </div>
  );
}
