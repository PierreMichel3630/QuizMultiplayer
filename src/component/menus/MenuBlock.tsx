import AppsIcon from "@mui/icons-material/Apps";
import BarChartIcon from "@mui/icons-material/BarChart";
import BrushIcon from "@mui/icons-material/Brush";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import EditIcon from "@mui/icons-material/Edit";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpIcon from "@mui/icons-material/Help";
import HistoryIcon from "@mui/icons-material/History";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import NoteIcon from "@mui/icons-material/Note";
import PeopleIcon from "@mui/icons-material/People";
import PieChartIcon from "@mui/icons-material/PieChart";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Badge,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { getThemesAndCategoriesById } from "src/api/search";
import { useAppBar } from "src/context/AppBarProvider";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useRealtime } from "src/context/NotificationProvider";
import { useUser } from "src/context/UserProvider";
import { useGameModes } from "src/hook/useGameModes";
import { DrawerSize } from "src/models/enum/DrawerSize";
import { NotificationType } from "src/models/enum/NotificationType";
import { getLink } from "src/utils/link";
import { BadgeDot } from "../badge/BadgeDot";
import { NotificationBadgeIcon } from "../button/NotificationBadge";
import { ICardImage } from "../card/CardImage";
import { ImageTypeCard } from "../image/ImageCard";

interface MenuTitle {
  title: string;
  menus: Array<Menu>;
}

interface Menu {
  value: string;
  label: string;
  icon: JSX.Element;
  to?: string;
  state?: unknown;
  notifications?: boolean;
  onClick?: () => void;
}

interface Props {
  sizeDrawer?: DrawerSize;
  onRedirect?: () => void;
}

