import StoriInput from "./StoriInput";

export default function SubsideTitle({
  mode,
  placeholder,
  subTitle,
  setSubTitle,
}) {
  return mode === "write" ? (
    <StoriInput
      mode={mode}
      placeholder={placeholder}
      value={subTitle}
      onChange={setSubTitle}
    ></StoriInput>
  ) : (
    <p
      style={{
        color: "grey",
        fontSize: 16,
      }}
    >
      {subTitle || "Subtitle goes here"}
    </p>
  );
}
