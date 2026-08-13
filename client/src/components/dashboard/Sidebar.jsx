

import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Sidebar = ({ items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ☰ Sidebar Menu Icon */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="
          fixed
          left-4
          top-28
          z-100
          flex
          items-center
          justify-center
          w-10
          h-10
          rounded-lg
          bg-gray-800
          text-white
          shadow-lg
          hover:text-amber-300
          lg:hidden
        "
      >
        <FiMenu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="
            fixed
            inset-0
            bg-black/50
            z-90
            lg:hidden
          "
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          left-0
          top-21
          h-[calc(100vh-5rem)]
          w-64
          bg-gray-800
          border-r-2
          border-gray-600
          text-white
          shadow-xl
          z-95
          transition-transform
          duration-300

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Close button */}
        <div className="flex justify-end p-4 lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-2xl hover:text-amber-300"
          >
            <FiX />
          </button>
        </div>

        {/* Menu items */}
        <div className="flex flex-col gap-3 p-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-lg
                  text-lg
                  hover:bg-gray-700
                  hover:text-amber-300
                  transition
                "
              >
                <Icon size={22} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;