export const MenuBlock = ({
  sizeDrawer = DrawerSize.MEDIUM,
  onRedirect,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { notifications } = useRealtime();
  const { profile, hasPlayChallenge } = useAuth();
  const { toogleOpenDrawer } = useAppBar();
  const { language } = useUser();
  const { favorites } = useApp();
  const { allValues } = useGameModes();

  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);
  const [maxFavoriteDisplay, setMaxFavoriteDisplay] = useState(2);

  const [maxGameModeDisplay, setMaxGameModeDisplay] = useState(2);

  const isSmallDrawer = useMemo(
    () => sizeDrawer === DrawerSize.SMALL,
    [sizeDrawer],
  );

  useEffect(() => {
    if (favorites.length > 0 && language) {
      const idCategories = [...favorites]
        .filter((el) => el.category)
        .map((el) => Number(el.category));
      const idThemes = [...favorites]
        .filter((el) => el.theme)
        .map((el) => Number(el.theme));
      getThemesAndCategoriesById(language, idCategories, idThemes).then(
        ({ data }) => {
          setItemsSearch(data ?? []);
        },
      );
    } else {
      setItemsSearch([]);
    }
  }, [favorites, language]);

  const notificationsAccomplishment = useMemo(
    () =>
      [...notifications].filter(
        (el) =>
          el.isread === false &&
          el.type === NotificationType.accomplishment_unlock,
      ).length,
    [notifications],
  );

  const menuAccount = useMemo(
    () => ({
      title: t("commun.account"),
      menus: [
        {
          value: "friends",
          label: t("commun.myfriends"),
          icon: <PeopleIcon fontSize="large" />,
          to: "/people",
        },
        {
          value: "notifications",
          label: t("commun.notifications"),
          icon: <NotificationBadgeIcon />,
          to: "/notifications",
        },
        {
          value: "personalized",
          label: t("commun.personalizedprofile"),
          icon: <BrushIcon fontSize="large" />,
          to: "/personalized",
        },
        {
          value: "statistical",
          label: t("commun.mystatistics"),
          icon: <PieChartIcon fontSize="large" />,
          to: profile ? `/profil/${profile.id}` : "/login",
        },
        {
          value: "accomplishments",
          label: t("commun.myaccomplishments"),
          icon: (
            <Badge badgeContent={notificationsAccomplishment} color="error">
              <MilitaryTechIcon fontSize="large" />
            </Badge>
          ),
          to: `/accomplishments`,
        },
        {
          value: "proposals",
          label: t("commun.myproposals"),
          icon: <EditIcon fontSize="large" />,
          to: profile ? `/myproposals` : "/login",
        },
        {
          value: "history",
          label: t("commun.mygames"),
          icon: <HistoryIcon fontSize="large" />,
          to: profile ? `/games` : "/login",
          state: profile ? { player: profile } : undefined,
        },
        {
          label: t("commun.compare"),
          icon: <CompareArrowsIcon fontSize="large" />,
          value: "compare",
          to: "/compare",
          state: { profile1: profile },
        },
      ],
    }),
    [notificationsAccomplishment, profile, t],
  );

  const menuGlobal = useMemo(
    () => ({
      title: t("commun.global"),
      menus: [
        {
          value: "themes",
          label: t("commun.themes"),
          icon: <AppsIcon fontSize="large" />,
          to: "/",
        },
        {
          value: "challenge",
          label: t("commun.daychallenge"),
          icon: <EmojiEventsIcon fontSize="large" />,
          to: "/challenge",
          notifications: !hasPlayChallenge,
        },
        {
          value: "ranking",
          label: t("commun.ranking"),
          icon: <BarChartIcon fontSize="large" />,
          to: "/ranking",
        },
        {
          value: "accomplishments",
          label: t("commun.accomplishments"),
          icon: <MilitaryTechIcon fontSize="large" />,
          to: "/accomplishments",
        },
        {
          value: "parameters",
          label: t("commun.parameters"),
          icon: <SettingsIcon fontSize="large" />,
          to: "/parameters",
        },
      ],
    }),
    [t, hasPlayChallenge],
  );

  const menuHelp = useMemo(
    () => ({
      title: t("commun.helpregulations"),
      menus: [
        {
          value: "help",
          label: t("commun.help"),
          icon: <HelpIcon fontSize="large" />,
          to: "/help",
        },
        {
          value: "installation",
          label: t("commun.installation"),
          icon: <InstallMobileIcon fontSize="large" />,
          to: "/installation",
        },
        {
          value: "report",
          label: t("commun.reportproblem"),
          icon: <ReportProblemIcon fontSize="large" />,
          to: "/report",
        },
        {
          value: "patchnote",
          label: t("commun.patchnote"),
          icon: <NoteIcon fontSize="large" />,
          to: "/news",
        },
      ],
    }),
    [t],
  );

  const goTo = (value?: string) => {
    if (value) {
      navigate(value);
      toogleOpenDrawer();
    }
  };

  const gameModeDisplay = useMemo(() => {
    return [...allValues].slice(0, maxGameModeDisplay).map((el) => {
      return {
        label: el.name,
        icon: <ImageTypeCard type={el.type} value={el} size={35} />,
        value: el.id.toString(),
        onClick: el.onClick,
      };
    });
  }, [maxGameModeDisplay, allValues]);

  const isEndGameMode = useMemo(
    () => allValues.length <= maxGameModeDisplay,
    [allValues, maxGameModeDisplay],
  );

  const favoritesDisplay = useMemo(() => {
    return [...itemsSearch].slice(0, maxFavoriteDisplay).map((el) => {
      const link = getLink(el.type, el.id);
      return {
        label: el.name,
        icon: <ImageTypeCard type={el.type} value={el} size={35} />,
        to: link,
        value: el.id.toString(),
      };
    });
  }, [maxFavoriteDisplay, itemsSearch]);

  const isEndFavorite = useMemo(
    () => favorites.length <= maxFavoriteDisplay,
    [favorites, maxFavoriteDisplay],
  );

  return (
    <Box>
      <Grid size={12} sx={{ pt: 1, pl: 1, pr: 1 }}>
        <MenuCard
          value={menuGlobal}
          sizeDrawer={sizeDrawer}
          onRedirect={onRedirect}
        />
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
      {profile && favoritesDisplay.length > 0 && (
        <>
          <Grid size={12} sx={{ pt: 1, pl: 1, pr: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => goTo("/favorite")}
            >
              <Typography variant="h4">{t("commun.favorite")}</Typography>
              <KeyboardArrowRightIcon fontSize="large" />
            </Box>
            <List dense>
              {[...favoritesDisplay].map((value, i) => (
                <MenuItem key={i} menu={value} size={sizeDrawer} />
              ))}
            </List>
            {itemsSearch.length > 2 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: isSmallDrawer ? px(2) : 2,
                  pl: isSmallDrawer ? px(2) : 1,
                  cursor: "pointer",
                }}
                onClick={() =>
                  setMaxFavoriteDisplay((prev) =>
                    isEndFavorite ? 2 : prev + 3,
                  )
                }
              >
                {isEndFavorite ? (
                  <ExpandLessIcon fontSize="large" />
                ) : (
                  <ExpandMoreIcon fontSize="large" />
                )}
                <Typography variant="h6">
                  {isEndFavorite ? t("commun.less") : t("commun.more")}
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
        </>
      )}
      <Grid size={12} sx={{ pt: 1, pl: 1, pr: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => goTo("/gamemode")}
        >
          <Typography variant="h4">{t("commun.gamemode")}</Typography>
          <KeyboardArrowRightIcon fontSize="large" />
        </Box>
        <List dense>
          {[...gameModeDisplay].map((value, i) => (
            <MenuItem key={i} menu={value} size={sizeDrawer} />
          ))}
        </List>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: isSmallDrawer ? px(2) : 2,
            pl: isSmallDrawer ? px(2) : 1,
            cursor: "pointer",
          }}
          onClick={() =>
            setMaxGameModeDisplay((prev) => (isEndGameMode ? 3 : prev + 3))
          }
        >
          {isEndGameMode ? (
            <ExpandLessIcon fontSize="large" />
          ) : (
            <ExpandMoreIcon fontSize="large" />
          )}
          <Typography variant="h6">
            {isEndGameMode ? t("commun.less") : t("commun.more")}
          </Typography>
        </Box>
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
      {profile && (
        <>
          <Grid size={12} sx={{ pt: 1, pl: 1, pr: 1 }}>
            <MenuCard
              value={menuAccount}
              sizeDrawer={sizeDrawer}
              onRedirect={onRedirect}
            />
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
        </>
      )}
      <Grid size={12} sx={{ pt: 1, pl: 1, pr: 1 }}>
        <MenuCard
          value={menuHelp}
          sizeDrawer={sizeDrawer}
          onRedirect={onRedirect}
        />
      </Grid>
    </Box>
  );
};

