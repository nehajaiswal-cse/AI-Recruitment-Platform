
export const COLORS = {
  // Brand colors — remain the same in both themes
  blue: "#3287F5",
  blueDark: "#2374DD",
  teal: "#67C8BC",
  tealDark: "#4FB5AA",
  white: "#FFFFFF",

  // These are kept for places where you still need static colors
  navy: "#0F1F35",
  navyDark: "#091729",
  navyCard: "#142A45",
  navyCardLight: "#1B344F",

  light: "#F5F8FB",
  lightBlue: "#EEF4F8",
  lightSection: "#EAF2F7",
  section: "#C9D9E6",

  textDark: "#10233D",
  text: "#304A61",
  muted: "#687D91",
  mutedLight: "#9FB2C7",

  border: "rgba(130,166,195,0.18)",
  track: "#2A435F",

  // Kept for backward compatibility
  cardGradient:
    "linear-gradient(145deg, #142A45 0%, #10233D 100%)",

  stepGradient:
    "linear-gradient(145deg, #142A45 0%, #10223A 100%)",
};


// ======================================================
// SECTION
// ======================================================

export const sectionSx = {
  bgcolor: "background.default",
  py: 11,
};

export const centeredHeaderSx = {
  textAlign: "center",
  mb: 7,
};


// ======================================================
// BUTTONS
// ======================================================

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
  color: "text.primary",
  borderColor: "divider",
  fontWeight: 700,
  borderRadius: "11px",

  "&:hover": {
    borderColor: COLORS.blue,
    bgcolor: "action.hover",
  },
};


// ======================================================
// COMMON
// ======================================================

export const flexCenter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};


// ======================================================
// CARDS
// ======================================================

export const darkCardBase = {
  position: "relative",
  overflow: "hidden",

  // IMPORTANT:
  // These now follow MUI theme
  bgcolor: "background.paper",
  color: "text.primary",

  border: "1px solid",
  borderColor: "divider",

  transition:
    "transform 0.3s ease, box-shadow 0.3s ease",
};

export const darkCardHover = {
  "&:hover": {
    transform: "translateY(-6px)",
  },
};


// ======================================================
// ICON BOXES
// ======================================================

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


// ======================================================
// SECTION CONTAINER
// ======================================================

export const sectionContainerSx = {
  position: "relative",
  zIndex: 1,
};


// ======================================================
// SECTION LABEL
// ======================================================

export const sectionLabelSx = {
  color: COLORS.teal,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "1.5px",
  mb: 1.5,
};