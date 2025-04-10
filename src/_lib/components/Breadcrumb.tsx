import { FC } from "react";

export type TBreadcrumbProps = {
  activeFolder: Folder | undefined;
  activeNote: Note | undefined;
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
};

export const Breadcrumb: FC<TBreadcrumbProps> = ({ activeFolder, activeNote, currentStep, setCurrentStep }) => {
  return (
    <nav className="p-2 w-full text-sm bg-primary-darker flex items-center">
      <ul className="flex items-center gap-2">
        <li>
          <button
            onClick={() => setCurrentStep(0)}
            className="underline hover:text-secondary"
          >
            Folder
          </button>
        </li>
        {((currentStep === 1 && activeFolder) || (activeNote && activeFolder)) && (
          <>
            <li className="h-[20px] flex items-center">
              <img src="/chevron-right.svg" alt="arrow right icon" height={6} width={6}/>
            </li>
            <li>
              <button
                onClick={() => setCurrentStep(1)}
                className="underline hover:text-secondary"
              >
                {activeFolder.name}
              </button>
            </li>
          </>
        )}
        {currentStep === 2 && activeNote && (
          <>
            <li className="h-[20px] flex items-center">
              <img src="/chevron-right.svg" alt="arrow right icon" height={6} width={6}/>
            </li>
            <li>
              <span>{activeNote.title}</span>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