interface PropsMenuCard {
  value: MenuTitle;
  sizeDrawer: DrawerSize;
  onRedirect?: () => void;
}

const MenuCard = ({ value, sizeDrawer, onRedirect }: PropsMenuCard) => {
  return (
    <>
      <MenuTitle title={value.title} />
      <List dense>
        {[...value.menus].map((menu, i) => (
          <MenuItem
            key={i}
            menu={menu}
            size={sizeDrawer}
            onRedirect={onRedirect}
          />
        ))}
      </List>
    </>
  );
};

interface PropsMenuTitle {
  title: string;
}
const MenuTitle = ({ title }: PropsMenuTitle) => {
  return <Typography variant="h4">{title}</Typography>;
};

interface PropsMenuItem {
  menu: Menu;
  size?: DrawerSize;
  onRedirect?: () => void;
}
const MenuItem = ({
  menu,
  size = DrawerSize.MEDIUM,
  onRedirect,
}: PropsMenuItem) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMedium = useMemo(() => size === DrawerSize.MEDIUM, [size]);

  const isSelected = useMemo(
    () =>
      menu.to !== undefined &&
      (location.pathname === menu.to ||
        location.pathname.startsWith(menu.to + "/")),
    [menu, location],
  );

  const goTo = (menu: Menu) => {
    if (menu.onClick) {
      menu.onClick();
    } else {
      if (menu.to) {
        navigate(menu.to, {
          state: menu.state,
        });
      }
    }
    if (onRedirect) {
      onRedirect();
    }
  };

  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={isSelected}
        sx={
          isMedium
            ? {}
            : {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }
        }
        onClick={() => goTo(menu)}
      >
        <ListItemIcon sx={isMedium ? {} : { minWidth: "inherit" }}>
          {menu.icon}
        </ListItemIcon>
        <ListItemText
          sx={isMedium ? {} : { textAlign: "center" }}
          primary={
            <Typography variant={isMedium ? "body1" : "caption"}>
              {menu.label}
            </Typography>
          }
        />
        {menu.notifications && <BadgeDot />}
      </ListItemButton>
    </ListItem>
  );
};
