import { map } from "ramda";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../components/Loading";
import { appendElement } from "../../data/Library";
import { useUpdateLibrary } from "../../hooks/queries/library/useUpdateLibrary";
import { useUserLibraries } from "../../hooks/queries/library/useUserLibraries";
import { XCircleSVG } from "../../svg/XCircleSVG";


export const BookmarkDialog = ({ template, stopBookmarking }) => {
  const navigate = useNavigate();
  const librariesQ = useUserLibraries();
  const updateLibraryM = useUpdateLibrary({ onSuccess: () => navigate(-1) });

  return (
    <div className="relative flex flex-col space-y-2 w-max p-2 h-max bg-neutral-300 rounded-md">
      <div className="flex items-center space-x-2 px-8 w-max">
        <span>Save</span>
        <span
          className="bg-neutral-800 text-neutral-300 font-semibold px-1 rounded-md"
        >{template.name}</span>
        <span>to a library:</span>
      </div>
      <ul className="border border-neutral-800 rounded-md py-1">
        {librariesQ.isSuccess &&
          map(lib => <div
            className="flex hover:bg-neutral-400 px-2 items-center"
            key={lib.id}>
            <li
              className="grow cursor-pointer"
              onClick={() => updateLibraryM.mutate(appendElement(template.id)(lib))}
            >{lib.name}</li>

            {updateLibraryM.isLoading &&
              updateLibraryM?.variables?.id === lib.id &&
              <Loading className="w-4 h-4" />}
          </div>)(librariesQ.data)}
        <li
          key="new"
          className="cursor-pointer hover:bg-neutral-400 px-2"
        >+ create new library</li>
      </ul>

      <XCircleSVG
        className="absolute right-0 bottom-full translate-x-1/2 translate-y-1/2 w-6 h-6 text-neutral-300 cursor-pointer"
        fill="rgb(38 38 38)"
        onClick={() => stopBookmarking()} />
    </div>
  );
};
