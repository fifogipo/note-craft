import { FC } from "react";
import Image from "next/image";

export type TBreadcrumbProps = {
  activeFolder: Folder | undefined;
  activeNote: Note | undefined;
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
};

export const Breadcrumb: FC<TBreadcrumbProps> = ({ activeFolder, activeNote, currentStep, setCurrentStep }) => {
  return (
    <nav
      className="p-2 w-full text-sm bg-primary-darker flex items-center"
      aria-label="Breadcrumb"
    >
      <ul
        className="flex items-center gap-2"
        role="list"
      >
        <li role="listitem">
          <button
            onClick={() => setCurrentStep(0)}
            className="underline hover:text-secondary"
            aria-label="Vai alle cartelle"
            aria-current={currentStep === 0 ? "page" : undefined}
          >
            Folder
          </button>
        </li>
        {((currentStep === 1 && activeFolder) || (activeNote && activeFolder)) && (
          <>
            <li
              role="listitem"
              className="h-[20px] flex items-center"
              aria-hidden="true"
            >
              <Image
                src="/chevron-right.svg"
                alt=""
                height={6}
                width={6}
              />
            </li>
            <li role="listitem">
              <button
                onClick={() => setCurrentStep(1)}
                className="underline hover:text-secondary"
                aria-label={`Vai alla cartella ${activeFolder?.name}`}
                aria-current={currentStep === 1 ? "page" : undefined}
              >
                {activeFolder.name}
              </button>
            </li>
          </>
        )}
        {currentStep === 2 && activeNote && (
          <>
            <li
              role="listitem"
              className="h-[20px] flex items-center"
              aria-hidden="true"
            >
              <Image
                src="/chevron-right.svg"
                alt=""
                height={6}
                width={6}
              />
            </li>
            <li role="listitem">
              <span aria-current="page">{activeNote.title}</span>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
