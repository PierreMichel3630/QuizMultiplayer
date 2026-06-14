const XP_PER_LEVEL_HIGH = 3000;
// Seuil à partir duquel la progression devient linéaire
const THRESHOLD_LEVEL = 10; 
// XP requise pour atteindre le niveau seuil avec l'ancien système (ou une constante fixe)
const XP_AT_THRESHOLD = 10000; 

export const getExperienceByLevel = (level: number) => {
  if (level <= THRESHOLD_LEVEL) {
    // Courbe de début (ex: exponentielle ou quadratique)
    // Ici, on fait en sorte que le niveau THRESHOLD_LEVEL vaille exactement XP_AT_THRESHOLD
    return Math.pow(level / THRESHOLD_LEVEL, 2) * XP_AT_THRESHOLD;
  }
  
  // À haut niveau : Formule mathématique directe (sans boucle)
  // XP = XP du palier + (nombre de niveaux au-dessus du palier * 3000)
  return XP_AT_THRESHOLD + (level - THRESHOLD_LEVEL) * XP_PER_LEVEL_HIGH;
};

export const getLevel = (xp: number) => {
  if (xp <= XP_AT_THRESHOLD) {
    // Inversion de la formule du bas niveau
    return Math.floor(Math.sqrt(xp / XP_AT_THRESHOLD) * THRESHOLD_LEVEL);
  }
  
  // Inversion de la formule du haut niveau
  return Math.floor(THRESHOLD_LEVEL + (xp - XP_AT_THRESHOLD) / XP_PER_LEVEL_HIGH);
};