import { Alert, Box, Divider, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useEffect, useState } from "react";
import { countProfile, searchProfilePagination } from "src/api/profile";
import { CardAdminProfile } from "src/component/card/CardProfile";
import { BasicSearchInput } from "src/component/Input";
import { Pagination } from "src/component/page/Pagination";
import { SkeletonPlayers } from "src/component/skeleton/SkeletonPlayer";
import { Profile } from "src/models/Profile";
import { DetailProfileAdminModal } from "src/component/modal/DetailProfileAdminModal";
import { MultiAccountSwitch } from "src/component/switch/MultiAccountSwitch";

interface Query {
  search: string;
  page: number;
  itemPerPage: number;
  multicompte: boolean;
}
export default function AdminUsersPage() {
  const { t } = useTranslation();

  const [query, setQuery] = useState<Query>({
    search: "",
    page: 0,
    itemPerPage: 20,
    multicompte: false,
  });
  const [profiles, setProfiles] = useState<Array<Profile>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState<number | null>(null);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);

  useEffect(() => {
    setIsLoading(true);
    setProfiles([]);
    searchProfilePagination(
      query.search,
      [],
      query.page,
      query.itemPerPage,
      query.multicompte
    ).then(({ data }) => {
      setIsLoading(false);
      setProfiles(data ?? []);
    });

    countProfile(query.search).then(({ count }) => {
      setCount(count);
    });
  }, [query]);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setQuery((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const refreshProfile = (newProfile: Profile) => {
    setProfiles((prevProfiles) =>
      prevProfiles.map((profile) =>
        profile.id === newProfile.id ? newProfile : profile,
      ),
    );
  };

  const selectProfile = (value: Profile) => {
    setProfile(value);
  };

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <BasicSearchInput
          label={t("commun.searchplayer")}
          onChange={(value) => {
            setQuery((prev) => ({
              ...prev,
              search: value,
              page: 0,
            }));
          }}
          value={query.search}
          clear={() => {
            setQuery((prev) => ({
              ...prev,
              search: "",
              page: 0,
            }));
          }}
        />
      </Grid>
      <Grid size={12}>
        <MultiAccountSwitch
          multicompte={query.multicompte}
          onChange={(value) => {
            setQuery((prev) => ({
              ...prev,
              page: 0,
              multicompte: value,
            }));
          }}
        />
      </Grid>

      <Grid size={12}>
        <Divider />
      </Grid>
      <Grid size={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            {profiles.map((profile) => (
              <Grid key={profile.id} size={{ xs: 12, lg: 6 }}>
                <CardAdminProfile
                  profile={profile}
                  refresh={refreshProfile}
                  select={selectProfile}
                />
              </Grid>
            ))}
            {isLoading && (
              <SkeletonPlayers number={20} size={{ xs: 12, lg: 6 }} />
            )}
            {!isLoading && profiles.length === 0 && (
              <Grid size={12}>
                <Alert severity="warning">{t("commun.noresult")}</Alert>
              </Grid>
            )}
            <Grid
              size={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Pagination
                total={count}
                page={query.page}
                handleChangePage={handleChangePage}
                rowsPerPage={query.itemPerPage}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <DetailProfileAdminModal
        profile={profile}
        open={profile !== undefined}
        close={() => setProfile(undefined)}
      />
    </Grid>
  );
}
