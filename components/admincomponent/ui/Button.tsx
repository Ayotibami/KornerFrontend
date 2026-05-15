"use client";

export default function Button({ children, type, disabled, onClick }: any) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="bg-[#165ABF] transition-all duration-300 hover:scale-95 active:scale-90 disabled:bg-gray-400 disabled:text-gray-200 disabled:scale-100 disabled:cursor-not-allowed"
      style={{
        borderColor: "transparent",

        padding: "20px 30px",
        borderRadius: "30px",
      }}
    >
      <span
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        {children}
      </span>
    </button>
  );
}
