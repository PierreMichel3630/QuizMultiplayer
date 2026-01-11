import { RealtimeChannel } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { selectNotificationsNotRead } from "src/api/notification";
import { supabase } from "src/api/supabase";
import { Config } from "src/models/Config";
import { NotificationType } from "src/models/enum/NotificationType";
import { Notification } from "src/models/Notification";
import { isVersionGreater } from "src/utils/compare";
import { VERSION_APP } from "src/utils/config";
import { useAuth } from "./AuthProviderSupabase";
import { selectConfig } from "src/api/config";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const RealtimeContext = createContext<{
  config?: Config;
  notifications: Array<Notification>;
  needUpdate: boolean;
  getNotifications: () => void;
}>({
  config: undefined,
  notifications: [],
  needUpdate: false,
  getNotifications: () => {},
});

export const useRealtime = () => useContext(RealtimeContext);

export const RealtimeProvider = ({ children }: Props) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<Array<Notification>>([]);
  const [config, setConfig] = useState<undefined | Config>(undefined);

  const needUpdate = useMemo(() => {
    const result = config
      ? isVersionGreater(config.version_app, VERSION_APP)
      : false;
    return result;
  }, [config]);

  useEffect(() => {
    const getConfig = () => {
      selectConfig().then(({ data }) => {
        setConfig(data ?? undefined);
      });
    };
    getConfig();
  }, []);

  const getNotifications = useCallback(() => {
    if (user) {
      selectNotificationsNotRead(user.id).then(({ data }) => {
        const res = data === null ? [] : (data as Array<Notification>);
        setNotifications(res);
      });
    }
  }, [user]);

  useEffect(() => {
    let channel: RealtimeChannel | undefined = undefined;
    if (user?.id) {
      const id = user.id;
      getNotifications();
      channel = supabase
        .channel("realtime")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notification",
            filter: `profile=eq.${id}`,
          },
          (payload) => {
            const notification = payload.new as Notification;
            setNotifications((prev) => [...prev, notification]);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "notification",
          },
          (payload) => {
            const notification = payload.old as Notification;
            setNotifications((prev) => {
              return [...prev].filter((el) => el.id !== notification.id);
            });
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "notification",
            filter: `profile=eq.${id}`,
          },
          (payload) => {
            const notification = payload.new as Notification;
            setNotifications((prev) =>
              [...prev].map((el) =>
                el.id === notification.id ? notification : el
              )
            );
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "config",
          },
          (payload) => {
            const config = payload.new as Config;
            setConfig(config);
          }
        )
        .subscribe();
    } else {
      channel = supabase
        .channel("realtime")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "config",
          },
          (payload) => {
            const config = payload.new as Config;
            setConfig(config);
          }
        )
        .subscribe();
    }
    return () => {
      channel?.unsubscribe();
    };
  }, [getNotifications, user]);

  const notificationDisplay = useMemo(() => {
    const enumValues = Object.values(NotificationType);

    return [...notifications].filter((notification) =>
      enumValues.includes(notification.type)
    );
  }, [notifications]);

  const value = useMemo(
    () => ({
      notifications: notificationDisplay,
      getNotifications,
      needUpdate,
      config,
    }),
    [notificationDisplay, getNotifications, needUpdate, config]
  );

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};
