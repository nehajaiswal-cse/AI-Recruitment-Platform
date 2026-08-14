export const COLORS = {
  navy: "#0F1F35",
  navyDark: "#091729",
  navyCard: "#142A45",
  navyCardLight: "#1B344F",
  blue: "#3287F5",
  blueDark: "#2374DD",
  teal: "#67C8BC",
  tealDark: "#4FB5AA",
  light: "#F5F8FB",
  lightBlue: "#EEF4F8",
  lightSection: "#EAF2F7",
  section: "#C9D9E6",
  white: "#FFFFFF",
  textDark: "#10233D",
  text: "#304A61",
  muted: "#687D91",
  mutedLight: "#9FB2C7",
  border: "rgba(130,166,195,0.18)",
  track: "#2A435F",
  cardGradient: "linear-gradient(145deg, #142A45 0%, #10233D 100%)",
  stepGradient: "linear-gradient(145deg, #142A45 0%, #10223A 100%)",
};

export const sectionSx = {
  bgcolor: COLORS.section,
  py: 11,
};

export const centeredHeaderSx = {
  textAlign: "center",
  mb: 7,
};

export const primaryButtonSx = {
  bgcolor: COLORS.blue,
  color: COLORS.white,
  fontWeight: 700,
  borderRadius: "11px",
  "&:hover": {
    bgcolor: COLORS.blueDark,
  },
};

export const outlineButtonSx = {
  color: COLORS.white,
  borderColor: "rgba(132,168,199,0.42)",
  fontWeight: 700,
  borderRadius: "11px",
  "&:hover": {
    borderColor: "#7AA3CC",
    bgcolor: "rgba(255,255,255,0.04)",
  },
};

export const flexCenter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const darkCardBase = {
  position: "relative",
  overflow: "hidden",
  background: COLORS.cardGradient,
  border: "1px solid rgba(112,167,194,0.22)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

export const darkCardHover = {
  "&:hover": {
    transform: "translateY(-6px)",
  },
};

export const tealIconBox = {
  bgcolor: "rgba(103,200,188,0.12)",
  color: COLORS.teal,
  ...flexCenter,
};

export const blueIconBox = {
  bgcolor: "rgba(50,135,245,0.12)",
  color: "#65A9F5",
  ...flexCenter,
};

export const sectionContainerSx = {
  position: "relative",
  zIndex: 1,
};

export const sectionLabelSx = {
  color: COLORS.teal,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "1.5px",
  mb: 1.5,
};
