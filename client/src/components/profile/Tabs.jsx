import { motion } from "framer-motion";
import { useState } from "react";
import Inventory from "./Inventory";
import Shop from "./Shop";

const tabs = ["Inventory", "Shop"];

const Tabs = ({ user }) => {
    const [selected, setSelected] = useState(tabs[0]);

    return (
        <div className="flex flex-col px-4">
            <div className="py-2 flex items-center flex-wrap gap-2">
                {tabs.map((tab) => (
                    <Chip
                        text={tab}
                        selected={selected === tab}
                        setSelected={setSelected}
                        key={tab}
                    />
                ))}
            </div>
            {selected === 'Inventory' ?
                (
                    <Inventory user={user} />
                ) : (
                    <Shop user={user} />
                )}
        </div>
    );
};

const Chip = ({
    text,
    selected,
    setSelected,
}) => {
    return (
        <button
            onClick={() => setSelected(text)}
            className={`${selected
                ? "text-white"
                : "text-slate-300 hover:text-slate-200 hover:bg-l-slate"
                } text-sm transition-colors px-2.5 py-0.5 rounded-md relative w-28 h-10`}
        >
            <span className="relative z-10">{text}</span>
            {selected && (
                <motion.span
                    layoutId="pill-tab"
                    transition={{ type: "spring", duration: 0.5 }}
                    className="absolute inset-0 z-0 bg-gradient-to-r from-[#06447c] to-[#06447c] rounded-md"
                ></motion.span>
            )}
        </button>
    );
};

export default Tabs;