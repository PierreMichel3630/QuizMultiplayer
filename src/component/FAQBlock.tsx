import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const FAQBlock = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      title: t("faq.question1.title"),
      label: t("faq.question1.explain"),
      link: "/installation",
      expand: true,
    },
    {
      title: t("faq.question2.title"),
      label: t("faq.question2.explain"),
      link: "/register",
    },
    {
      title: t("faq.question3.title"),
      label: t("faq.question3.explain"),
      link: "/people",
    },
    {
      title: t("faq.question4.title"),
      label: t("faq.question4.explain"),
      link: "/people",
    },
    {
      title: t("faq.question5.title"),
      label: t("faq.question5.explain"),
      link: "/proposetheme",
    },
    {
      title: t("faq.question6.title"),
      label: t("faq.question6.explain"),
      link: "/improve",
    },
    {
      title: t("faq.question7.title"),
      label: t("faq.question7.explain"),
      link: "/report",
    },
  ];

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        {faqs.map((el, i) => (
          <Accordion defaultExpanded={el.expand} key={i}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography variant="h4">{el.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Trans
                i18nKey={el.label}
                values={{ link: t("commun.link") }}
                components={{ anchor: <Link to={el.link} /> }}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>
    </Grid>
  );
};
