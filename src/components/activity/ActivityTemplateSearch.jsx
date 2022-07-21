import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { debounce } from "../../utility/fns";
import SearchSVG from "../../svg/SearchSVG";

export const ActivityTemplateSearch = ({ title, handleSelect = x => x }) => {
  const [inputState, setInputState] = useState("");
  const [searchState, setSearchState] = useState("");
  const resultsQ = useQuery(
    ['search', 'activity', 'template', searchState],
    ({ signal, queryKey }) => fetch(`/api/search/activity/template/${queryKey[3]}`, { signal }).then(res => res.json()),
    { enabled: !!searchState }
  );

  const handleInput = useMemo(
    () => e => {
      setInputState(e.target.value);
      debounce(e => setSearchState(e.target.value), 500)(e);
    }, []);

  return (
    <div className="bg-neutral-800 border-2 border-neutral-800 rounded-md w-50 px-4 py-2 space-y-2">
      {title && <span className="text-neutral-400 justify-self-center font-semibold">{title}</span>}
      <div className="relative w-full">
        <input
          className={`
            bg-neutral-400
            outline-none border-2 border-neutral-800 rounded-md
            pl-2 pr-8
          `}
          value={inputState}
          onChange={handleInput} />
        <SearchSVG className="absolute w-5 h-5 top-1 right-2" />
      </div>
      <ul className="min-h-[1.5rem] h-max px-1">
        {resultsQ.isSuccess &&
          resultsQ.data.length > 0
          ? resultsQ.data.map(tmpl => <li
            className="text-neutral-400 hover:text-neutral-300 cursor-pointer"
            key={tmpl.id}
            onClick={() => handleSelect(tmpl.id)}
          >{tmpl.name}</li>
          )
          : <li className="text-neutral-400">no results...</li>}
      </ul>
    </div>
  );
};
